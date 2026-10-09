import { NextRequest, NextResponse } from "next/server";
import { travelPlannerAgent, travelPlannerChain } from "@/lib/ai/travelPlanner";
import { travelPlanRequestSchema } from "@/lib/ai/schema";
import { travelPlannerPrompt } from "@/lib/ai/prompt";
import { travelPlanStructuredChain } from "@/lib/ai/structured-output";

function getFinalResponse(result: any) {
  const messages = result.messages;

  return messages[messages.length - 1];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = travelPlanRequestSchema.safeParse(body);

    // console.log("zodResult", result);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    // 1. Create dynamic messages
    const messages = await travelPlannerPrompt.formatMessages(result.data);

    // 2. Run the agent
    const stream = await travelPlannerAgent.stream(
      {
        messages,
      },
      {
        streamMode: "updates",
      },
    );

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Initial status
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "status",
                message: "Planning your trip...",
              }) + "\n",
            ),
          );

          let searchStatusSent = false;
          let searchCompletedStatusSent = false;

          for await (const chunk of stream) {
            console.log("chunk", chunk);

            // Detect when the model requests a tool call

            const messages = chunk.model_request?.messages ?? [];

            const hasSearchRequest = messages.some((message) =>
              message.tool_calls?.some(
                (toolCall) => toolCall.name === "tavily_search",
              ),
            );

            if (!searchStatusSent && hasSearchRequest) {
              searchStatusSent = true;

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "status",
                    message: "Searching current information...",
                  }) + "\n",
                ),
              );
            }

            // Detect when the tool has been executed
            if (!searchCompletedStatusSent && chunk.tools) {
              searchCompletedStatusSent = true;

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "status",
                    message: "Analyzing search results...",
                  }) + "\n",
                ),
              );
            }

            // Final structured response
            if (chunk.model_request?.structuredResponse) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "result",
                    data: chunk.model_request?.structuredResponse,
                  }) + "\n",
                ),
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                message: "Failed to generate travel plan",
              }) + "\n",
            ),
          );

          controller.close();
        }
      },
    });

    // 3. Get the final AI response
    // const finalMessage = getFinalResponse(agentResult);

    // 4. Convert final response into TravelPlan
    // const travelPlan = await travelPlanStructuredChain.invoke({
    //   travelPlan: finalMessage.content,
    // });

    // console.log(travelPlan);

    return new Response(readableStream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Travel planner error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate travel plan",
      },
      { status: 500 },
    );
  }
}
