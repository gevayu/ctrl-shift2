import { z } from "zod";

import { getServerEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";

const schema = z.object({
  email: z.email().max(200),
  /** Honeypot, as on the contact form. */
  website: z.string().max(200).optional().default(""),
});

/** Blog newsletter sign-up, forwarded to `NEWSLETTER_ENDPOINT`. */
export const POST = handle(async (req) => {
  const { email, website } = schema.parse(await req.json());
  if (website) return { received: true };

  const { NEWSLETTER_ENDPOINT } = getServerEnv();
  if (NEWSLETTER_ENDPOINT) {
    const upstream = await fetch(NEWSLETTER_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "ctrl-shift.co.il/blog" }),
    });
    if (!upstream.ok) throw new ApiError(502, "upstream_error", "Failed to subscribe.");
  } else {
    // ponytail: no mailing-list endpoint yet; logged so no sign-up is lost.
    console.warn("[api/newsletter] NEWSLETTER_ENDPOINT unset; sign-up logged only:", email);
  }
  return { received: true };
});
