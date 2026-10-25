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
  deleteContent,
  isContentResource,
  parseContentDraft,
  saveContent,
} from "@/lib/adminContent";

export const runtime = "nodejs";

type ItemContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function PUT(request: Request, context: ItemContext) {
  const denied = await authorizeAdminRequest(request, true);
  if (denied) return denied;

  const { resource, id: rawId } = await context.params;
  const id = parseDatabaseId(rawId);
  if (!isContentResource(resource) || !id) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    const draft = parseContentDraft(await request.json());
    const savedId = await saveContent(getDatabaseConnection(), resource, draft, id);
    if (!savedId) return adminJson({ error: "Không tìm thấy nội dung." }, 404);
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
  if (!isContentResource(resource) || !id) {
    return adminJson({ error: "Không tìm thấy mục quản lý." }, 404);
  }

  try {
    const deleted = await deleteContent(getDatabaseConnection(), resource, id);
    return deleted
      ? adminJson({ deleted: true })
      : adminJson({ error: "Không tìm thấy nội dung." }, 404);
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
