import Image from "next/image";
import type { Solution } from "./solutions";

type SolutionDetailProps = {
  solution: Solution;
};

export default function SolutionDetail({ solution }: SolutionDetailProps) {
  const sections = solution.sections.filter((section) => section.image || section.content);

  return (
    <article className="construction-detail container">
      <a className="construction-detail-back" href="/#solutions">
        ← Xem các giải pháp khác
      </a>

      <header className="construction-detail-header">
        <div className="eyebrow">Giải pháp năng lượng</div>
        <h1>{solution.title}</h1>
        <p>{solution.introduction}</p>
      </header>

      {sections.length > 0 ? (
        <div className="solution-detail-gallery">
          {sections.slice(0, 6).map((section, index) => {
            const image = section.image;
            const explanation = section.content ?? solution.introduction;

            return (
              <figure className="solution-detail-card" key={`${solution.id}-detail-${index}`}>
                <div className="construction-detail-figure">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${solution.title} - hình ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 1100px"
                    />
                  ) : (
                    <div className="solution-image-pending">
                      <span>Ảnh minh họa đang được cập nhật</span>
                    </div>
                  )}
                </div>
                <figcaption>
                  <p>{explanation}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <p className="solution-empty-state">Hình ảnh minh họa đang được cập nhật.</p>
      )}

      <section className="construction-contact" aria-labelledby="solution-contact-title">
        <div>
          <div className="eyebrow">MB Solar đồng hành cùng bạn</div>
          <h2 id="solution-contact-title">Bạn đang tìm giải pháp phù hợp?</h2>
          <p>Liên hệ MB Solar để được tư vấn theo nhu cầu công trình của bạn.</p>
        </div>
        <address>
          <a href="tel:+84945046807">☎ 094 504 68 07</a>
          <a href="mailto:nangluongmbsolar@gmail.com">
            ✉ nangluongmbsolar@gmail.com
          </a>
          <span>📍 D7-44, Đường 15, KDC 586, phường Hưng Phú, TP. Cần Thơ</span>
        </address>
      </section>
    </article>
  );
}
