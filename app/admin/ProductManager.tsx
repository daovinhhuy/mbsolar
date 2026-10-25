"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import ImageUploadField, { type ImageUploadFieldHandle } from "./ImageUploadField";

type BrandOption = { id: string; name: string };
type CategoryOption = {
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
};
type AdminProduct = {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  categoryParentId: string | null;
  slug: string;
  name: string;
  modelNumber: string | null;
  description: string;
  badge: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
  images: string[];
};
type ProductDraft = {
  brandId: string;
  categoryId: string;
  slug: string;
  name: string;
  modelNumber: string;
  description: string;
  badge: string;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: string;
  images: string;
};

const emptyDraft: ProductDraft = {
  brandId: "",
  categoryId: "",
  slug: "",
  name: "",
  modelNumber: "",
  description: "",
  badge: "",
  isNew: false,
  isBestSeller: false,
  isActive: true,
  sortOrder: "0",
  images: "",
};

type ProductLoadResult = {
  items?: AdminProduct[];
  brands?: BrandOption[];
  categories?: CategoryOption[];
  error?: string;
};

async function fetchAdminProducts() {
  const response = await fetch("/api/admin/products", { cache: "no-store" });
  const result = (await response.json()) as ProductLoadResult;
  if (!response.ok) throw new Error(result.error ?? "Không thể tải sản phẩm.");
  return result;
}

export default function ProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFieldKey, setImageFieldKey] = useState(0);
  const imageUploaderRef = useRef<ImageUploadFieldHandle>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const applyLoadResult = useCallback((result: ProductLoadResult) => {
    setProducts(result.items ?? []);
    setBrands(result.brands ?? []);
    setCategories(result.categories ?? []);
    setDraft((current) => ({
      ...current,
      brandId: current.brandId || result.brands?.[0]?.id || "",
      categoryId: current.categoryId || result.categories?.[0]?.id || "",
    }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      applyLoadResult(await fetchAdminProducts());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [applyLoadResult]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminProducts()
      .then((result) => {
        if (!cancelled) applyLoadResult(result);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải sản phẩm.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applyLoadResult]);

  function resetForm() {
    setEditingId(null);
    setImageFieldKey((current) => current + 1);
    setNotice("");
    setError("");
    setDraft({
      ...emptyDraft,
      brandId: brands[0]?.id ?? "",
      categoryId: categories[0]?.id ?? "",
    });
  }

  function beginEdit(product: AdminProduct) {
    setEditingId(product.id);
    setImageFieldKey((current) => current + 1);
    setNotice("");
    setError("");
    setDraft({
      brandId: product.brandId,
      categoryId: product.categoryId,
      slug: product.slug,
      name: product.name,
      modelNumber: product.modelNumber ?? "",
      description: product.description,
      badge: product.badge ?? "",
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      isActive: product.isActive,
      sortOrder: String(product.sortOrder),
      images: product.images.join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const uploadedImages = await imageUploaderRef.current?.uploadSelectedFiles() ?? [];
      const response = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...draft,
            sortOrder: Number(draft.sortOrder),
            images: [
              ...draft.images.split(/\r?\n/).map((path) => path.trim()).filter(Boolean),
              ...uploadedImages,
            ],
          }),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu sản phẩm.");

      resetForm();
      setNotice(editingId ? "Đã cập nhật sản phẩm." : "Đã tạo sản phẩm.");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể xóa sản phẩm.");
      if (editingId === product.id) resetForm();
      setNotice("Đã xóa sản phẩm.");
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa sản phẩm.");
    }
  }

  return (
    <div className="admin-manager-grid">
      <section className="admin-card admin-editor-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">SẢN PHẨM</p>
            <h2>{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h2>
          </div>
          {editingId && <button className="admin-text-button" onClick={resetForm} type="button">Hủy chỉnh sửa</button>}
        </div>

        {error && <p className="admin-alert" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        {brands.length === 0 || categories.length === 0 ? (
          <p className="admin-help-text">Cần có thương hiệu và danh mục đang hoạt động trong database trước khi tạo sản phẩm.</p>
        ) : (
          <form className="admin-form" onSubmit={handleSave}>
            <div className="admin-form-grid">
              <label>
                Tên sản phẩm
                <input required maxLength={300} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </label>
              <label>
                Đường dẫn (slug)
                <input required maxLength={180} placeholder="ten-san-pham" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
              </label>
              <label>
                Thương hiệu
                <select required value={draft.brandId} onChange={(event) => setDraft({ ...draft, brandId: event.target.value })}>
                  {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                </select>
              </label>
              <label>
                Danh mục
                <select required value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.parentName ? `${category.parentName} / ` : ""}{category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Mã model
                <input maxLength={200} value={draft.modelNumber} onChange={(event) => setDraft({ ...draft, modelNumber: event.target.value })} />
              </label>
              <label>
                Nhãn
                <input maxLength={120} placeholder="Ví dụ: N-type" value={draft.badge} onChange={(event) => setDraft({ ...draft, badge: event.target.value })} />
              </label>
            </div>

            <label>
              Mô tả sản phẩm
              <textarea required rows={7} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
            <ImageUploadField
              key={imageFieldKey}
              ref={imageUploaderRef}
              label="Ảnh sản phẩm"
              placeholder="/image/products/ten-anh.jpg hoặc URL Cloudinary"
              helpText="Chọn ảnh để tải lên Cloudinary hoặc giữ đường dẫn ảnh cũ. Ảnh đầu tiên là ảnh chính. Khi bấm lưu, các ảnh đã chọn sẽ được tải lên rồi lưu đường dẫn vào database."
              value={draft.images}
              onChange={(images) => setDraft((current) => ({ ...current, images }))}
              onUploadingChange={setUploadingImage}
            />

            <div className="admin-checkbox-row">
              <label className="admin-checkbox"><input type="checkbox" checked={draft.isNew} onChange={(event) => setDraft({ ...draft, isNew: event.target.checked })} /> Sản phẩm mới</label>
              <label className="admin-checkbox"><input type="checkbox" checked={draft.isBestSeller} onChange={(event) => setDraft({ ...draft, isBestSeller: event.target.checked })} /> Bán chạy</label>
              <label className="admin-checkbox"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} /> Đang hiển thị</label>
            </div>

            <div className="admin-form-actions">
              <button className="admin-button admin-button-primary" disabled={saving || uploadingImage}>
                {uploadingImage ? "Đang tải ảnh…" : saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
              </button>
              <button className="admin-button admin-button-outline" onClick={resetForm} type="button">Làm mới</button>
            </div>
          </form>
        )}
      </section>

      <section className="admin-card admin-list-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">DANH SÁCH</p>
            <h2>Sản phẩm <span className="admin-count">{products.length}</span></h2>
          </div>
          <button className="admin-text-button" onClick={() => void load()} type="button">Tải lại</button>
        </div>
        {loading ? <p className="admin-help-text">Đang tải sản phẩm…</p> : products.length === 0 ? (
          <p className="admin-help-text">Chưa có sản phẩm.</p>
        ) : (
          <div className="admin-record-list">
            {products.map((product) => (
              <article className="admin-record" key={product.id}>
                {product.images[0] ? <Image className="admin-record-image" src={product.images[0]} alt="" width={76} height={76} /> : <div className="admin-record-image admin-record-image-empty">MB</div>}
                <div className="admin-record-main">
                  <div className="admin-record-title-row">
                    <h3>{product.name}</h3>
                    <span className={product.isActive ? "admin-status active" : "admin-status"}>{product.isActive ? "Đang hiển thị" : "Đã ẩn"}</span>
                  </div>
                  <p>{product.brandName} · {product.categoryName}</p>
                  <span className="admin-record-slug">/{product.slug}</span>
                </div>
                <div className="admin-record-actions">
                  <button className="admin-button admin-button-outline" onClick={() => beginEdit(product)} type="button">Sửa</button>
                  <button className="admin-button admin-button-danger" onClick={() => void handleDelete(product)} type="button">Xóa</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
