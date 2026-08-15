import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// ─── Easepay/Easebuzz payment response callback (surl/furl) ──────────────────
//
// Easebuzz redirects the paying user's browser here via a POST (not GET/query
// string) after they complete or abandon a payment — see EasepayService::
// initiatePayment() on the backend, where surl/furl are set to this URL. The
// POST body carries the actual transaction result (txnid, status, hash, etc.);
// a plain Next.js page route can't receive a POST body, which is why this had
// to be a dedicated route handler rather than pointing surl/furl straight at
// /checkout.
//
// We forward the raw payload to the backend's existing hash-verified webhook
// endpoint (server-to-server, no auth needed there) so the order gets captured
// as fast as possible, then redirect the browser to a clean GET URL for the
// checkout page to render. CheckoutClient.tsx also independently re-verifies
// via /api/easepay/verify-payment on that redirect, so a failure to forward
// here isn't fatal — this is a fast path, not the only path.

export async function POST(req: NextRequest) {
  let payload: Record<string, string> = {};
  try {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
  } catch {
    try {
      payload = (await req.json()) as Record<string, string>;
    } catch {
      payload = {};
    }
  }

  try {
    await fetch(`${API_BASE}/api/easepay/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[easepay/callback] failed to forward payload to backend webhook:", err);
  }

  const status = (payload.status ?? "").toLowerCase();
  const redirectStatus = status === "success" ? "success" : "failed";

  // Use the canonical SITE_URL rather than req.url — behind the production
  // reverse proxy, req.url reflects whatever host the Next.js process itself
  // sees (e.g. localhost:3000), not the public pethiyan.com host, unless the
  // proxy forwards the original Host header perfectly.
  return NextResponse.redirect(`${SITE_URL}/checkout?payment_status=${redirectStatus}`, { status: 303 });
}
