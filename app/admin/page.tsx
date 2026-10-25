import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const metadata = { title: "Quản trị | MB Solar" };

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <AdminDashboard />;
}
