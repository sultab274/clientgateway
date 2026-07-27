import type { Metadata } from "next";
import { verifySession, getUser } from "@/lib/dal";
import { SettingsContent } from "./SettingsContent";

export const metadata: Metadata = {
  title: "Settings — ClientGateway",
};

export default async function SettingsPage() {
  await verifySession();
  const user = await getUser();
  return <SettingsContent user={JSON.parse(JSON.stringify(user))} />;
}
