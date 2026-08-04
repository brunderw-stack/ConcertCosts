"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

export function LoadError({
  message = "Couldn't load your concerts. Check your connection and try again.",
}: {
  message?: string;
}) {
  const router = useRouter();

  return (
    <div className="alert alert-error shadow-sm">
      <AlertCircle className="size-5 shrink-0" />
      <span>{message}</span>
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        onClick={() => router.refresh()}
      >
        <RefreshCw className="size-4" />
        Try again
      </button>
    </div>
  );
}
