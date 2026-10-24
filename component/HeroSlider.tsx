"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides: { src: string; alt: string }[] = [
  { src: "/image/background.jpg", alt: "Solar energy solution" },
  { src: "/image/background2.jpg", alt: "Residential solar power system" },
  { src: "/image/backgroundMB1.jpg", alt: "Commercial solar energy solution" },
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <div className="hero-slider" aria-label="MB Solar banner slider">
      <div
        className="hero-slides"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="hero-slide" key={slide.src}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              preload={index === 0}
              unoptimized
              sizes="(max-width: 700px) 100vw, 1160px"
            />
          </div>
        ))}
      </div>

      <button
        className="hero-slider-control hero-slider-prev"
        type="button"
        aria-label="Previous slide"
        onClick={() => goToSlide(activeSlide - 1)}
      />
      <button
        className="hero-slider-control hero-slider-next"
        type="button"
        aria-label="Next slide"
        onClick={() => goToSlide(activeSlide + 1)}
      />

      <div className="hero-slider-dots" role="tablist" aria-label="Choose a banner">
        {slides.map((slide, index) => (
          <button
            className={index === activeSlide ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Go to slide ${index + 1}`}
            key={slide.src}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
