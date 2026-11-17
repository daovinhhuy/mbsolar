export const runtime = "nodejs";

const recipient = "nangluongmbsolar@gmail.com";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const form = payload as Record<string, unknown>;
  // Silently accept bot submissions that fill the hidden honeypot field.
  if (stringValue(form.website)) return Response.json({ success: true });

  const name = stringValue(form.name);
  const phone = stringValue(form.phone);
  const email = stringValue(form.email);
  const message = stringValue(form.message);

  if (name.length < 2 || name.length > 120) {
    return Response.json({ error: "Vui lòng nhập họ tên hợp lệ." }, { status: 400 });
  }
  if (phone.length < 7 || phone.length > 25) {
    return Response.json({ error: "Vui lòng nhập số điện thoại hợp lệ." }, { status: 400 });
  }
  if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return Response.json({ error: "Vui lòng kiểm tra lại địa chỉ email." }, { status: 400 });
  }
  if (message.length < 1 || message.length > 3000) {
    return Response.json({ error: "Nội dung tư vấn không hợp lệ." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_EMAIL_FROM;
  if (!apiKey || !sender) {
    console.error("Contact email is not configured: set RESEND_API_KEY and CONTACT_EMAIL_FROM.");
    return Response.json(
      { error: "Hệ thống gửi email chưa được cấu hình. Vui lòng liên hệ MB Solar qua số điện thoại." },
      { status: 503 },
    );
  }

  const lines = [
    "Bạn nhận được yêu cầu tư vấn mới từ website MB Solar.",
    "",
    `Họ và tên: ${name}`,
    `Số điện thoại: ${phone}`,
    `Email: ${email || "Không cung cấp"}`,
    "",
    "Nội dung cần tư vấn:",
    message,
  ];

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `Yêu cầu tư vấn mới từ ${name.replace(/[\r\n]/g, " ")}`,
        text: lines.join("\n"),
        ...(email ? { reply_to: email } : {}),
      }),
      cache: "no-store",
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error("Resend rejected contact email:", emailResponse.status, details);
      return Response.json(
        { error: "Chưa gửi được thông tin. Vui lòng thử lại sau hoặc gọi trực tiếp cho MB Solar." },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return Response.json(
      { error: "Không thể kết nối dịch vụ gửi email. Vui lòng thử lại sau." },
      { status: 502 },
    );
  }
}
