import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const SCOPE = "openid email profile";

function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function GET(request: NextRequest) {
  const state = generateRandomState();

  // Check if this is a mobile request
  const redirectTo = request.nextUrl.searchParams.get("redirect_to");
  const isMobile = redirectTo === "app";

  // Store redirect_to in state so callback knows about mobile
  const stateWithRedirect = isMobile ? `${state}:app` : state;

  // Dynamically build the redirect URI from the actual request origin
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state: stateWithRedirect,
  });

  // Store state in cookie for CSRF verification
  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  response.cookies.set("oauth_state", stateWithRedirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
