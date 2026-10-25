"use client";

import Image from "next/image";
import logoMb from "@/public/image/logoMB.png";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  configured: boolean;
};

export default function AdminLoginForm({ configured }: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "Không thể đăng nhập.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a className="admin-brand admin-login-brand" href="/" aria-label="MB Solar - Trang chủ">
          <Image className="admin-brand-logo admin-login-brand-logo" src={logoMb} alt="MB Solar" priority />
        </a>
        <p className="admin-eyebrow">KHU VỰC QUẢN TRỊ</p>
        <h1>Đăng nhập Admin</h1>
        <p className="admin-login-description">
          Đăng nhập để quản lý sản phẩm, giải pháp và công trình của MB Solar.
        </p>

        {!configured ? (
          <p className="admin-alert" role="alert">
            Máy chủ chưa có cấu hình ADMIN_USERNAME, ADMIN_PASSWORD và
            ADMIN_SESSION_SECRET.
          </p>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Tên đăng nhập
              <input
                autoComplete="username"
                name="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <label>
              Mật khẩu
              <input
                autoComplete="current-password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <p className="admin-alert" role="alert">{error}</p>}
            <button className="admin-button admin-button-primary" disabled={submitting}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
        )}
        <a className="admin-back-link" href="/">← Quay lại website</a>
      </section>
    </main>
  );
}
