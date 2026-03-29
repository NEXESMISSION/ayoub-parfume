/** Simple probe for hosting (e.g. Vercel) — should return 200 when the deployment is live. */
export function GET() {
  return Response.json({ ok: true });
}
