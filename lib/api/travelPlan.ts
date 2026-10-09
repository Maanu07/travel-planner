import type { TravelPlan } from "@/lib/ai/types";

export interface TravelPlanRequest {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  travelStyle: string;
}

export type TravelPlanStreamEvent =
  | {
      type: "status";
      message: string;
    }
  | {
      type: "result";
      data: TravelPlan;
    }
  | {
      type: "error";
      message: string;
    };

export async function generateTravelPlan(
  data: TravelPlanRequest,
  onStatus: (message: string) => void,
): Promise<TravelPlan> {
  const response = await fetch("/api/travel-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.body) {
    throw new Error("Streaming is not supported");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    // console.log("value", value);

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const lines = buffer.split("\n");

    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const event: TravelPlanStreamEvent = JSON.parse(line);

      // console.log("event", event);

      if (event.type === "status") {
        onStatus(event.message);
      }

      if (event.type === "error") {
        throw new Error(event.message);
      }

      if (event.type === "result") {
        return event.data;
      }
    }
  }

  throw new Error("Travel plan was not generated");
}
