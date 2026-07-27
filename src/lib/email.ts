import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "ClientGateway <onboarding@resend.dev>";

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clientgateway.vercel.app";
  const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;

  console.log(`[Email] Sending verification to ${email}`);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email - ClientGateway",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #333;">Verify your email address</h2>
        <p style="color: #666; line-height: 1.6;">
          Click the button below to verify your email address and activate your account.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 13px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 13px;">
          This link expires in 24 hours.
        </p>
      </div>
    `,
  });

  console.log(`[Email] Verification sent successfully`);
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clientgateway.vercel.app";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  console.log(`[Email] Sending password reset to ${email}`);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password - ClientGateway",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #333;">Reset your password</h2>
        <p style="color: #666; line-height: 1.6;">
          Click the button below to reset your password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 13px;">
          This link expires in 1 hour.
        </p>
      </div>
    `,
  });

  console.log(`[Email] Password reset sent successfully`);
}
