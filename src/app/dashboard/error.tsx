"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center lg:px-8">
      <p className="mb-4 text-4xl font-bold text-white/10">!</p>
      <h1 className="mb-2 text-lg font-bold text-white">
        Something went wrong
      </h1>
      <p className="mb-6 text-sm text-white/40">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90"
      >
        Try again
      </button>
    </div>
  );
}
