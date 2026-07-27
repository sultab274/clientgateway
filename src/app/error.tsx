"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="mb-4 text-6xl font-bold text-white/10">!</p>
        <h1 className="mb-2 text-xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mb-8 text-sm text-white/40">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
