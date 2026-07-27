"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be positive"),
  unitPrice: z.coerce.number().min(0.01, "Price must be positive"),
});

const invoiceSchema = z.object({
  clientId: z.string().optional().nullable(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  dueDate: z.string().min(1, "Due date is required"),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().max(500).or(z.literal("")).optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export interface InvoiceState {
  error: string | null;
  success: boolean;
}

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp.slice(-4)}${random}`;
}

export async function createInvoice(
  _prevState: InvoiceState,
  formData: FormData
): Promise<InvoiceState> {
  const session = await verifySession();

  const itemsJson = formData.get("items") as string;
  let items: { description: string; quantity: number; unitPrice: number }[];
  try {
    items = JSON.parse(itemsJson || "[]");
  } catch {
    return { error: "Invalid invoice items", success: false };
  }

  const rawData = {
    clientId: formData.get("clientId") as string || null,
    status: formData.get("status") as string || "draft",
    dueDate: formData.get("dueDate") as string,
    taxRate: formData.get("taxRate") as string || "0",
    notes: formData.get("notes") as string,
    items,
  };

  const result = invoiceSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
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

  await prisma.invoice.create({
    data: {
      userId: session.userId,
      clientId: rawData.clientId || null,
      number: generateInvoiceNumber(),
      status: rawData.status,
      dueDate: new Date(rawData.dueDate),
      taxRate: Number(rawData.taxRate) || 0,
      notes: rawData.notes || null,
      items: {
        create: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  redirect("/dashboard/invoices");
}

export async function updateInvoiceStatus(
  id: string,
  status: string
): Promise<void> {
  const session = await verifySession();
  await prisma.invoice.updateMany({
    where: { id, userId: session.userId },
    data: { status },
  });
}

export async function deleteInvoice(id: string): Promise<void> {
  const session = await verifySession();
  await prisma.invoice.deleteMany({ where: { id, userId: session.userId } });
  redirect("/dashboard/invoices");
}

export async function getInvoices() {
  const session = await verifySession();
  return prisma.invoice.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, company: true } },
      items: true,
      payments: { select: { amount: true } },
    },
  });
}

export async function getInvoice(id: string) {
  const session = await verifySession();
  return prisma.invoice.findFirst({
    where: { id, userId: session.userId },
    include: { client: true, items: true, payments: true },
  });
}

export async function deleteInvoiceAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;
  await deleteInvoice(id);
}
