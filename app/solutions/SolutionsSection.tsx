"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Solution } from "./solutions";

type SolutionsSectionProps = {
  solutions: Solution[];
};

export default function SolutionsSection({ solutions }: SolutionsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const solutionCount = solutions.length;

  if (solutionCount === 0) {
    return (
      <section
        className="solution-section finished-construction-section"
        id="solutions"
      >
        <div className="container">
          <div className="eyebrow">GIẢI PHÁP NĂNG LƯỢNG TỪ MB SOLAR</div>
          <p className="solution-empty-state">
            Các giải pháp đang được cập nhật. Vui lòng quay lại sau để xem thêm.
          </p>
        </div>
      </section>
    );
  }

  const activeSolution = solutions[activeIndex];

  const showPreviousSolution = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + solutionCount) % solutionCount);
  };

  const showNextSolution = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % solutionCount);
  };

  return (
    <section
      className="solution-section finished-construction-section"
      id="solutions"
    >
      <div className="container">
        <div className="eyebrow">GIẢI PHÁP NĂNG LƯỢNG TỪ MB SOLAR</div>
        <div
          className="finished-construction-carousel"
          role="region"
          aria-label="Các giải pháp năng lượng"
          aria-roledescription="carousel"
        >
          <Link
            className="finished-construction-slide"
            href={`/solutions/${activeSolution.id}`}
            aria-label={`Xem chi tiết: ${activeSolution.title}`}
          >
            <div className="finished-construction-image">
              {activeSolution.images[0] && (
                <Image
                  src={activeSolution.images[0]}
                  alt={activeSolution.title}
                  fill
                  sizes="(max-width: 700px) 100vw, 58vw"
                  priority={activeIndex === 0}
                />
              )}
            </div>
            <div className="finished-construction-copy" aria-live="polite">
              <span className="finished-construction-label">Giải pháp tiêu biểu</span>
              <h3>{activeSolution.title}</h3>
              <p>{activeSolution.introduction}</p>
              <span className="finished-construction-read-more">
                Xem chi tiết <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
          <div className="finished-construction-controls" aria-label="Điều hướng giải pháp">
            <button
              className="finished-construction-arrow"
              type="button"
              onClick={showPreviousSolution}
              aria-label="Xem giải pháp trước"
            >
              <span aria-hidden="true">←</span>
            </button>
            <span className="finished-construction-counter" aria-live="polite">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="finished-construction-counter-divider">/</span>
              {String(solutionCount).padStart(2, "0")}
            </span>
            <button
              className="finished-construction-arrow"
              type="button"
              onClick={showNextSolution}
              aria-label="Xem giải pháp tiếp theo"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
