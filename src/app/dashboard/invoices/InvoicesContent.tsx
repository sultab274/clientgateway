"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState } from "react";
import { createInvoice, deleteInvoiceAction, type InvoiceState } from "@/app/actions/invoices";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  Plus,
  FileText,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  number: string;
  status: string;
  date: Date;
  dueDate: Date;
  taxRate: number;
  notes: string | null;
  items: InvoiceItem[];
  client: { name: string; company: string | null } | null;
  payments: { amount: number }[];
}

interface Client {
  id: string;
  name: string;
  company: string | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/50",
  sent: "bg-blue-500/15 text-blue-400",
  paid: "bg-emerald-500/15 text-emerald-400",
  overdue: "bg-red-500/15 text-red-400",
  cancelled: "bg-white/5 text-white/30",
};

const initialInvoiceState: InvoiceState = { error: null, success: false };

export function InvoicesContent({
  invoices,
  clients,
}: {
  invoices: Invoice[];
  clients: Client[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [items, setItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [state, formAction, isPending] = useActionState(createInvoice, initialInvoiceState);

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[i] as Record<string, unknown>)[field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage and track your invoices
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-white/15" />
          <p className="text-sm text-white/40">No invoices yet</p>
          <p className="mt-1 text-xs text-white/25">Create your first invoice to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => {
            const total = inv.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
            const totalWithTax = total * (1 + inv.taxRate / 100);
            const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06]">
                    <FileText className="h-4 w-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{inv.number}</p>
                    <p className="text-xs text-white/35">
                      {inv.client?.name || "No client"} · Due{" "}
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-white">
                      ${totalWithTax.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    {paid > 0 && (
                      <p className="text-[11px] text-emerald-400">
                        ${paid.toLocaleString("en-US", { minimumFractionDigits: 2 })} paid
                      </p>
                    )}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColors[inv.status] || ""}`}>
                    {inv.status}
                  </span>
                  <form action={deleteInvoiceAction}>
                      <input type="hidden" name="id" value={inv.id} />
                    <button type="submit" className="rounded-lg p-1.5 text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreate(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="fixed left-1/2 top-[10%] z-50 w-full max-w-lg -translate-x-1/2 max-h-[80vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#111111] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">New Invoice</h2>
                <button onClick={() => setShowCreate(false)} className="rounded-lg p-1 text-white/40 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {state.error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {state.error}
                </div>
              )}

              <form action={formAction} className="space-y-4">
                {/* Client */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Client</label>
                  <Select
                    name="clientId"
                    placeholder="No client"
                    options={clients.map((c) => ({
                      value: c.id,
                      label: `${c.name}${c.company ? ` (${c.company})` : ""}`,
                    }))}
                  />
                </div>

                {/* Due date */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Due Date</label>
                  <DatePicker name="dueDate" placeholder="Select due date" />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Status</label>
                  <Select
                    name="status"
                    defaultValue="draft"
                    options={[
                      { value: "draft", label: "Draft" },
                      { value: "sent", label: "Sent" },
                    ]}
                  />
                </div>

                {/* Tax rate */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Tax Rate (%)</label>
                  <input name="taxRate" type="number" min="0" max="100" defaultValue="0" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" />
                </div>

                {/* Line items */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Line Items</label>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                        />
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                          className="w-16 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-sm text-white outline-none focus:border-white/20"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                          className="w-24 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-sm text-white outline-none focus:border-white/20"
                        />
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-2 text-white/20 hover:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addItem} className="mt-2 text-xs text-white/40 hover:text-white/60">
                    + Add line item
                  </button>
                </div>

                {/* Subtotal */}
                <div className="rounded-lg bg-white/[0.03] px-4 py-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span className="font-medium text-white tabular-nums">
                      ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Notes</label>
                  <textarea name="notes" rows={2} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none" />
                </div>

                {/* Hidden items JSON */}
                <input type="hidden" name="items" value={JSON.stringify(items)} />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Invoice"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
