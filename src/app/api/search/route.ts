import { NextRequest } from "next/server";

const searchableItems = [
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

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (!q.trim()) {
    return Response.json([]);
  }

  const results = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(q.toLowerCase()) ||
      item.description.toLowerCase().includes(q.toLowerCase()) ||
      item.category.toLowerCase().includes(q.toLowerCase())
  );

  return Response.json(results);
}
