import { createHash } from "node:crypto";
import { adminJson, authorizeAdminRequest } from "@/lib/adminApi";

export const runtime = "nodejs";

const CLOUDINARY_FOLDER = "mb-solar";

export async function POST(request: Request) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return adminJson(
      { error: "Cloudinary chưa được cấu hình. Hãy thêm CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET vào môi trường server." },
      503,
    );
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
    return adminJson({ error: "CLOUDINARY_CLOUD_NAME không hợp lệ." }, 500);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha1")
    .update(`folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return adminJson({
    cloudName,
    apiKey,
    timestamp,
    folder: CLOUDINARY_FOLDER,
    signature,
  });
}
