"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

type Props = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: Props) {
  const galleryImages = images.length ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeImage = galleryImages[activeIndex];

  function showImage(index: number) {
    setActiveIndex((index + galleryImages.length) % galleryImages.length);
    setZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  }

  function updateZoomPosition(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" && !zoomed) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    setZoomPosition({
      x: Math.max(
        0,
        Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
      ),
      y: Math.max(
        0,
        Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100),
      ),
    });

    if (event.pointerType !== "touch") setZoomed(true);
  }

  return (
    <div className="product-gallery">
      <div
        className={`product-gallery-stage${zoomed ? " is-zoomed" : ""}`}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            touchStart.current = { x: event.clientX, y: event.clientY };
          }
        }}
        onPointerMove={updateZoomPosition}
        onPointerUp={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (
            event.pointerType !== "touch" ||
            !start ||
            (event.target as Element).closest("button") ||
            Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12
          )
            return;

          const bounds = event.currentTarget.getBoundingClientRect();
          setZoomPosition({
            x: Math.max(
              0,
              Math.min(
                100,
                ((event.clientX - bounds.left) / bounds.width) * 100,
              ),
            ),
            y: Math.max(
              0,
              Math.min(
                100,
                ((event.clientY - bounds.top) / bounds.height) * 100,
              ),
            ),
          });
          setZoomed((current) => !current);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") setZoomed(false);
        }}
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${productName} — ảnh ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 800px) 100vw, 52vw"
          unoptimized={
            !activeImage.startsWith("/") &&
            !activeImage.includes("images.unsplash.com")
          }
          style={{
            transform: zoomed ? "scale(2.2)" : "scale(1)",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
        {galleryImages.length > 1 && (
          <>
            <button
              className="product-gallery-arrow product-gallery-previous"
              type="button"
              aria-label="Xem ảnh trước"
              onClick={() => showImage(activeIndex - 1)}
            >
              ‹
            </button>
            <button
              className="product-gallery-arrow product-gallery-next"
              type="button"
              aria-label="Xem ảnh tiếp theo"
              onClick={() => showImage(activeIndex + 1)}
            >
              ›
            </button>
            <span className="product-gallery-count" aria-live="polite">
              {activeIndex + 1} / {galleryImages.length}
            </span>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div
          className="product-gallery-thumbnails"
          aria-label="Thư viện ảnh sản phẩm"
        >
          {galleryImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              className={`product-gallery-thumbnail${index === activeIndex ? " is-active" : ""}`}
              type="button"
              aria-label={`Xem ảnh ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => showImage(index)}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="88px"
                unoptimized={
                  !src.startsWith("/") && !src.includes("images.unsplash.com")
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
