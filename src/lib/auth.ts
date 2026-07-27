import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET
);

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  expiresAt: Date;
}

/* ─── JWT Helpers ────────────────────────────────── */

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SESSION_SECRET);
}

export async function decrypt(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return {
      userId: payload.userId as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    };
  } catch {
    return null;
  }
}

/* ─── Session Management ─────────────────────────── */

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  const token = await encrypt({ userId, expiresAt });

  // Store session in DB
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  // Clear cookie directly — no DB lookup needed
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getSession(): Promise<{
  userId: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Strip any invisible/BOM characters from the token
  const cleanToken = token.replace(/[﻿​‌‍⁠]/g, "");

  const payload = await decrypt(cleanToken);
  if (!payload) return null;

  // Verify session exists in DB
  const session = await prisma.session.findUnique({
    where: { token: cleanToken },
    select: { userId: true, expiresAt: true },
  });

  if (!session) return null;
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { token: cleanToken } });
    return null;
  }

  return { userId: session.userId };
}

/* ─── Password Helpers ────────────────────────────── */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
