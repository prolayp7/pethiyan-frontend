import { getAnnouncementBar } from "@/lib/api";

export default async function TopAnnouncementBar() {
  const data = await getAnnouncementBar();

  if (data && !data.topBar.active) return null;

  const text = data?.topBar.text ?? "The Power of Perfect Packaging — Trusted by 10,000+ Brands Worldwide";

  return (
    <div
      className="bg-(--color-secondary) text-white text-center py-1.5 px-4"
      role="banner"
      aria-label="Site announcement"
    >
      <p className="text-xs sm:text-sm font-medium tracking-wide">{text}</p>
    </div>
  );
}
