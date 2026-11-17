"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Không gửi được thông tin. Vui lòng thử lại.");
      }

      form.reset();
      setStatus("Thông tin đã được gửi thành công. MB Solar sẽ sớm liên hệ với bạn.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Không gửi được thông tin. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="home-contact-section" id="contact">
      <div className="container home-contact-grid">
        <div>
          <div className="eyebrow">BẠN ĐÃ SẴN SÀNG?</div>
          <h2>
            Bắt đầu hành trình <em>năng lượng xanh</em> hôm nay.
          </h2>
          <p>Chia sẻ nhu cầu của bạn để đội ngũ MB Solar liên hệ hỗ trợ.</p>
        </div>
        <form className="home-contact-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input name="name" autoComplete="name" maxLength={120} required />
          </label>
          <label>
            Số điện thoại
            <input name="phone" type="tel" autoComplete="tel" maxLength={25} required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" maxLength={254} />
          </label>
          <label>
            Nội dung cần tư vấn
            <textarea name="message" rows={4} maxLength={3000} required />
          </label>
          <div className="contact-form-trap" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Đang gửi…" : "Gửi thông tin"} <span aria-hidden="true">↗</span>
          </button>
          <p className="contact-form-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}
