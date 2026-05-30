import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
}

export default function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const featuredImageSizes =
    variant === "featured"
      ? "(min-width: 1024px) 42vw, (min-width: 640px) 50vw, calc(100vw - 3rem)"
      : "(min-width: 1280px) 31vw, (min-width: 768px) 47vw, calc(100vw - 3rem)";

  return (
    <article
      className={cn(
        "group h-full flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block shrink-0">
        <div className={cn("relative overflow-hidden", variant === "featured" ? "aspect-[16/10]" : "aspect-[16/11]")}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes={featuredImageSizes}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-700">
            {post.category.replace(/-/g, " ")}
          </span>
          <span>{post.publishedAt}</span>
        </div>

        <div className="flex-1">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold leading-tight text-slate-950 transition group-hover:text-[var(--color-primary)]">
              {post.title}
            </h3>
          </Link>
          <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        </div>

        {/* Author + read time — stacked on mobile, inline on sm+ */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Clock3 className="h-3.5 w-3.5 shrink-0" />
            {post.readingTime}
          </div>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
        >
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
