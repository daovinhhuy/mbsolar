import {
  createAdminSessionToken,
  getAdminSessionCookie,
  isAdminConfigured,
  isSameOriginRequest,
  verifyAdminCredentials,
} from "@/lib/adminAuth";
import { adminJson } from "@/lib/adminApi";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Yêu cầu không hợp lệ." }, 403);
  }

  if (!isAdminConfigured()) {
    return adminJson(
      { error: "Admin chưa được cấu hình trên máy chủ." },
      503,
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return adminJson({ error: "Thông tin đăng nhập không hợp lệ." }, 400);
  }

  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    body.username.length > 200 ||
    body.password.length > 500 ||
    !verifyAdminCredentials(body.username, body.password)
  ) {
    return adminJson({ error: "Tên đăng nhập hoặc mật khẩu chưa đúng." }, 401);
  }

  const token = createAdminSessionToken(body.username);
  return Response.json(
    { authenticated: true },
    {
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie": getAdminSessionCookie(token),
      },
    },
  );
}
