import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — ClientGateway",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <main className="pt-24">{children}</main>
    </div>
  );
}
