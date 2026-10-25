import { getDatabaseConnection } from "@/app/api/connectionDB";
import {
  AdminValidationError,
  adminJson,
  authorizeAdminRequest,
  databaseErrorResponse,
  parseDatabaseId,
  validationErrorResponse,
} from "@/lib/adminApi";
import { deleteProduct, parseProductDraft, saveProduct } from "@/lib/adminProducts";

export const runtime = "nodejs";

type ProductContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: ProductContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { id: rawId } = await context.params;
  const id = parseDatabaseId(rawId);
  if (!id) return adminJson({ error: "Không tìm thấy sản phẩm." }, 404);

  try {
    const draft = parseProductDraft(await request.json());
    const savedId = await saveProduct(getDatabaseConnection(), draft, id);
    if (!savedId) return adminJson({ error: "Không tìm thấy sản phẩm." }, 404);
    return adminJson({ id: savedId });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AdminValidationError) {
      return validationErrorResponse(error);
    }
    return databaseErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: ProductContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { id: rawId } = await context.params;
  const id = parseDatabaseId(rawId);
  if (!id) return adminJson({ error: "Không tìm thấy sản phẩm." }, 404);

  try {
    const deleted = await deleteProduct(getDatabaseConnection(), id);
    return deleted
      ? adminJson({ deleted: true })
      : adminJson({ error: "Không tìm thấy sản phẩm." }, 404);
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
