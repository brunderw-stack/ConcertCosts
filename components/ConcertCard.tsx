"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  COST_CATEGORIES,
  formatCurrency,
  formatNumber,
  getConcertMetrics,
  toNumber,
} from "@/lib/calculations";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ConcertCard({ concert }: { concert: Concert }) {
  const router = useRouter();
  const dialogId = useId().replace(/:/g, "");
  const [deleting, setDeleting] = useState(false);
  const { totalCost, costPerHour, funPointsPer100 } =
    getConcertMetrics(concert);

  const categories = COST_CATEGORIES.filter(
    (category) => toNumber(concert[category.key]) > 0,
  );

  function openDeleteDialog() {
    const dialog = document.getElementById(
      `delete-${dialogId}`,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  }

  function closeDeleteDialog() {
    const dialog = document.getElementById(
      `delete-${dialogId}`,
    ) as HTMLDialogElement | null;
    dialog?.close();
  }

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("concerts")
      .delete()
      .eq("id", concert.id);

    setDeleting(false);

    if (error) {
      toast.error("Couldn't delete this concert. Please try again.");
      return;
    }

    toast.success("Concert deleted.");
    closeDeleteDialog();
    router.refresh();
  }

  return (
    <article className="card card-hover border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
              {concert.concert_name}
            </h3>
            <p className="mt-1 text-base text-base-content/70">
              {concert.artist}
            </p>
            <p className="mt-1 text-sm text-base-content/60">
              {concert.venue} · {concert.city}, {concert.state}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="badge badge-outline badge-lg shrink-0">
              {formatDate(concert.concert_date)}
            </div>
            <Link
              href={`/concerts/${concert.id}/edit`}
              className="btn btn-ghost btn-sm"
            >
              <Pencil className="size-4" />
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              onClick={openDeleteDialog}
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-box bg-base-200 px-3 py-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-wide text-base-content/60">
              Total cost
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {formatCurrency(totalCost)}
            </p>
          </div>
          <div className="rounded-box bg-base-200 px-3 py-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-wide text-base-content/60">
              Fun rating
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {concert.fun_rating} / 10
            </p>
          </div>
          <div className="rounded-box bg-base-200 px-3 py-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-wide text-base-content/60">
              Cost per hour
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {costPerHour === null ? "—" : formatCurrency(costPerHour)}
            </p>
          </div>
          <div className="rounded-box bg-base-200 px-3 py-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-wide text-base-content/60">
              Fun Points per $100
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {funPointsPer100 === null
                ? "—"
                : formatNumber(funPointsPer100, 2)}
            </p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category.key} className="badge badge-ghost gap-1">
                {category.label}:{" "}
                {formatCurrency(toNumber(concert[category.key]))}
              </span>
            ))}
          </div>
        ) : null}

        {concert.notes ? (
          <p className="rounded-box border border-base-300 bg-base-200/50 px-3 py-2 text-sm leading-relaxed">
            {concert.notes}
          </p>
        ) : null}
      </div>

      <dialog id={`delete-${dialogId}`} className="modal">
        <div className="modal-box">
          <h3 className="font-display text-lg font-bold">Delete this concert?</h3>
          <p className="py-3 text-sm text-base-content/70">
            This will permanently remove{" "}
            <span className="font-medium text-base-content">
              {concert.concert_name}
            </span>
            . You can&apos;t undo this.
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeDeleteDialog}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" disabled={deleting}>
            close
          </button>
        </form>
      </dialog>
    </article>
  );
}
