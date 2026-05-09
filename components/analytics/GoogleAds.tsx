import Script from "next/script";

export default function GoogleAds({
  id,
  beginCheckoutLabel,
}: {
  id: string;
  beginCheckoutLabel?: string;
}) {
  if (!id) return null;

  const config = JSON.stringify({ id, beginCheckoutLabel: beginCheckoutLabel ?? "" });

  return (
    <Script id="gads-config" strategy="lazyOnload">
      {`window.__GADS__=${config};gtag('config','${id}');`}
    </Script>
  );
}
