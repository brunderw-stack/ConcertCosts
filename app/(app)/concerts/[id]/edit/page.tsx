import { notFound, redirect } from "next/navigation";
import { ConcertForm } from "@/components/ConcertForm";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditConcertPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const concert = data as Concert;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Concert"
        subtitle={`Update details and costs for ${concert.concert_name}.`}
      />
      <ConcertForm userId={user.id} concert={concert} />
    </div>
  );
}
