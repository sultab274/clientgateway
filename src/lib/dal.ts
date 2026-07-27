import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./auth";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const { prisma } = await import("./db");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      provider: true,
      createdAt: true,
    },
  });

  return user;
});
