import { getServerEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";
import { contactSchema } from "@/lib/contact-schema";

/**
 * The contact form's lead. Validated with the same schema the form uses, then
 * forwarded to the CRM / webhook in `CONTACT_ENDPOINT` (server-only env var),
 * role and company size included as their own fields.
 */
export const POST = handle(async (req) => {
  const { website, ...lead } = contactSchema.parse(await req.json());

  // A filled honeypot is a bot: answer as if accepted, deliver nothing.
  if (website) return { received: true };

  const { CONTACT_ENDPOINT } = getServerEnv();

  if (CONTACT_ENDPOINT) {
    const upstream = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...lead, source: "ctrl-shift.co.il/contact" }),
    });
    if (!upstream.ok) {
      throw new ApiError(502, "upstream_error", "Failed to deliver the message.");
    }
  } else {
    // ponytail: no CRM endpoint configured yet. The whole lead goes to the
    // server log so none is lost; set CONTACT_ENDPOINT before launch.
    console.warn("[api/contact] CONTACT_ENDPOINT unset; lead logged only:", JSON.stringify(lead));
  }

  return { received: true };
});
