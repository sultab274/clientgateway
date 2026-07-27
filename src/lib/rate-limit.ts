/**
 * Simple in-memory rate limiter for auth actions.
 * In production, use Redis or a dedicated rate-limiting service.
 */

const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const resetIn = record.resetAt - now;
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    resetIn: record.resetAt - now,
  };
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attempts.entries()) {
      if (now > record.resetAt) {
        attempts.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
