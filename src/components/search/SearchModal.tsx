"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
}

const staticResults: SearchResult[] = [
  { id: "1", title: "Dashboard", description: "Financial overview at a glance", href: "/dashboard", category: "Navigation" },
  { id: "2", title: "Invoices", description: "Create and manage invoices", href: "/dashboard/invoices", category: "Pages" },
  { id: "3", title: "Create Invoice", description: "Generate a new invoice for your clients", href: "/dashboard/invoices", category: "Actions" },
  { id: "4", title: "Clients", description: "Manage your client relationships", href: "/dashboard/clients", category: "Pages" },
  { id: "5", title: "Add Client", description: "Add a new client to your account", href: "/dashboard/clients", category: "Actions" },
  { id: "6", title: "Payments", description: "Track all incoming payments", href: "/dashboard/payments", category: "Pages" },
  { id: "7", title: "Record Payment", description: "Log an incoming payment", href: "/dashboard/payments", category: "Actions" },
  { id: "8", title: "Settings", description: "Manage your account preferences", href: "/dashboard/settings", category: "Navigation" },
  { id: "9", title: "Profile", description: "Update your profile information", href: "/dashboard/settings", category: "Navigation" },
];

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = staticResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  // Arrow key navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        navigate(results[selectedIndex].href);
      }
    },
    [results, selectedIndex, navigate]
  );

  return (
    <>
      {/* Trigger button — hidden on mobile, shown in navbar instead */}
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/30 transition-colors hover:border-white/15 hover:text-white/50 md:flex"
      >
        <Search className="h-3 w-3" />
        Search...
        <kbd className="ml-2 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/25">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Search panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="fixed left-1/2 top-[15%] z-[101] w-full max-w-lg -translate-x-1/2 px-4"
            >
              <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111111]/95 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white/30" />
                  ) : (
                    <Search className="h-4 w-4 text-white/30" />
                  )}
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search anything..."
                    className="flex-1 bg-transparent py-4 text-sm text-white placeholder-white/25 outline-none"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-md p-1 text-white/30 transition-colors hover:text-white/60"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {query.trim() === "" ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-white/30">
                        Start typing to search...
                      </p>
                      <p className="mt-1 text-[11px] text-white/20">
                        Try &quot;invoice&quot;, &quot;payment&quot;, or &quot;settings&quot;
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="px-4 py-8 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-white/20" />
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-white/30">No results found</p>
                      <p className="mt-1 text-[11px] text-white/20">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    results.map((result, i) => (
                      <button
                        key={result.id}
                        onClick={() => navigate(result.href)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          i === selectedIndex
                            ? "bg-white/[0.08]"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                          <FileText className="h-4 w-4 text-white/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-white/90 truncate">
                            {result.title}
                          </p>
                          <p className="text-[11px] text-white/35 truncate">
                            {result.description}
                          </p>
                        </div>
                        <span className="text-[10px] text-white/20">
                          {result.category}
                        </span>
                        <ArrowRight className="h-3 w-3 text-white/20" />
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-white/20">
                    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1 py-0.5">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/20">
                    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1 py-0.5">↵</kbd>
                    Open
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/20">
                    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1 py-0.5">esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
