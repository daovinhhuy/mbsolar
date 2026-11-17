"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FinishedConstructionProject } from "./projects";

type FinishedConstructionSectionProps = {
  projects: FinishedConstructionProject[];
};

export default function FinishedConstructionSection({
  projects,
}: FinishedConstructionSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const projectCount = projects.length;

  useEffect(() => {
    const updateSlidesPerView = () => {
      const nextSlidesPerView =
        window.innerWidth <= 700 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
      setSlidesPerView(nextSlidesPerView);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxStartIndex = Math.max(0, projectCount - slidesPerView);
  const activeStartIndex = Math.min(activeIndex, maxStartIndex);

  const scrollToProject = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;

    const left =
      slide.getBoundingClientRect().left -
      track.getBoundingClientRect().left +
      track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
  };

  const showPreviousProject = () => {
    const nextIndex = Math.max(0, activeStartIndex - 1);
    setActiveIndex(nextIndex);
    scrollToProject(nextIndex);
  };

  const showNextProject = () => {
    const nextIndex = Math.min(maxStartIndex, activeStartIndex + 1);
    setActiveIndex(nextIndex);
    scrollToProject(nextIndex);
  };

  if (projectCount === 0) return null;

  return (
    <section className="finished-construction-section" id="finished-construction">
      <div className="container">
          <div>
            <div className="eyebrow">
              NHỮNG CÔNG TRÌNH ĐÃ THI CÔNG HOÀN TẤT CỦA MB SOLAR 
            </div>
          </div>
        <div
          className="finished-construction-carousel"
          role="region"
          aria-label="Công trình đã hoàn thành"
          aria-roledescription="carousel"
        >
          <div
            className="finished-construction-track"
            ref={trackRef}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (!touch) return;
              touchStartRef.current = { x: touch.clientX, y: touch.clientY };
              suppressClickRef.current = false;
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
              if (nextIndex === activeStartIndex) return;

              suppressClickRef.current = true;
              window.setTimeout(() => {
                suppressClickRef.current = false;
              }, 500);
              setActiveIndex(nextIndex);
              scrollToProject(nextIndex);
            }}
            onTouchCancel={() => {
              touchStartRef.current = null;
            }}
            onClickCapture={(event) => {
              if (!suppressClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }}
            onScroll={(event) => {
              const track = event.currentTarget;
              const firstSlide = track.firstElementChild as HTMLElement | null;
              if (!firstSlide) return;
              const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
              const step = firstSlide.getBoundingClientRect().width + gap;
              setActiveIndex(Math.min(maxStartIndex, Math.round(track.scrollLeft / step)));
            }}
          >
            {projects.map((project, index) => (
              <Link
                className="finished-construction-slide"
                href={`/finished-construction/${project.id}`}
                aria-label={`Xem chi ti\u1ebft: ${project.title}`}
                key={project.id}
              >
                <div className="finished-construction-image">
                  {project.images[0] && (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw"
                      priority={index === 0}
                    />
                  )}
                </div>
                <div className="finished-construction-copy">
                  <span className="finished-construction-label">{"C\u00f4ng tr\u00ecnh ti\u00eau bi\u1ec3u"}</span>
                  <h3>{project.title}</h3>
                  <p>{project.introduction}</p>
                  <span className="finished-construction-read-more">
                    {"Xem chi ti\u1ebft"} <span aria-hidden="true">{"\u2192"}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {maxStartIndex > 0 && (
            <div
              className="finished-construction-pagination"
              role="group"
              aria-label="Choose a group of finished projects"
            >
              {Array.from({ length: maxStartIndex + 1 }, (_, index) => (
                <button
                  className={`finished-construction-dot${activeStartIndex === index ? " is-active" : ""}`}
                  type="button"
                  aria-label={`Show projects ${index + 1} through ${Math.min(index + slidesPerView, projectCount)} of ${projectCount}`}
                  aria-current={activeStartIndex === index ? "true" : undefined}
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    scrollToProject(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
