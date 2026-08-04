import Link from "next/link";
import { Music } from "lucide-react";

export function EmptyState({
  title = "Your stage is empty",
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  ctaLabel = "Add your first concert",
  href = "/add",
}: {
  title?: string;
  message?: string;
  ctaLabel?: string;
  href?: string;
}) {
  return (
    <div className="card card-hover border border-dashed border-base-300 bg-base-100 shadow-sm">
      <div className="card-body items-center gap-3 text-center">
        <div className="empty-float rounded-full bg-primary/15 p-4 text-primary">
          <Music className="size-8" />
        </div>
        <h2 className="card-title font-display justify-center">{title}</h2>
        <p className="max-w-md text-base-content/70">{message}</p>
        <div className="card-actions mt-2">
          <Link href={href} className="btn btn-primary">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
