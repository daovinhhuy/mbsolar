"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  {
    src: "/image/about/2.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/3.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/4.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/5.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/6.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/7.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/8.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/9.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/10.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/11.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
  {
    src: "/image/about/12.png",
    alt: "D\u1ed9i ng\u0169 MB Solar trong chuy\u1ebfn tham quan LONGi",
  },
];

export default function AboutImageSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const imageCount = images.length;

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth <= 1000 ? 1 : 2);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxStartIndex = Math.max(0, imageCount - slidesPerView);
  const activeStartIndex = Math.min(activeIndex, maxStartIndex);

  const scrollToImage = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    const left =
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left +
      track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
  };

  if (imageCount === 0) return null;

  return (
    <div className="about-visual">
      <div
        className="about-slider-track"
        ref={trackRef}
        onTouchStart={(event) => {
          if ((event.target as HTMLElement).closest(".about-slider-pagination")) return;
          const touch = event.touches[0];
          if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStartRef.current;
          const touch = event.changedTouches[0];
          touchStartRef.current = null;
          if (!start || !touch) return;

          const deltaX = start.x - touch.clientX;
          const deltaY = start.y - touch.clientY;
          if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

          const nextIndex = Math.max(
            0,
            Math.min(maxStartIndex, activeStartIndex + (deltaX > 0 ? 1 : -1)),
          );
          setActiveIndex(nextIndex);
          scrollToImage(nextIndex);
        }}
        onTouchCancel={() => {
          touchStartRef.current = null;
        }}
        onScroll={(event) => {
          const track = event.currentTarget;
          const firstCard = track.firstElementChild as HTMLElement | null;
          if (!firstCard) return;
          const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
          const step = firstCard.getBoundingClientRect().width + gap;
          setActiveIndex(Math.min(maxStartIndex, Math.round(track.scrollLeft / step)));
        }}
      >
        {images.map((image) => (
          <div className="about-slider-card" key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={image.src === images[0].src}
              sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw"
              className="about-image"
            />
          </div>
        ))}
      </div>
      {maxStartIndex > 0 && (
        <div
          className="about-slider-pagination"
          role="group"
          aria-label="Choose an about slide"
        >
          {Array.from({ length: maxStartIndex + 1 }, (_, index) => (
            <button
              className={`finished-construction-dot${activeStartIndex === index ? " is-active" : ""}`}
              type="button"
              aria-label={`Show about slides starting at ${index + 1}`}
              aria-current={activeStartIndex === index ? "true" : undefined}
              key={index}
              onClick={() => {
                setActiveIndex(index);
                scrollToImage(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
