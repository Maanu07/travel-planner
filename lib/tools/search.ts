import { TavilySearch } from "@langchain/tavily";

console.log(process.env.TAVILY_API_KEY);
export const searchTool = new TavilySearch({
  maxResults: 5,
  tavilyApiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
});

// const result = await searchTool.invoke({
//   query: "best places to visit in Vietnam 2026",
// });

// console.log(result);
