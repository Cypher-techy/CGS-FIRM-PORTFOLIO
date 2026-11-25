import "server-only";
// Persist first; notification failures must never encourage duplicating a saved submission.
export async function notify(module: string) {
  const { RESEND_API_KEY, NOTIFICATION_EMAIL, NOTIFICATION_FROM } = process.env;
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL || !NOTIFICATION_FROM) return;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFICATION_FROM,
        to: [NOTIFICATION_EMAIL],
        subject: `CGS: new ${module} submission`,
        text: `A new submission is ready for review in CGS Admin → ${module}.`,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error("Notification delivery failed", r.status);
  } catch {
    console.error("Notification service unavailable");
  }
}
