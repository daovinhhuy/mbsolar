import { getDatabaseConnection } from "@/app/api/connectionDB";
import {
  AdminValidationError,
  adminJson,
  authorizeAdminRequest,
  databaseErrorResponse,
  validationErrorResponse,
} from "@/lib/adminApi";
import { listAdminProducts, parseProductDraft, saveProduct } from "@/lib/adminProducts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;

  try {
    return adminJson(await listAdminProducts(getDatabaseConnection()));
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  try {
    const draft = parseProductDraft(await request.json());
    const id = await saveProduct(getDatabaseConnection(), draft);
    if (!id) return adminJson({ error: "Không thể tạo sản phẩm." }, 500);
    return adminJson({ id }, 201);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AdminValidationError) {
      return validationErrorResponse(error);
    }
    return databaseErrorResponse(error);
  }
}
