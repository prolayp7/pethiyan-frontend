import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Package, Users, Award, Leaf, ShieldCheck, Truck, HeadphonesIcon, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Pethiyan — India's trusted packaging brand for custom pouches, kraft bags, and eco-friendly packaging solutions for 50,000+ businesses.",
};

const STATS = [
  { value: "50,000+", label: "Happy Businesses" },
  { value: "100+",    label: "Product Variants" },
  { value: "28",      label: "States Served" },
  { value: "5★",      label: "Average Rating" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Eco-First",
    desc: "We source sustainable materials and design packaging that minimises environmental impact without compromising on quality.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "Every product leaves our facility after rigorous quality checks — because your brand deserves nothing less.",
  },
  {
    icon: Users,
    title: "Customer-Centric",
    desc: "From first inquiry to repeat orders, we are here at every step with fast support and flexible solutions.",
  },
];

const WHY_US = [
  { icon: Package,       title: "Wide Range",        desc: "100+ packaging types from stand-up pouches to custom printed boxes." },
  { icon: ShieldCheck,   title: "BIS Certified",     desc: "All materials meet Indian food-safety and packaging standards." },
  { icon: Truck,         title: "Pan-India Delivery", desc: "Reliable shipping to all 28 states with real-time tracking." },
  { icon: HeadphonesIcon, title: "24/7 Support",      desc: "Dedicated support team via chat, email, and phone." },
  { icon: RefreshCw,     title: "Easy Returns",       desc: "7-day hassle-free returns on all standard products." },
  { icon: Leaf,          title: "Eco Options",        desc: "Compostable, recycled, and kraft packaging options available." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--background)" }}>
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]">
                <Package className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">About Us</h1>
                <p className="mt-0.5 text-gray-500 text-sm">Learn how Pethiyan helps Indian businesses package better, faster, and smarter.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">About Us</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-gray-100">
        <Container className="py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl lg:text-4xl font-extrabold text-(--color-primary)">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Our Story ── */}
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">
              Our Story
            </p>
            <h2 className="text-3xl font-extrabold text-(--color-secondary) leading-tight mb-5">
              Built for India's Growing Businesses
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Pethiyan started as a simple idea: small and medium businesses in India
                deserved the same premium packaging options that large corporations had
                access to — without the high minimum order quantities or the wait.
              </p>
              <p>
                We work directly with certified manufacturers across India to bring you a
                curated range of pouches, bags, jars, and boxes — all available for order
                online, with GST invoices, and delivered to your doorstep.
              </p>
              <p>
                Today, over 50,000 food brands, nutraceutical companies, artisan makers,
                and D2C startups trust Pethiyan to pack their most important product.
              </p>
            </div>
          </div>

          {/* Image placeholder */}
          <div
            className="relative h-80 lg:h-96 rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#4caf50 100%)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-24 w-24 text-white opacity-20" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
              <p className="text-2xl font-extrabold">Made in India</p>
              <p className="text-white/70 text-sm mt-2">Quality packaging for Indian businesses</p>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Values ── */}
      <div className="bg-white py-16 lg:py-20 border-y border-gray-100">
        <Container>
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-3xl font-extrabold text-(--color-secondary)">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                  style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-(--color-secondary) mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Why Choose Us ── */}
      <Container className="py-16 lg:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-2">Why Pethiyan</p>
          <h2 className="text-3xl font-extrabold text-(--color-secondary)">Everything Your Business Needs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-(--color-primary)" />
              </div>
              <div>
                <h3 className="font-bold text-(--color-secondary) text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ── CTA Banner ── */}
      <div
        className="py-16"
        style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
      >
        <Container className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready to Upgrade Your Packaging?
          </h2>
          <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
            Browse our full catalogue and place your order in minutes — no minimum quantity, GST invoice included.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ background: "#4caf50", color: "#fff" }}
          >
            Shop Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Container>
      </div>
    </div>
  );
}
