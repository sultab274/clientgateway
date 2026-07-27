"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().max(200).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export interface ClientState {
  error: string | null;
  success: boolean;
}

export async function createClient(
  _prevState: ClientState,
  formData: FormData
): Promise<ClientState> {
  const session = await verifySession();

  const rawData = {
    name: (formData.get("name") as string) || "",
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    company: (formData.get("company") as string) || null,
    address: (formData.get("address") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  const result = clientSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  await prisma.client.create({
    data: {
      userId: session.userId,
      name: rawData.name,
      email: rawData.email || null,
      phone: rawData.phone || null,
      company: rawData.company || null,
      address: rawData.address || null,
      notes: rawData.notes || null,
    },
  });

  redirect("/dashboard/clients");
}

export async function deleteClient(id: string): Promise<void> {
  const session = await verifySession();
  await prisma.client.deleteMany({ where: { id, userId: session.userId } });
  redirect("/dashboard/clients");
}

export async function getClients() {
  const session = await verifySession();
  return prisma.client.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });
}

export async function getClient(id: string) {
  const session = await verifySession();
  return prisma.client.findFirst({
    where: { id, userId: session.userId },
  });
}

export async function deleteClientAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;
  await deleteClient(id);
}
