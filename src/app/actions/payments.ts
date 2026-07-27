"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { z } from "zod";

const paymentSchema = z.object({
  invoiceId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  method: z.enum(["bank_transfer", "credit_card", "cash", "other"]),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  reference: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  date: z.string().optional().nullable(),
});

export interface PaymentState {
  error: string | null;
  success: boolean;
}

export async function createPayment(
  _prevState: PaymentState,
  formData: FormData
): Promise<PaymentState> {
  const session = await verifySession();

  const rawData = {
    invoiceId: (formData.get("invoiceId") as string) || null,
    clientId: (formData.get("clientId") as string) || null,
    amount: (formData.get("amount") as string) || "0",
    method: (formData.get("method") as string) || "bank_transfer",
    status: (formData.get("status") as string) || "completed",
    reference: (formData.get("reference") as string) || null,
    notes: (formData.get("notes") as string) || null,
    date: (formData.get("date") as string) || null,
  };

  const result = paymentSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  // Verify ownership of linked invoice
  if (rawData.invoiceId) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: rawData.invoiceId, userId: session.userId },
    });
    if (!invoice) {
      return { error: "Invoice not found", success: false };
    }
  }

  // Verify ownership of linked client
  if (rawData.clientId) {
    const client = await prisma.client.findFirst({
      where: { id: rawData.clientId, userId: session.userId },
    });
    if (!client) {
      return { error: "Client not found", success: false };
    }
  }

  const payment = await prisma.payment.create({
    data: {
      userId: session.userId,
      invoiceId: rawData.invoiceId || null,
      clientId: rawData.clientId || null,
      amount: Number(rawData.amount),
      method: rawData.method,
      status: rawData.status,
      reference: rawData.reference || null,
      notes: rawData.notes || null,
      date: rawData.date ? new Date(rawData.date) : new Date(),
    },
  });

  // If linked to an invoice and payment is completed, update invoice status
  if (payment.invoiceId && payment.status === "completed") {
    const invoice = await prisma.invoice.findFirst({
      where: { id: payment.invoiceId, userId: session.userId },
      include: { items: true, payments: { where: { status: "completed" } } },
    });

    if (invoice) {
      const totalItems = invoice.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const totalWithTax = totalItems * (1 + invoice.taxRate / 100);
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + payment.amount;

      if (totalPaid >= totalWithTax) {
        await prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: "paid" },
        });
      }
    }
  }

  redirect("/dashboard/payments");
}

export async function deletePayment(id: string): Promise<void> {
  const session = await verifySession();
  await prisma.payment.deleteMany({ where: { id, userId: session.userId } });
  redirect("/dashboard/payments");
}

export async function getPayments() {
  const session = await verifySession();
  return prisma.payment.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
    include: {
      invoice: { select: { number: true } },
      client: { select: { name: true } },
    },
  });
}

export async function deletePaymentAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;
  await deletePayment(id);
}
