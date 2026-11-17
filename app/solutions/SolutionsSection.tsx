import Link from "next/link";
import type { Solution } from "./solutions";

type SolutionsSectionProps = {
  solutions: Solution[];
};

function SolutionIcon({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <circle cx="44" cy="35" r="13" />
        <path d="M44 10v7m0 36v7M19 35h7m36 0h7M26.3 17.3l5 5m25.4 25.4 5 5m0-35.4-5 5M31.3 47.7l-5 5" />
        <path d="M24 68c5-5 10-5 15 0s10 5 15 0 10-5 15 0M29 76c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
        <rect x="21" y="27" width="46" height="39" rx="3" />
        <path d="M34 22h20m-13 13h-8m4-4v8m19-4h-8m-4 8-8 11h7l-2 8 11-13h-8l3-10Z" />
        <path d="M28 71h32" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <path d="M17 42 44 19l27 23v27H17V42Z" />
      <path d="M29 69V48h18v21m9-28h8m-4-4v8" />
      <path d="m61 47-6 9h6l-3 8 10-12h-6l3-5" />
    </svg>
  );
}

export default function SolutionsSection({ solutions }: SolutionsSectionProps) {
  if (solutions.length === 0) {
    return (
      <section className="solution-section solutions-section finished-construction-section" id="solutions">
        <div className="container">
          <div className="eyebrow">GIẢI PHÁP NĂNG LƯỢNG TỪ MB SOLAR</div>
          <p className="solution-empty-state">
            Các giải pháp đang được cập nhật. Vui lòng quay lại sau để xem thêm.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="solution-section solutions-section finished-construction-section" id="solutions">
      <div className="container">
        <div className="eyebrow">GIẢI PHÁP NĂNG LƯỢNG TỪ MB SOLAR</div>
        <div className="solution-card-grid">
          {solutions.slice(0, 3).map((solution, index) => (
            <article className="solution-home-card" key={solution.id}>
              <Link
                className="solution-home-card-link"
                href={`/solutions/${solution.id}`}
                aria-label={`Xem chi tiết ${solution.title}`}
              >
                <span className={`solution-home-icon solution-home-icon-${index + 1}`}>
                  <SolutionIcon variant={index} />
                </span>
                <h2>{solution.title}</h2>
                <p>{solution.introduction}</p>
                <span className="solution-home-more">
                  Xem thêm <span aria-hidden="true">›</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
