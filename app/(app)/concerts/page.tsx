import Link from "next/link";
import { ConcertsBrowser } from "@/components/ConcertsBrowser";
import { EmptyState } from "@/components/EmptyState";
import { LoadError } from "@/components/LoadError";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export default async function MyConcertsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  const concerts = (data ?? []) as Concert[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Concerts"
        subtitle="Everything you've logged - costs, fun scores, and notes."
        action={
          concerts.length > 0 ? (
            <Link href="/add" className="btn btn-primary btn-sm">
              Add concert
            </Link>
          ) : null
        }
      />

      {error ? (
        <LoadError />
      ) : concerts.length === 0 ? (
        <EmptyState
          title="Your concert list is empty"
          message="Your concert list is empty. Add your first show."
          ctaLabel="Add your first show"
        />
      ) : (
        <ConcertsBrowser concerts={concerts} />
      )}
    </div>
  );
}
