import { z } from "zod";

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const FAQSchema = z.object({
  items: z.array(FAQItemSchema).min(1),
});

export type FAQItem = z.infer<typeof FAQItemSchema>;
export type FAQProps = z.infer<typeof FAQSchema>;
