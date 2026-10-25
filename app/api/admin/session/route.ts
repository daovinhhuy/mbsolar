import { isAdminAuthenticated, isAdminConfigured } from "@/lib/adminAuth";
import { adminJson } from "@/lib/adminApi";

export async function GET() {
  return adminJson({
    authenticated: await isAdminAuthenticated(),
    configured: isAdminConfigured(),
  });
}
