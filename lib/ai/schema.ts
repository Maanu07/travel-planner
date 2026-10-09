import { z } from "zod";

export const travelPlanRequestSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, "Destination must be at least 2 characters"),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(30, "Duration cannot exceed 30 days"),

  budget: z.string().trim().min(1, "Budget is required"),

  interests: z.array(z.string()).min(1, "Please select at least one interest"),

  travelStyle: z.string().trim().min(2, "Travel style is required"),
});

export const travelPlanSchema = z.object({
  overview: z.string(),

  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      activities: z.array(z.string()),
    }),
  ),

  attractions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),

  budget: z.object({
    accommodation: z.number(),
    food: z.number(),
    transportation: z.number(),
    activities: z.number(),
    miscellaneous: z.number(),
    total: z.number(),
    currency: z.string(),
  }),

  tips: z.array(z.string()),
});
