import { z } from "zod";

export const onboardingSchema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  branchName: z.string().trim().min(2).max(160),
  branchCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{2,32}$/),
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(40).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
