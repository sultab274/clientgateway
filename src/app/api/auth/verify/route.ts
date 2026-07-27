import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=Invalid+verification+link", request.url));
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return NextResponse.redirect(new URL("/login?error=Invalid+or+expired+link", request.url));
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/login?error=Verification+link+expired", request.url));
  }

  // Mark user as verified (add emailVerified field if needed, or just clean up token)
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
