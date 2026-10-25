import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { getDatabaseConnection } from "@/app/api/connectionDB";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import ProductImageGallery from "@/app/product-detail/ProductImageGallery";
import ProductBackLink from "@/app/product-detail/ProductBackLink";
import type { Product } from "@/data/products";

type Props = { params: Promise<{ slug: string }> };

export const runtime = "nodejs";

type DatabaseProduct = {
  name: string;
  category: string;
  brand: string;
  description: string;
  images: string[];
};

async function getProductBySlug(slug: string): Promise<Product | null> {
  const pool = getDatabaseConnection();
  if (!pool) {
    return null;
  }

  try {
    const { rows } = await pool.query<DatabaseProduct>(
      `
        SELECT
          p.name,
          c.name AS category,
          b.name AS brand,
          p.description,
          COALESCE(
            (
              SELECT json_agg(i.path ORDER BY pi.is_primary DESC, pi.sort_order, i.id)
              FROM product_images AS pi
              JOIN images AS i ON i.id = pi.image_id
              WHERE pi.product_id = p.id
            ),
            '[]'::JSON
          ) AS images
        FROM products AS p
        JOIN brands AS b ON b.id = p.brand_id
        JOIN categories AS c ON c.id = p.category_id
        WHERE p.slug = $1
        LIMIT 1;
      `,
      [slug],
    );

    const product = rows[0];
    return product
      ? {
          name: product.name,
          category: product.category,
          brand: product.brand,
          description: product.description,
          image: product.images[0],
          images: product.images,
        }
      : null;
  } catch (error) {
    console.error("Failed to load product detail from database:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} | MB Solar` : "Sản phẩm | MB Solar",
    description: product?.description ?? "Thông tin sản phẩm từ MB Solar.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image =
    product.image ?? "/image/finished-construction/residential-solar.jpg";
  const images = [...new Set(product.images?.filter(Boolean) ?? [image])];

  return (
    <>
      <Header />
      <main className="product-detail-page">
        <div className="container">
          <div className="product-back-link">
            <ProductBackLink />
          </div>
          <section className="product-overview" aria-labelledby="product-title">
            <div className="product-detail-visual">
              <ProductImageGallery
                images={images.length ? images : [image]}
                productName={product.name}
              />
            </div>

            <div className="product-summary-card">
              <div className="eyebrow">{product.category}</div>
              <h1 id="product-title">{product.name}</h1>
              <div className="product-summary-description">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {product.description}
                </ReactMarkdown>
              </div>
              <div className="product-summary-actions">
                <a className="product-detail-cta" href="tel:0945046807">
                  Tư vấn sản phẩm <span>→</span>
                </a>
                <span className="product-summary-note">
                  Báo giá theo cấu hình và nhu cầu thực tế
                </span>
              </div>
            </div>
          </section>

          <section
            className="product-buy-section"
            aria-labelledby="product-buy-title"
          >
            <div className="product-buy-copy">
              <div className="eyebrow">ĐỒNG HÀNH CÙNG MB SOLAR</div>
              <h2 id="product-buy-title">
                Tư vấn cấu hình, báo giá và hỗ trợ <em>lắp đặt</em>
              </h2>
              <p>
                Đội ngũ MB Solar sẽ giúp bạn chọn đúng thiết bị, kiểm tra khả
                năng tương thích và cung cấp thông tin bảo hành theo model.
              </p>
            </div>
            <div className="product-buy-contact">
              <span>GỌI MB SOLAR</span>
              <a className="product-buy-phone" href="tel:0945046807">
                094 504 68 07
              </a>
              <a
                className="product-detail-cta"
                href="mailto:nangluongmbsolar@gmail.com?subject=T%C6%B0%20v%E1%BA%A5n%20s%E1%BA%A3n%20ph%E1%BA%A9m"
              >
                Gửi yêu cầu tư vấn qua email<span>→</span>
              </a>
              <small>
                D7-44, Đường 15, KDC 586, phường Hưng Phú, TP. Cần Thơ
              </small>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
