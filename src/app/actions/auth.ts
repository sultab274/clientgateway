"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { signupSchema, loginSchema, updateProfileSchema } from "@/lib/validations";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export interface AuthState {
  error: string | null;
  success: boolean;
}

/* ─── Signup ─────────────────────────────────────── */

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Rate limit check (prevent mass account creation)
  const rateLimit = checkRateLimit(`signup:${rawData.email}`);
  if (!rateLimit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`,
      success: false,
    };
  }

  // Validate
  const result = signupSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: rawData.email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists", success: false };
  }

  // Create user
  const hashedPassword = await hashPassword(rawData.password);
  const user = await prisma.user.create({
    data: {
      name: rawData.name,
      email: rawData.email,
      password: hashedPassword,
      provider: "credentials",
    },
  });

  // Send verification email
  try {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: `verify:${user.id}`,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
    await sendVerificationEmail(user.email, token);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    // Don't block signup if email fails
  }

  // Create session
  await createSession(user.id);
  redirect("/dashboard");
}

/* ─── Login ──────────────────────────────────────── */

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate
  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  // Rate limit check
  const rateLimit = checkRateLimit(`login:${rawData.email}`);
  if (!rateLimit.allowed) {
    return {
      error: `Too many login attempts. Try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`,
      success: false,
    };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: rawData.email },
  });

  if (!user || !user.password) {
    return { error: "Invalid email or password", success: false };
  }

  // Verify password
  const isValid = await verifyPassword(rawData.password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password", success: false };
  }

  // Clear rate limit on successful login
  resetRateLimit(`login:${rawData.email}`);

  // Create session
  await createSession(user.id);
  redirect("/dashboard");
}

/* ─── Logout ─────────────────────────────────────── */

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}

/* ─── Update Profile ─────────────────────────────── */

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    name: formData.get("name") as string || undefined,
    email: formData.get("email") as string || undefined,
  };

  // Validate with Zod
  const result = updateProfileSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  if (!session) return { error: "Not authenticated", success: false };

  // Check if email is taken by another user
  if (rawData.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: rawData.email },
    });
    if (existingUser && existingUser.id !== session.userId) {
      return { error: "This email is already in use", success: false };
    }
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(rawData.name && { name: rawData.name }),
      ...(rawData.email && { email: rawData.email }),
    },
  });

  return { error: null, success: true };
}
