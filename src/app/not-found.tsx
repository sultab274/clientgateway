import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="mb-4 text-6xl font-bold text-white/10">404</p>
        <h1 className="mb-2 text-xl font-bold text-white">Page not found</h1>
        <p className="mb-8 text-sm text-white/40">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
