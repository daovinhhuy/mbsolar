import Image from "next/image";
import Link from "next/link";
import type { Solution } from "./solutions";

type SolutionDetailProps = {
  solution: Solution;
};

export default function SolutionDetail({ solution }: SolutionDetailProps) {
  return (
    <article className="construction-detail container">
      <Link className="construction-detail-back" href="/#solutions">
        ← Xem các giải pháp khác
      </Link>

      <header className="construction-detail-header">
        <div className="eyebrow">Giải pháp năng lượng</div>
        <h1>{solution.title}</h1>
        <p>{solution.introduction}</p>
      </header>

      {solution.images.map((image, index) => (
        <figure className="construction-detail-figure" key={image}>
          <Image
            src={image}
            alt={`${solution.title} - hình ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 900px) 100vw, 1100px"
          />
        </figure>
      ))}

      <div className="construction-detail-content">
        {solution.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

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
