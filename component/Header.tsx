"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuGroups } from "@/app/constants/menuGroups";
import logoMb from "@/public/image/logoMB-header.png";

function itemHref(item: string) {
  if (item === "Pin lưu trữ Hithium")
    return "/products/storage-battery/storage-battery-hithium";
  if (item === "Hệ thống lưu trữ công nghiệp C&I SolaX")
    return "/products/storage-battery/c&i-industry";
  if (item === "Inverter SolaX Hybrid 1 phase")
    return "/products/inverter/solax-hybrid-1-phase";
  if (item === "Inverter SolaX Hybrid 3 phase")
    return "/products/inverter/solax-hybrid-3-phase";
  if (item === "Inverter SolaX Hybrid 3 phase áp cao")
    return "/products/inverter/solax-hybrid-3-phase-high-voltage";
  if (item === "Inverter Solis Hybrid 1 phase")
    return "/products/inverter/solis-hybrid-1-phase";
  if (item === "Inverter Solis Hybrid 3 phase")
    return "/products/inverter/solis-hybrid-3-phase";
  if (item === "Inverter Sungrow Hybrid 1 phase")
    return "/products/inverter/sungrow-hybrid-1-phase";
  if (item === "Tủ điện Hybrid")
    return "/products/phukienNLMT/phukienNLMT-tu-dien-hybrid";
  if (item === "Phụ kiện SolaX Power")
    return "/products/phukienNLMT/phukienNLMT-phu-kien-solax";
  if (item === "Dây cáp DC Leader")
    return "/products/phukienNLMT/phukienNLMT-day-cap-dc";
  if (item === "Phụ kiện Sigenergy")
    return "/products/phukienNLMT/phukienNLMT-phu-kien-sigenergy";
  if (item === "Pin lưu trữ SolaX")
    return "/products/storage-battery/storage-battery-pin-luu-tru-solax";
  if (item === "Pin Lưu trữ SOLIS")
    return "/products/storage-battery/storage-battery-pin-luu-tru-solis";
  if (item === "Pin Lưu trữ SUNGROW")
    return "/products/storage-battery/storage-battery-pin-luu-tru-sungrow";
  if (item === "Pin lưu trữ Dyness")
    return "/products/storage-battery/storage-battery-pin-luu-tru-dyness";
  return "#products";
}
function groupHref(label: string) {
  if (label === "Tấm pin năng lượng mặt trời")
    return "/products/tam-pin-nang-luong-mat-troi";
  if (label === "Inverter") return "/products/inverter";
  if (label === "Phụ kiện NLMT") return "/products/phukienNLMT";
  if (label === "Pin lưu trữ năng lượng") return "/products/storage-battery";
  return "#products";
}

const topbarMessages = [
  "Giải pháp năng lượng xanh cho tương lai",
  "3+ Năm kinh nghiệm",
  "Công suất đã lắp đặt: 2.5 MW",
  "98% Khách hàng hài lòng",
  "📞 Hotline: 094 504 68 07",
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="topbar">
        <div
          className="container topbar-inner text-sm"
          role="region"
          aria-label="Thông tin MB Solar"
        >
          <div className="topbar-track">
            {[0, 1, 2].map((copy) => (
              <div
                className="topbar-group"
                aria-hidden={copy > 0}
                key={copy}
              >
                {topbarMessages.map((message, index) => (
                  <span
                    className={index === topbarMessages.length - 1 ? "text-base" : undefined}
                    key={message}
                  >
                    {message}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container nav-wrap">
        <Link className="logo" href="/">
          <Image src={logoMb} alt="MB Solar" priority />
        </Link>
        <div className="mobile-tagline">
          <span>Năng lượng mặt trời MB Solar</span>
          <span>Vì một hành tinh xanh</span>
        </div>
        <input
          className="menu-checkbox"
          id="mobile-menu-toggle"
          type="checkbox"
          checked={open}
          onChange={(event) => setOpen(event.target.checked)}
          aria-label="Mở menu"
        />
        <nav
          className={open ? "main-nav open" : "main-nav"}
          id="main-navigation"
          onClick={() => setOpen(false)}
        >
          {menuGroups.map((group) => {
            const href = group.items
              ? groupHref(group.label)
              : group.href;
            const active = href === "/"
              ? pathname === "/"
              : href !== undefined && href !== "#products" && pathname.startsWith(href);
            return group.items ? (
              <div className="nav-dropdown" key={group.label}>
                <a
                  className={`nav-link ${active ? "active" : ""}`}
                  href={href}
                >
                  {group.label}
                </a>
                <div className="dropdown-menu">
                  {group.items.map((item) => (
                    <a href={itemHref(item)} key={item}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                className={`nav-link ${active ? "active" : ""} ${group.label === "Đăng nhập" ? "nav-login-link" : ""}`}
                href={href ?? "#products"}
                key={group.label}
              >
                {group.label}
              </a>
            );
          })}
        </nav>

        <label
          className="menu-toggle"
          htmlFor="mobile-menu-toggle"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
          aria-controls="main-navigation"
        >
          <span />
          <span />
          <span />
        </label>
      </div>
    </header>
  );
}
