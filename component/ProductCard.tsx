import { productSlug, type Product } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="product-card"
      href={`/product-detail/${product.slug ?? productSlug(product.name)}`}
      aria-label={`Xem chi tiết ${product.name}`}
    >
      <div className="product-image">
        <Image src={product.images?.[0] ?? product.image ?? "/image/logoMB.png"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="product-copy">
        <div className="product-meta">
          <span>Thương hiệu: {product.brand}</span>
          {product.badge && <em>{product.badge}</em>}
        </div>
        <h3>{product.name}</h3>
        <p>Giá: Liên hệ</p>
      </div>
    </Link>
  );
}
