import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/adminAuth";
import AdminLoginForm from "../AdminLoginForm";

export const metadata = { title: "Đăng nhập Admin | MB Solar" };

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return <AdminLoginForm configured={isAdminConfigured()} />;
}
