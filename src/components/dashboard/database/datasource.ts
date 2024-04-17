import { z } from "zod";

export const DatasourceViewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  viewName: z.string(),
  datasourceName: z.string(),
  metadata: z.any(),
});

export type DatasourceView = z.infer<typeof DatasourceViewSchema>;
