"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { redirect } from "next/navigation";

export interface ResetState {
  error: string | null;
  success: boolean;
}

export async function requestPasswordReset(
  _prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { error: "Email is required", success: false };
  }

  // Always return success to prevent email enumeration
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Delete any existing tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { identifier: `reset:${user.id}` },
      });

      // Create reset token
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.verificationToken.create({
        data: {
          identifier: `reset:${user.id}`,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // Send email
      try {
        await sendPasswordResetEmail(user.email, token);
        console.log(`[PasswordReset] Email sent successfully to ${user.email}`);
      } catch (emailErr) {
        console.error("[PasswordReset] Failed to send email:", emailErr);
      }
    } else {
      console.log(`[PasswordReset] No user found for: ${email}`);
    }
  } catch (dbErr) {
    console.error("[PasswordReset] Database error:", dbErr);
  }

  return {
    error: null,
    success: true,
  };
}

export async function resetPassword(
  _prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token || !password) {
    return { error: "Invalid request", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters", success: false };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match", success: false };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      error: "Password must contain uppercase, lowercase, and a number",
      success: false,
    };
  }

  // Find the token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { error: "Invalid or expired reset link", success: false };
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({ where: { token } });
    return { error: "Reset link has expired. Please request a new one.", success: false };
  }

  // Extract userId from identifier
  const userId = verificationToken.identifier.replace("reset:", "");

  // Hash new password and update
  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Delete all sessions for this user (force re-login)
  await prisma.session.deleteMany({ where: { userId } });

  // Delete the token
  await prisma.verificationToken.delete({ where: { token } });

  redirect("/login?reset=success");
}
