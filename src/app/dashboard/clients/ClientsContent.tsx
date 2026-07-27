"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState } from "react";
import { createClient, deleteClientAction, type ClientState } from "@/app/actions/clients";
import { Plus, Users, Trash2, X, Loader2, Mail, Phone, Building2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  _count: { invoices: number };
}

const initialState: ClientState = { error: null, success: false };

export function ClientsContent({ clients }: { clients: Client[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [state, formAction, isPending] = useActionState(createClient, initialState);

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="mt-1 text-sm text-white/40">Manage your client relationships</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/90">
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-white/15" />
          <p className="text-sm text-white/40">No clients yet</p>
          <p className="mt-1 text-xs text-white/25">Add your first client to start creating invoices</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.08] text-sm font-bold text-white/60">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <form action={deleteClientAction}>
                    <input type="hidden" name="id" value={client.id} />
                  <button type="submit" className="rounded-lg p-1.5 text-white/20 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
              <h3 className="text-sm font-semibold text-white">{client.name}</h3>
              {client.company && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/35">
                  <Building2 className="h-3 w-3" /> {client.company}
                </p>
              )}
              {client.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-white/35">
                  <Mail className="h-3 w-3" /> {client.email}
                </p>
              )}
              {client.phone && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/35">
                  <Phone className="h-3 w-3" /> {client.phone}
                </p>
              )}
              <p className="mt-2 text-[11px] text-white/25">{client._count.invoices} invoices</p>
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
                <h2 className="text-lg font-bold text-white">Add Client</h2>
                <button onClick={() => setShowCreate(false)} className="rounded-lg p-1 text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              {state.error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</div>}
              <form action={formAction} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Name *</label>
                  <input name="name" required className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="John Smith" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
                  <input name="email" type="email" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="john@company.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Phone</label>
                    <input name="phone" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="+1 234 567" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Company</label>
                    <input name="company" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20" placeholder="Acme Inc." />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Notes</label>
                  <textarea name="notes" rows={2} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-white/20 resize-none" />
                </div>
                <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Client"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
