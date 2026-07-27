"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState } from "react";
import { createPayment, deletePaymentAction, type PaymentState } from "@/app/actions/payments";
import { Select } from "@/components/ui/Select";
import { Plus, CreditCard, Trash2, X, Loader2 } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  date: Date;
  invoice: { number: string } | null;
  client: { name: string } | null;
}

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  cash: "Cash",
  other: "Other",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  failed: "bg-red-500/15 text-red-400",
  refunded: "bg-white/10 text-white/50",
};

const initialState: PaymentState = { error: null, success: false };

export function PaymentsContent({
  payments,
  invoices,
  clients,
}: {
  payments: Payment[];
  invoices: { id: string; number: string }[];
  clients: { id: string; name: string }[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [state, formAction, isPending] = useActionState(createPayment, initialState);

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="mt-1 text-sm text-white/40">Track all incoming payments</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90">
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <CreditCard className="mx-auto mb-3 h-10 w-10 text-white/15" />
          <p className="text-sm text-white/40">No payments recorded</p>
          <p className="mt-1 text-xs text-white/25">Record your first payment to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {payments.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 hover:bg-white/[0.04]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06]">
                  <CreditCard className="h-4 w-4 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {p.client?.name || "Unknown"} {p.invoice ? `· ${p.invoice.number}` : ""}
                  </p>
                  <p className="text-xs text-white/35">
                    {methodLabels[p.method] || p.method} · {new Date(p.date).toLocaleDateString()}
                    {p.reference ? ` · Ref: ${p.reference}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold tabular-nums text-white">
                  ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColors[p.status] || ""}`}>
                  {p.status}
                </span>
                <form action={deletePaymentAction}>
                    <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="rounded-lg p-1.5 text-white/20 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-[10%] z-50 w-full max-w-md -translate-x-1/2 rounded-2xl border border-white/[0.08] bg-[#111111] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Record Payment</h2>
                <button onClick={() => setShowCreate(false)} className="rounded-lg p-1 text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              {state.error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
              <form action={formAction} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Amount *</label>
                  <input name="amount" type="number" min="0.01" step="0.01" required className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="0.00" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Method</label>
                    <Select name="method" defaultValue="bank_transfer" options={[
                      { value: "bank_transfer", label: "Bank Transfer" },
                      { value: "credit_card", label: "Credit Card" },
                      { value: "cash", label: "Cash" },
                      { value: "other", label: "Other" },
                    ]} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Status</label>
                    <Select name="status" defaultValue="completed" options={[
                      { value: "completed", label: "Completed" },
                      { value: "pending", label: "Pending" },
                    ]} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Client</label>
                    <Select name="clientId" placeholder="None" options={clients.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Invoice</label>
                    <Select name="invoiceId" placeholder="None" options={invoices.map((inv) => ({
                      value: inv.id,
                      label: inv.number,
                    }))} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Reference</label>
                  <input name="reference" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="Transaction ID" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Notes</label>
                  <textarea name="notes" rows={2} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none" />
                </div>
                <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Record Payment"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
