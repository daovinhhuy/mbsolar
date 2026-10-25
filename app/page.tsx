import type { Metadata } from "next";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import ProductCard from "@/component/ProductCard";
import HeroSlider from "@/component/HeroSlider";
import PartnerCard from "@/component/PartnerCard";
import FinishedConstructionSection from "./finished-construction/FinishedConstructionSection";
import AboutImageSlider from "../component/AboutImageSlider";
import { getPartnerRouteKey, getPartners } from "@/services/partners";
import { getHomepageProductCatalog } from "@/services/homepageProductCatalog";
import { getFinishedConstructionProjects } from "@/services/finishedConstructionCatalog";
import SolutionsSection from "./solutions/SolutionsSection";
import { getSolutions } from "@/services/solutionsCatalog";

export const metadata: Metadata = {
  title: "Năng lượng sạch cho tương lai | MB Solar",
};

export default async function Home() {
  const { newProducts, bestSellingProducts } =
    await getHomepageProductCatalog();
  const constructionProjects = await getFinishedConstructionProjects();
  const solutions = await getSolutions();
  const partners = await getPartners();

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <HeroSlider />
          </div>
        </section>
        <section className="trust">
          <div className="container trust-inner">
            <h4 className="trust-description">
              Đằng sau mỗi giải pháp năng lượng mặt trời hiệu quả và bền vững từ
              <em> MB Solar </em> là sự đồng hành của những thương hiệu quốc tế
              uy tín như Huawei, BYD, LONGI, Canadian, ASTRO, Sungrow, DEYE,
              SOLAX, Solis, Deyness, aesolar,...
            </h4>
            <div className="brands">
              {partners.map((partner) => (
                <PartnerCard
                  key={partner.name}
                  name={partner.name}
                  logoSrc={partner.logo}
                  href={`/partner/${getPartnerRouteKey(partner)}`}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="about-section" id="about">
          <div className="container about-grid about-grid-centered">
            <AboutImageSlider />
          </div>
        </section>
        <FinishedConstructionSection projects={constructionProjects} />
        <SolutionsSection solutions={solutions} />
        <section className="products-section" id="products">
          <div className="container">
            <div className="eyebrow">Sản phẩm mới</div>
            <div className="product-grid">
              {newProducts.map((product) => (
                <ProductCard product={product} key={product.name} />
              ))}
            </div>
          </div>
        </section>
        {bestSellingProducts.length > 0 && (
          <section
            className="products-section best-selling-section"
            id="best-selling"
          >
            <div className="container">
              <div className="eyebrow">Sản phẩm bán chạy</div>
              <div className="product-grid">
                {bestSellingProducts.map((product) => (
                  <ProductCard product={product} key={product.name} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="cta-section">
          <div className="container cta">
            <div>
              <div className="eyebrow">Bạn đã sẵn sàng?</div>
              <h2>
                Bắt đầu hành trình
                <br />
                <em>năng lượng xanh</em> hôm nay.
              </h2>
            </div>
            <a className="primary-button light" href="#contact">
              Nhận tư vấn miễn phí <span>↗</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
