import { z } from "zod";

export const JobSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.any(),
  jobType: z.string(),
});

export type Job = z.infer<typeof JobSchema>;
