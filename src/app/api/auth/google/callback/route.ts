import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<GoogleTokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code");
  }

  return response.json();
}

async function fetchGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user information");
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Dynamically build redirect URI from the actual request origin
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Check for OAuth errors from Google
  if (error) {
    return NextResponse.redirect(
      new URL(
        "/login?error=Google+authentication+was+cancelled+or+failed",
        request.url
      )
    );
  }

  // Validate code
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=No+authorization+code+received", request.url)
    );
  }

  // Verify state (CSRF protection) — handle both plain and mobile states
  const storedState = request.cookies.get("oauth_state")?.value;
  const isMobileState = state?.endsWith(":app") && storedState?.endsWith(":app");
  const plainState = state?.replace(":app", "");
  const plainStored = storedState?.replace(":app", "");

  if (!state || !storedState || (state !== storedState && plainState !== plainStored)) {
    return NextResponse.redirect(
      new URL("/login?error=Invalid+request+state", request.url)
    );
  }

  const isMobile = state?.endsWith(":app");

  try {
    // Exchange code for tokens (using dynamic redirect URI)
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Fetch user info from Google
    const googleUser = await fetchGoogleUserInfo(tokens.access_token);

    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL(
          "/login?error=No+email+address+received+from+Google",
          request.url
        )
      );
    }

    // Verify Google confirmed the email
    if (!googleUser.email_verified) {
      return NextResponse.redirect(
        new URL(
          "/login?error=Please+verify+your+Google+email+address+first",
          request.url
        )
      );
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ accountId: googleUser.sub }, { email: googleUser.email }],
      },
    });

    if (user) {
      // Link Google account if user signed up with email/password
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accountId: user.accountId || googleUser.sub,
          avatar: user.avatar || googleUser.picture,
          name: user.name || googleUser.name,
          provider:
            user.provider === "credentials"
              ? "credentials,google"
              : user.provider.includes("google")
                ? user.provider
                : "google",
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          accountId: googleUser.sub,
          provider: "google",
        },
      });
    }

    // Create session
    await createSession(user.id);

    // Mobile redirect — deep link back to app
    if (isMobile) {
      const token = request.cookies.get("session")?.value || "";
      const deepLink = `clientgateway://auth/callback?token=${encodeURIComponent(token)}&userId=${user.id}&name=${encodeURIComponent(user.name || "")}&email=${encodeURIComponent(user.email)}`;
      const response = NextResponse.redirect(deepLink);
      response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
      return response;
    }

    // Web redirect — dashboard
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(
      new URL(
        "/login?error=Authentication+failed.+Please+try+again.",
        request.url
      )
    );
  }
}
