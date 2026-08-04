"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/Motion";
import {
  calculateTotalCost,
  formatCurrency,
} from "@/lib/calculations";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";

type FormState = {
  concert_name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  concert_date: string;
  distance_from_home: string;
  hours_at_event: string;
  ticket_cost: string;
  ticket_fees: string;
  parking_cost: string;
  food_drink_cost: string;
  merchandise_cost: string;
  lodging_cost: string;
  travel_cost: string;
  other_cost: string;
  fun_rating: string;
  notes: string;
};

const INITIAL: FormState = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "",
  hours_at_event: "",
  ticket_cost: "",
  ticket_fees: "",
  parking_cost: "",
  food_drink_cost: "",
  merchandise_cost: "",
  lodging_cost: "",
  travel_cost: "",
  other_cost: "",
  fun_rating: "7",
  notes: "",
};

const fieldClass = "input input-bordered w-full";
const areaClass = "textarea textarea-bordered w-full min-h-24";

function FieldRow({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[12rem_1fr] sm:gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium sm:pt-3">
        {label}
      </label>
      <div className="min-w-0">
        {children}
        {hint ? (
          <p className="mt-1 text-xs text-base-content/60">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function money(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asField(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

function concertToForm(concert: Concert): FormState {
  return {
    concert_name: concert.concert_name,
    artist: concert.artist,
    venue: concert.venue,
    city: concert.city,
    state: concert.state,
    concert_date: concert.concert_date,
    distance_from_home: asField(concert.distance_from_home),
    hours_at_event: asField(concert.hours_at_event),
    ticket_cost: asField(concert.ticket_cost),
    ticket_fees: asField(concert.ticket_fees),
    parking_cost: asField(concert.parking_cost),
    food_drink_cost: asField(concert.food_drink_cost),
    merchandise_cost: asField(concert.merchandise_cost),
    lodging_cost: asField(concert.lodging_cost),
    travel_cost: asField(concert.travel_cost),
    other_cost: asField(concert.other_cost),
    fun_rating: asField(concert.fun_rating) || "7",
    notes: concert.notes ?? "",
  };
}

function payloadFromForm(form: FormState) {
  return {
    concert_name: form.concert_name.trim(),
    artist: form.artist.trim(),
    venue: form.venue.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    concert_date: form.concert_date,
    distance_from_home: money(form.distance_from_home),
    hours_at_event: money(form.hours_at_event),
    ticket_cost: money(form.ticket_cost),
    ticket_fees: money(form.ticket_fees),
    parking_cost: money(form.parking_cost),
    food_drink_cost: money(form.food_drink_cost),
    merchandise_cost: money(form.merchandise_cost),
    lodging_cost: money(form.lodging_cost),
    travel_cost: money(form.travel_cost),
    other_cost: money(form.other_cost),
    fun_rating: Number(form.fun_rating),
    notes: form.notes.trim() || null,
  };
}

export function ConcertForm({
  userId,
  concert,
}: {
  userId: string;
  concert?: Concert;
}) {
  const router = useRouter();
  const isEdit = Boolean(concert);
  const [form, setForm] = useState<FormState>(
    concert ? concertToForm(concert) : INITIAL,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalCost = useMemo(
    () =>
      calculateTotalCost({
        ticket_cost: money(form.ticket_cost),
        ticket_fees: money(form.ticket_fees),
        parking_cost: money(form.parking_cost),
        food_drink_cost: money(form.food_drink_cost),
        merchandise_cost: money(form.merchandise_cost),
        lodging_cost: money(form.lodging_cost),
        travel_cost: money(form.travel_cost),
        other_cost: money(form.other_cost),
      }),
    [form],
  );

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const payload = payloadFromForm(form);

    const { error: saveError } = isEdit
      ? await supabase
          .from("concerts")
          .update(payload)
          .eq("id", concert!.id)
          .eq("user_id", userId)
      : await supabase.from("concerts").insert({
          ...payload,
          user_id: userId,
        });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      toast.error(
        isEdit
          ? "Couldn't update this concert. Please try again."
          : "Couldn't save this concert. Please try again.",
      );
      return;
    }

    if (isEdit) {
      toast.success("Concert updated!");
      router.push("/concerts");
      router.refresh();
      return;
    }

    setForm(INITIAL);
    setSuccess(true);
    toast.success("Concert saved!");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 sm:pb-0">
      {success ? (
        <FadeIn>
          <div className="alert alert-success shadow-sm">
            <CheckCircle2 className="size-5" />
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Concert saved! Ready for another one whenever you are.</span>
              <Link href="/concerts" className="btn btn-sm btn-ghost">
                View My Concerts
              </Link>
            </div>
          </div>
        </FadeIn>
      ) : null}

      {error ? (
        <div className="alert alert-error shadow-sm">
          <span>{error}</span>
        </div>
      ) : null}

      <FadeIn delay={0.05}>
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-5">
            <h2 className="card-title font-display text-xl">Concert details</h2>
            <FieldRow label="Concert name" htmlFor="concert_name">
              <input
                id="concert_name"
                className={fieldClass}
                required
                value={form.concert_name}
                onChange={(e) => update("concert_name", e.target.value)}
                placeholder="Summer Night Tour"
              />
            </FieldRow>
            <FieldRow label="Artist or band" htmlFor="artist">
              <input
                id="artist"
                className={fieldClass}
                required
                value={form.artist}
                onChange={(e) => update("artist", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Venue" htmlFor="venue">
              <input
                id="venue"
                className={fieldClass}
                required
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="City" htmlFor="city">
              <input
                id="city"
                className={fieldClass}
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="State" htmlFor="state">
              <input
                id="state"
                className={fieldClass}
                required
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                placeholder="OR"
              />
            </FieldRow>
            <FieldRow label="Concert date" htmlFor="concert_date">
              <input
                id="concert_date"
                type="date"
                className={fieldClass}
                required
                value={form.concert_date}
                onChange={(e) => update("concert_date", e.target.value)}
              />
            </FieldRow>
            <FieldRow
              label="Miles from home"
              htmlFor="distance_from_home"
              hint="About how far did you travel?"
            >
              <input
                id="distance_from_home"
                type="number"
                min="0"
                step="0.1"
                className={fieldClass}
                required
                value={form.distance_from_home}
                onChange={(e) => update("distance_from_home", e.target.value)}
              />
            </FieldRow>
            <FieldRow
              label="Hours at event"
              htmlFor="hours_at_event"
              hint="Include doors, openers, and the main set."
            >
              <input
                id="hours_at_event"
                type="number"
                min="0.1"
                step="0.1"
                className={fieldClass}
                required
                value={form.hours_at_event}
                onChange={(e) => update("hours_at_event", e.target.value)}
              />
            </FieldRow>
            <FieldRow label="Notes" htmlFor="notes">
              <textarea
                id="notes"
                className={areaClass}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Favorite song, who you went with, vibes..."
              />
            </FieldRow>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="card-title font-display text-xl">Costs</h2>
              <div className="hidden rounded-box bg-primary/15 px-4 py-2 text-sm sm:block">
                Total:{" "}
                <span className="font-semibold text-primary">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>
            {(
              [
                ["ticket_cost", "Ticket cost"],
                ["ticket_fees", "Ticket fees"],
                ["parking_cost", "Parking cost"],
                ["food_drink_cost", "Food and drink"],
                ["merchandise_cost", "Merchandise"],
                ["lodging_cost", "Hotel or lodging"],
                ["travel_cost", "Travel or gas"],
                ["other_cost", "Other cost"],
              ] as const
            ).map(([key, label]) => (
              <FieldRow key={key} label={label} htmlFor={key}>
                <input
                  id={key}
                  type="number"
                  min="0"
                  step="0.01"
                  className={fieldClass}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder="0.00"
                />
              </FieldRow>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.15}>
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-5">
            <h2 className="card-title font-display text-xl">Fun rating</h2>
            <FieldRow
              label="How fun was it?"
              htmlFor="fun_rating"
              hint="1 = Terrible Time · 10 = Best Time Ever"
            >
              <input
                id="fun_rating"
                type="range"
                min="1"
                max="10"
                step="1"
                className="range range-primary"
                value={form.fun_rating}
                onChange={(e) => update("fun_rating", e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                <span>Terrible Time</span>
                <span className="badge badge-primary badge-lg">
                  {form.fun_rating} / 10
                </span>
                <span>Best Time Ever</span>
              </div>
            </FieldRow>
          </div>
        </section>
      </FadeIn>

      <div className="sticky-total sm:static">
        <div className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-100/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
          <div className="rounded-box bg-primary/15 px-4 py-2 text-sm sm:hidden">
            Total:{" "}
            <span className="font-semibold text-primary">
              {formatCurrency(totalCost)}
            </span>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
            {isEdit ? (
              <Link href="/concerts" className="btn btn-ghost w-full sm:w-auto">
                Cancel
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            <button
              type="submit"
              className="btn btn-primary w-full sm:btn-wide sm:w-auto"
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              {isEdit ? "Save changes" : "Save concert"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
