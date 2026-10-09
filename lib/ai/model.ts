import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  temperature: 0.2,
});

// gemini-3.6-flash
// gemini-3.5-flash-lite
