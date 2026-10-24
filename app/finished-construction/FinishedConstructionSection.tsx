"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FinishedConstructionProject } from "./projects";

type FinishedConstructionSectionProps = {
  projects: FinishedConstructionProject[];
};

export default function FinishedConstructionSection({
  projects,
}: FinishedConstructionSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const projectCount = projects.length;

  if (projectCount === 0) return null;

  const activeProject = projects[activeIndex];

  const showPreviousProject = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + projectCount) % projectCount);
  };

  const showNextProject = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % projectCount);
  };

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
          <Link
            className="finished-construction-slide"
            href={`/finished-construction/${activeProject.id}`}
            aria-label={`Xem chi tiết: ${activeProject.title}`}
          >
            <div className="finished-construction-image">
              {activeProject.images[0] && (
                <Image
                  src={activeProject.images[0]}
                  alt={activeProject.title}
                  fill
                  sizes="(max-width: 700px) 100vw, 58vw"
                  priority={activeIndex === 0}
                />
              )}
            </div>
            <div className="finished-construction-copy" aria-live="polite">
              <span className="finished-construction-label">Công trình tiêu biểu</span>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.introduction}</p>
              <span className="finished-construction-read-more">
                Xem chi tiết <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
          <div className="finished-construction-controls" aria-label="Điều hướng công trình">
            <button
              className="finished-construction-arrow"
              type="button"
              onClick={showPreviousProject}
              aria-label="Xem công trình trước"
            >
              <span aria-hidden="true">←</span>
            </button>
            <span className="finished-construction-counter" aria-live="polite">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="finished-construction-counter-divider">/</span>
              {String(projectCount).padStart(2, "0")}
            </span>
            <button
              className="finished-construction-arrow"
              type="button"
              onClick={showNextProject}
              aria-label="Xem công trình tiếp theo"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
