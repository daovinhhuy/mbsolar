import { getDatabaseConnection } from "@/app/api/connectionDB";
import {
  AdminValidationError,
  adminJson,
  authorizeAdminRequest,
  databaseErrorResponse,
  validationErrorResponse,
} from "@/lib/adminApi";
import {
  isContentResource,
  listContent,
  parseContentDraft,
  saveContent,
} from "@/lib/adminContent";

export const runtime = "nodejs";

type ResourceContext = {
  params: Promise<{ resource: string }>;
};

export async function GET(request: Request, context: ResourceContext) {
  const denied = await authorizeAdminRequest(request);
  if (denied) return denied;

  const { resource } = await context.params;
  if (!isContentResource(resource)) return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);

  try {
    const items = await listContent(getDatabaseConnection(), resource);
    return adminJson({ items });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: Request, context: ResourceContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { resource } = await context.params;
  if (!isContentResource(resource)) return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);

  try {
    const draft = parseContentDraft(await request.json());
    const id = await saveContent(getDatabaseConnection(), resource, draft);
    if (!id) return adminJson({ error: "Không thể tạo nội dung." }, 500);
    return adminJson({ id }, 201);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof AdminValidationError) {
      return validationErrorResponse(error);
    }
    return databaseErrorResponse(error);
  }
}
