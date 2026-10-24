"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  {
    src: "/image/about/2.png",
    alt: "Đội ngũ MB Solar trong chuyến tham quan LONGi",
  },
  {
    src: "/image/about/3.png",
    alt: "Thông tin công ty",
  },
  {
    src: "/image/about/4.png",
    alt: "Cơ sở pháp lý",
  },
  {
    src: "/image/about/5.png",
    alt: "Tầm nhìn và chiến lượt",
  },
  {
    src: "/image/about/6.png",
    alt: "Đối tác",
  },
  {
    src: "/image/about/7.png",
    alt: "Vì sao nên chọn MB Solar",
  },
  {
    src: "/image/about/8.png",
    alt: "100+ công trình đã làm",
  },
  {
    src: "/image/about/9.png",
    alt: "Giải pháp trọn gói",
  },
  {
    src: "/image/about/10.png",
    alt: "Đảm bảo an toàn",
  },
  {
    src: "/image/about/11.png",
    alt: "Lĩnh vực kinh doanh",
  },
  {
    src: "/image/about/12.png",
    alt: "Quy chuẩn thi công",
  },
];

export default function AboutImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  function showImage(offset: number) {
    setActiveIndex(
      (current) => (current + offset + images.length) % images.length,
    );
  }

  return (
    <div className="about-visual">
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        priority
        sizes="(max-width: 760px) 100vw, 51vw"
        className="about-image"
      />
      <button
        className="about-slider-arrow about-slider-previous"
        type="button"
        aria-label="Xem hình trước"
        onClick={() => showImage(-1)}
      >
        ‹
      </button>
      <button
        className="about-slider-arrow about-slider-next"
        type="button"
        aria-label="Xem hình tiếp theo"
        onClick={() => showImage(1)}
      >
        ›
      </button>
      <span className="about-slider-count" aria-live="polite">
        {activeIndex + 1} / {images.length}
      </span>
    </div>
  );
}
