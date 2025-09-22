import { z } from "zod";

export const errorResponseSchema = z.object({
  status: z.literal("error"),
  error: z.string(),
  error_code: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
