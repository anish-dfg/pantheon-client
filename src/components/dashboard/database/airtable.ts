import { z } from "zod";

export const BaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string(),
});

export type Base = z.infer<typeof BaseSchema>;

export const FieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  description: z.string().optional(),
  options: z.string().optional(),
});

export type Field = z.infer<typeof FieldSchema>;

export const ViewSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  visibleFieldIds: z.array(z.string()).optional(),
});

export type View = z.infer<typeof ViewSchema>;

export const TableSchema = z.object({
  id: z.string(),
  primaryFieldId: z.string(),
  name: z.string(),
  desription: z.string(),
  fields: z.array(FieldSchema),
  views: z.array(ViewSchema),
});

export type Table = z.infer<typeof TableSchema>;

export const AirtableBaseSchemaSchema = z.object({
  tables: z.array(TableSchema),
});

export type AirtableBaseSchema = z.infer<typeof AirtableBaseSchemaSchema>;
