import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "mb_solar_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminConfig = {
  username: string;
  password: string;
  secret: string;
};

type AdminSessionPayload = {
  username: string;
  expiresAt: number;
};

function getAdminConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || password.length < 16 || !secret || secret.length < 32) {
    return null;
  }

  return { username, password, secret };
}

export function isAdminConfigured() {
  return getAdminConfig() !== null;
}

function equalText(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash) && left === right;
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminConfig();
  if (!config) return false;

  return equalText(username, config.username) && equalText(password, config.password);
}

export function createAdminSessionToken(username: string) {
  const config = getAdminConfig();
  if (!config || username !== config.username) {
    throw new Error("Admin login is not configured.");
  }

  const payload: AdminSessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", config.secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;

  const config = getAdminConfig();
  if (!config) return false;

  const [encodedPayload, encodedSignature, ...extraParts] = token.split(".");
  if (!encodedPayload || !encodedSignature || extraParts.length > 0) return false;

  try {
    const expectedSignature = createHmac("sha256", config.secret)
      .update(encodedPayload)
      .digest();
    const providedSignature = Buffer.from(encodedSignature, "base64url");

    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      return false;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as AdminSessionPayload;

    return (
      payload.username === config.username &&
      Number.isFinite(payload.expiresAt) &&
      payload.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function getAdminSessionCookie(token: string, maxAge = SESSION_DURATION_SECONDS) {
  const attributes = [
    `${ADMIN_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") attributes.push("Secure");

  return attributes.join("; ");
}

export function getClearedAdminSessionCookie() {
  return getAdminSessionCookie("", 0);
}

export function isSameOriginRequest(request: Request) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  try {
    const origin = new URL(originHeader);
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim();
    const expectedHost = forwardedHost || request.headers.get("host") || requestUrl.host;
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const expectedProtocol = forwardedProtocol
      ? `${forwardedProtocol}:`
      : requestUrl.protocol;

    return origin.host === expectedHost && origin.protocol === expectedProtocol;
  } catch {
    return false;
  }
}
