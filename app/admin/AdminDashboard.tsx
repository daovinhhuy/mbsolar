"use client";
import Link from "next/link";
import Image from "next/image";
import logoMb from "@/public/image/logoMB.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CatalogManager from "./CatalogManager";
import ContentManager from "./ContentManager";
import ProductManager from "./ProductManager";

type AdminTab = "products" | "brands" | "categories" | "solutions" | "construction-projects";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "products", label: "Sản phẩm" },
  { id: "brands", label: "Thương hiệu" },
  { id: "categories", label: "Danh mục" },
  { id: "solutions", label: "Giải pháp" },
  { id: "construction-projects", label: "Công trình đã làm" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <Link className="admin-brand" href="/" aria-label="MB Solar - Trang chủ">
          <Image className="admin-brand-logo" src={logoMb} alt="MB Solar" priority />
        </Link>
        <div className="admin-topbar-actions">
          <span className="admin-user-label">MB Solar | Admin</span>
          <button
            className="admin-button admin-button-subtle"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}
          </button>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-heading-row">
          <div>
            <p className="admin-eyebrow">MB SOLAR · ADMIN</p>
            <h1 className="font-black font-sans">Quản lý nội dung hiển thị MB Solar</h1>
            <p className="admin-page-description">
              Quản lý dữ liệu đang hiển thị trên website.
            </p>
          </div>
          <a
            className="admin-button admin-button-outline"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Xem website ↗
          </a>
        </div>

        <nav className="admin-tabs" role="tablist" aria-label="Loại nội dung">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={
                activeTab === tab.id ? "admin-tab active" : "admin-tab"
              }
              id={`admin-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div
          className="admin-panel"
          role="tabpanel"
          aria-labelledby={`admin-tab-${activeTab}`}
        >
          {activeTab === "products" ? (
            <ProductManager />
          ) : activeTab === "brands" ? (
            <CatalogManager key="brands" resource="brands" title="thương hiệu" />
          ) : activeTab === "categories" ? (
            <CatalogManager key="categories" resource="categories" title="danh mục" />
          ) : activeTab === "solutions" ? (
            <ContentManager resource="solutions" title="Giải pháp" />
          ) : (
            <ContentManager
              resource="construction-projects"
              title="Công trình đã làm"
            />
          )}
        </div>
      </section>
    </main>
  );
}
