import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getPayments } from "@/app/actions/payments";
import { getInvoices } from "@/app/actions/invoices";
import { getClients } from "@/app/actions/clients";
import { PaymentsContent } from "./PaymentsContent";

export const metadata: Metadata = {
  title: "Payments — ClientGateway",
};

export default async function PaymentsPage() {
  await verifySession();
  const [payments, invoices, clients] = await Promise.all([getPayments(), getInvoices(), getClients()]);
  return <PaymentsContent payments={JSON.parse(JSON.stringify(payments))} invoices={JSON.parse(JSON.stringify(invoices))} clients={JSON.parse(JSON.stringify(clients))} />;
}
