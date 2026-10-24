import Link from "next/link";
import ProductCard from "@/component/ProductCard";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/data/products";

type ProductCatalogProps = {
  eyebrow: string;
  title: string;
  description: string;
  filters: ProductCatalogFilter[];
  products: ProductCatalogItem[];
  initialFilter?: string;
  filterPath?: string;
  showFilters?: boolean;
};

export default function ProductCatalog({
  eyebrow,
  title,
  description,
  filters,
  products: catalogProducts,
  initialFilter,
  filterPath,
  showFilters = true,
}: ProductCatalogProps) {
  const selectedFilter = filters.some((filter) => filter.key === initialFilter)
    ? initialFilter ?? "all"
    : "all";
  const products = catalogProducts.filter(
    (product) => selectedFilter === "all" || product.filterKey === selectedFilter,
  );

  return (
    <section className="catalog-section category-products">
      <div className="container">
        <div className="catalog-top">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1 className="category-products-title">{title}</h1>
            <p className="category-products-description">{description}</p>
          </div>
          <span className="catalog-count">{products.length} sản phẩm</span>
        </div>
        {showFilters && (
          <div className="catalog-filter" role="tablist" aria-label={`Lọc ${title}`}>
            {filters.map((filter) => (
              <Link
                className={selectedFilter === filter.key ? "filter-active" : ""}
                key={filter.key}
                role="tab"
                aria-selected={selectedFilter === filter.key}
                href={
                  filter.key === "all"
                    ? filterPath ?? "#products"
                    : `${filterPath ?? "#products"}?filter=${encodeURIComponent(filter.key)}`
                }
              >
                {filter.label}
              </Link>
            ))}
          </div>
        )}
        <div className="product-grid catalog-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
