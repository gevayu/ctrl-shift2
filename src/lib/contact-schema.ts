import { z } from "zod";

import { EMPLOYEES, ROLES } from "@/data/contact";

/**
 * The contact form's payload — one schema for the form and the route, so the
 * two can never disagree. Lengths are generous caps against abuse, not UX.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(1).max(120),
  role: z.enum(ROLES),
  employees: z.enum(EMPLOYEES),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{9,20}$/),
  email: z.email().max(200),
  pain: z.string().trim().max(2000).optional().default(""),
  /** Honeypot: hidden from people, filled by bots. The route drops filled ones. */
  website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
