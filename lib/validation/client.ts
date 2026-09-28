import { z } from "zod";

export const clientCreateSchema = z.object({
  clientType: z.enum(["individual", "business"]),
  displayName: z.string().trim().min(2).max(200),
  legalName: z.string().trim().max(200).optional(),
  tradeName: z.string().trim().max(200).optional(),
  branchId: z.string().uuid(),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(4000).optional(),
}).strict();

export const clientUpdateSchema = clientCreateSchema;

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
