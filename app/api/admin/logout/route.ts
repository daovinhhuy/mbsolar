import { getClearedAdminSessionCookie, isSameOriginRequest } from "@/lib/adminAuth";
import { adminJson } from "@/lib/adminApi";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return adminJson({ error: "Yêu cầu không hợp lệ." }, 403);
  }

  return Response.json(
    { authenticated: false },
    {
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie": getClearedAdminSessionCookie(),
      },
    },
  );
}
