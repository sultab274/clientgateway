import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getClients } from "@/app/actions/clients";
import { ClientsContent } from "./ClientsContent";

export const metadata: Metadata = {
  title: "Clients — ClientGateway",
};

export default async function ClientsPage() {
  await verifySession();
  const clients = await getClients();
  return <ClientsContent clients={JSON.parse(JSON.stringify(clients))} />;
}
