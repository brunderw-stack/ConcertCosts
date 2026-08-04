import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { EmptyState } from "@/components/EmptyState";
import { LoadError } from "@/components/LoadError";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  const concerts = (data ?? []) as Concert[];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="A quick look at how much you spend and how much fun you get back."
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
          title="No numbers yet"
          message="No numbers yet - log a concert to unlock your stats."
          ctaLabel="Add your first concert"
        />
      ) : (
        <>
          <DashboardStats concerts={concerts} />
          <DashboardCharts concerts={concerts} />
        </>
      )}
    </div>
  );
}
