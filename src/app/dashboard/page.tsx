import { verifySession, getUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  await verifySession();
  const user = await getUser();

  // Fetch real stats
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalRevenue, outstandingInvoices, paymentsReceived, activeClients, recentInvoices, recentPayments] = await Promise.all([
    prisma.payment.aggregate({
      where: { userId: user!.id, status: "completed" },
      _sum: { amount: true },
    }),
    prisma.invoice.count({
      where: { userId: user!.id, status: { in: ["sent", "overdue"] } },
    }),
    prisma.payment.aggregate({
      where: { userId: user!.id, status: "completed", date: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.client.count({ where: { userId: user!.id } }),
    prisma.invoice.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: { select: { name: true } }, items: true, payments: { select: { amount: true, status: true } } },
    }),
    prisma.payment.findMany({
      where: { userId: user!.id },
      orderBy: { date: "desc" },
      take: 5,
      include: { client: { select: { name: true } } },
    }),
  ]);

  const stats = {
    totalRevenue: totalRevenue._sum.amount || 0,
    outstandingInvoices,
    paymentsLast30Days: paymentsReceived._sum.amount || 0,
    activeClients,
  };

  return (
    <DashboardContent
      user={user}
      stats={stats}
      recentInvoices={recentInvoices}
      recentPayments={recentPayments}
    />
  );
}
