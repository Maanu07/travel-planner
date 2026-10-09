import { ChatPromptTemplate } from "@langchain/core/prompts";

import { model } from "./model";
import { travelPlanSchema } from "./schema";

const structuredOutputPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You convert a travel plan into a structured format.

Use only the information provided in the travel plan.
Do not invent new information.
Make sure all required fields are present.`,
  ],
  [
    "human",
    `Convert this travel plan into the required structured format:

{travelPlan}`,
  ],
]);

const structuredModel = model.withStructuredOutput(travelPlanSchema);

export const travelPlanStructuredChain =
  structuredOutputPrompt.pipe(structuredModel);
