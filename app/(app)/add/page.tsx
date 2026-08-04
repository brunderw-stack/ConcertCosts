import { redirect } from "next/navigation";
import { ConcertForm } from "@/components/ConcertForm";
import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";

export default async function AddConcertPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Concert"
        subtitle="Tell us about the show and what it cost. We'll add up the totals for you."
      />
      <ConcertForm userId={user.id} />
    </div>
  );
}
