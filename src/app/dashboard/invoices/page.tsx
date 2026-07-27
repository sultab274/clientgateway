import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getInvoices } from "@/app/actions/invoices";
import { getClients } from "@/app/actions/clients";
import { InvoicesContent } from "./InvoicesContent";

export const metadata: Metadata = {
  title: "Invoices — ClientGateway",
};

export default async function InvoicesPage() {
  await verifySession();
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);
  return <InvoicesContent invoices={JSON.parse(JSON.stringify(invoices))} clients={JSON.parse(JSON.stringify(clients))} />;
}
