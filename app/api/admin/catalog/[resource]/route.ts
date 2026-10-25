import { getDatabaseConnection } from "@/app/api/connectionDB";
import {
  AdminValidationError,
  adminJson,
  authorizeAdminRequest,
  databaseErrorResponse,
  validationErrorResponse,
} from "@/lib/adminApi";
import {
  isAdminCatalogResource,
  listAdminCatalog,
  parseBrandDraft,
  parseCategoryDraft,
  saveAdminBrand,
  saveAdminCategory,
} from "@/lib/adminCatalog";

export const runtime = "nodejs";

type ResourceContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(request: Request, context: ResourceContext) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;

  const { resource } = await context.params;
  if (!isAdminCatalogResource(resource)) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    return adminJson(await listAdminCatalog(getDatabaseConnection(), resource));
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: Request, context: ResourceContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { resource } = await context.params;
  if (!isAdminCatalogResource(resource)) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    const body = await request.json();
    const id = resource === "brands"
      ? await saveAdminBrand(getDatabaseConnection(), parseBrandDraft(body))
      : await saveAdminCategory(getDatabaseConnection(), parseCategoryDraft(body));
    if (!id) return adminJson({ error: "Không thể tạo dữ liệu." }, 500);
    return adminJson({ id }, 201);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AdminValidationError) {
      return validationErrorResponse(error);
    }
    return databaseErrorResponse(error);
  }
}
