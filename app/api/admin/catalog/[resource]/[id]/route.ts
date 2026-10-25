import { getDatabaseConnection } from "@/app/api/connectionDB";
import {
  AdminValidationError,
  adminJson,
  authorizeAdminRequest,
  databaseErrorResponse,
  parseDatabaseId,
  validationErrorResponse,
} from "@/lib/adminApi";
import {
  AdminCatalogConflictError,
  deleteAdminCatalogItem,
  isAdminCatalogResource,
  parseBrandDraft,
  parseCategoryDraft,
  saveAdminBrand,
  saveAdminCategory,
} from "@/lib/adminCatalog";

export const runtime = "nodejs";

type ItemContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function PUT(request: Request, context: ItemContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { resource, id: rawId } = await context.params;
  const id = parseDatabaseId(rawId);
  if (!isAdminCatalogResource(resource) || !id) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    const body = await request.json();
    const savedId = resource === "brands"
      ? await saveAdminBrand(getDatabaseConnection(), parseBrandDraft(body), id)
      : await saveAdminCategory(getDatabaseConnection(), parseCategoryDraft(body), id);
    if (!savedId) return adminJson({ error: "Không tìm thấy dữ liệu cần sửa." }, 404);
    return adminJson({ id: savedId });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AdminValidationError) {
      return validationErrorResponse(error);
    }
    return databaseErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: ItemContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { resource, id: rawId } = await context.params;
  const id = parseDatabaseId(rawId);
  if (!isAdminCatalogResource(resource) || !id) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    const deleted = await deleteAdminCatalogItem(getDatabaseConnection(), resource, id);
    if (!deleted) return adminJson({ error: "Không tìm thấy dữ liệu cần xóa." }, 404);
    return adminJson({ deleted: true });
  } catch (error) {
    if (error instanceof AdminCatalogConflictError) {
      return adminJson({ error: error.message }, 409);
    }
    return databaseErrorResponse(error);
  }
}
