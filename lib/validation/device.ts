import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const deviceCreateSchema = z.object({
  branchId: z.string().uuid(),
  clientId: z.string().uuid(),
  deviceTypeId: z.string().uuid(),
  manufacturer: optionalText(120),
  model: optionalText(120),
  serialNumber: optionalText(160),
  serviceTag: optionalText(160),
  patrimony: optionalText(120),
  hostname: optionalText(120),
  operatingSystem: optionalText(120),
  systemVersion: optionalText(120),
  architecture: optionalText(60),
  processor: optionalText(200),
  memoryRam: optionalText(80),
  storage: optionalText(120),
  gpu: optionalText(160),
  motherboard: optionalText(160),
  macAddress: optionalText(40),
  ipAddress: optionalText(64),
  notes: optionalText(4000),
  acquisitionDate: z.string().date().optional().or(z.literal("")),
  manufacturerWarrantyUntil: z.string().date().optional().or(z.literal("")),
  status: z.enum(["with_client", "in_repair", "in_stock", "retired", "lost"]).optional(),
  currentLocation: optionalText(200),
}).strict();

export const deviceUpdateSchema = deviceCreateSchema;

export type DeviceCreateInput = z.infer<typeof deviceCreateSchema>;
