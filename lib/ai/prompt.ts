import { ChatPromptTemplate } from "@langchain/core/prompts";

export const travelPlannerPrompt = ChatPromptTemplate.fromMessages([
  [
    "human",
    `Plan a trip with the following details:

Destination: {destination}
Duration: {duration} days
Budget: {budget}
Interests: {interests}
Travel style: {travelStyle}`,
  ],
]);
