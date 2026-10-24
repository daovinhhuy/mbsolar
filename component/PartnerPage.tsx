import Image from "next/image";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductCard from "@/component/ProductCard";
import type { Partner } from "@/types/partner";

export default function PartnerPage({ partner }: { partner: Partner }) {
  return (
    <>
      <Header />
      <main className="partner-profile-page">
        <section className="partner-profile-intro">
          <div className="container">
            <div className="partner-profile-logo">
              <Image
                src={partner.image}
                alt={partner.name}
                width={560}
                height={350}
                style={{ objectFit: "contain", objectPosition: "center" }}
                priority
              />
            </div>
            <div className="partner-profile-copy">
              <div className="eyebrow">Đối tác công nghệ</div>
              <h1>{partner.name}</h1>
              <p className="partner-profile-description">
                {partner.description}
              </p>
              <h2>{partner.introTitle}</h2>
              <p>{partner.introText}</p>
              {partner.website && (
                <a
                  className="primary-button"
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website {partner.name} <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {!!partner.products?.length && (
          <section
            className="brand-products partner-products"
            id="partner-products"
          >
            <div className="container">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Sản phẩm liên quan</div>
                  <h2>
                    Sản phẩm <em>{partner.name}</em>
                    
                  </h2>
                </div>
                <span className="catalog-count">
                  {partner.products.length} sản phẩm
                </span>
              </div>
              <div className="product-grid">
                {partner.products.map((product) => (
                  <ProductCard product={product} key={product.name} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
