import { isAdminAuthenticated, isSameOriginRequest } from "@/lib/adminAuth";

export class AdminValidationError extends Error {}

export async function authorizeAdminRequest(
  request: Request,
  requiresSameOrigin = false,
) {
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { error: "Vui lòng đăng nhập để tiếp tục." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (requiresSameOrigin && !isSameOriginRequest(request)) {
    return Response.json(
      { error: "Yêu cầu không hợp lệ." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  return null;
}

export function adminJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function parseDatabaseId(value: string) {
  return /^\d+$/.test(value) ? value : null;
}

export function databaseErrorResponse(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  if (code === "23505") {
    return adminJson({ error: "Giá trị này đã được sử dụng." }, 409);
  }

  if (code === "23503") {
    return adminJson(
      { error: "Không thể thay đổi dữ liệu đang được mục khác sử dụng." },
      409,
    );
  }

  if (code === "22P02" || code === "23514") {
    return adminJson({ error: "Dữ liệu không hợp lệ hoặc đang được liên kết." }, 400);
  }

  console.error("Admin database operation failed:", error);
  return adminJson({ error: "Không thể lưu dữ liệu lúc này." }, 500);
}

export function normalizeImagePaths(value: unknown) {
  if (!Array.isArray(value) || value.length > 20) {
    throw new AdminValidationError("Vui lòng nhập tối đa 20 đường dẫn ảnh.");
  }

  const paths = value
    .filter((path): path is string => typeof path === "string")
    .map((path) => path.trim())
    .filter(Boolean);

  const isAllowedImageSource = (source: string) => {
    if (source.startsWith("/image/")) return !source.includes("..");

    try {
      const url = new URL(source);
      const segments = url.pathname.split("/").filter(Boolean);
      return (
        url.protocol === "https:" &&
        url.hostname === "res.cloudinary.com" &&
        !url.username &&
        !url.password &&
        !url.hash &&
        segments[1] === "image" &&
        segments[2] === "upload" &&
        segments.length > 3
      );
    } catch {
      return false;
    }
  };

  if (paths.length !== value.length || paths.some((path) => !isAllowedImageSource(path))) {
    throw new AdminValidationError(
      "Ảnh phải là đường dẫn /image/ nội bộ hoặc URL HTTPS từ res.cloudinary.com.",
    );
  }

  return [...new Set(paths)];
}

export function parseSortOrder(value: unknown) {
  const number = typeof value === "number" ? value : Number(value ?? 0);
  if (!Number.isInteger(number) || number < 0) {
    throw new AdminValidationError("Thứ tự hiển thị phải là số nguyên không âm.");
  }
  return number;
}

export function parseRequiredText(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new AdminValidationError(`${label} không được để trống.`);
  }
  return value.trim();
}

export function parseBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function validationErrorResponse(error: unknown) {
  return adminJson(
    { error: error instanceof Error ? error.message : "Dữ liệu không hợp lệ." },
    400,
  );
}
