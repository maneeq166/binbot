import { z } from "zod";

export const wasteSchema = z.object({
  query: z.string().trim().min(1, "Item name is required"),
  mode: z.enum(["text", "image"]).default("text")
});
