"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ConcertCard } from "@/components/ConcertCard";
import { StaggerItem, StaggerList } from "@/components/Motion";
import { getConcertMetrics } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

type SortKey =
  | "date_desc"
  | "date_asc"
  | "cost_desc"
  | "cost_asc"
  | "fun_desc"
  | "fun_asc"
  | "value_desc"
  | "value_asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date_desc", label: "Date (newest)" },
  { value: "date_asc", label: "Date (oldest)" },
  { value: "cost_desc", label: "Total cost (high to low)" },
  { value: "cost_asc", label: "Total cost (low to high)" },
  { value: "fun_desc", label: "Fun rating (high to low)" },
  { value: "fun_asc", label: "Fun rating (low to high)" },
  { value: "value_desc", label: "Fun Points per $100 (best first)" },
  { value: "value_asc", label: "Fun Points per $100 (lowest first)" },
];

function matchesSearch(concert: Concert, query: string) {
  if (!query) return true;
  const haystack = [
    concert.concert_name,
    concert.artist,
    concert.venue,
    concert.city,
    concert.state,
    concert.notes ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function compareConcerts(a: Concert, b: Concert, sort: SortKey) {
  const aMetrics = getConcertMetrics(a);
  const bMetrics = getConcertMetrics(b);

  switch (sort) {
    case "date_asc":
      return a.concert_date.localeCompare(b.concert_date);
    case "date_desc":
      return b.concert_date.localeCompare(a.concert_date);
    case "cost_asc":
      return aMetrics.totalCost - bMetrics.totalCost;
    case "cost_desc":
      return bMetrics.totalCost - aMetrics.totalCost;
    case "fun_asc":
      return a.fun_rating - b.fun_rating;
    case "fun_desc":
      return b.fun_rating - a.fun_rating;
    case "value_asc":
      return (aMetrics.funPointsPer100 ?? -1) - (bMetrics.funPointsPer100 ?? -1);
    case "value_desc":
      return (bMetrics.funPointsPer100 ?? -1) - (aMetrics.funPointsPer100 ?? -1);
    default:
      return 0;
  }
}

export function ConcertsBrowser({ concerts }: { concerts: Concert[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("date_desc");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return concerts
      .filter((concert) => matchesSearch(concert, normalized))
      .sort((a, b) => compareConcerts(a, b, sort));
  }, [concerts, query, sort]);

  return (
    <div className="space-y-4">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 p-4 sm:flex-row sm:items-end">
          <label className="form-control w-full">
            <span className="label py-1">
              <span className="label-text text-sm font-medium">Search</span>
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50" />
              <input
                type="search"
                className="input input-bordered w-full pl-10"
                placeholder="Artist, venue, city, notes..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search concerts"
              />
            </div>
          </label>

          <label className="form-control w-full sm:max-w-xs">
            <span className="label py-1">
              <span className="label-text text-sm font-medium">Sort by</span>
            </span>
            <select
              className="select select-bordered w-full"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort concerts"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm text-base-content/60">
        Showing {filtered.length} of {concerts.length} concert
        {concerts.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-4 py-10 text-center">
          <p className="font-display text-lg font-semibold">No matches</p>
          <p className="mt-1 text-sm text-base-content/70">
            Try a different search, or clear the box to see all concerts.
          </p>
          {query ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-3"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <StaggerList className="space-y-4">
          {filtered.map((concert) => (
            <StaggerItem key={concert.id}>
              <ConcertCard concert={concert} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
