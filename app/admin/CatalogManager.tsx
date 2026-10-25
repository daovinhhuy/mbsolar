"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type BrandItem = {
  id: string;
  name: string;
  isActive: boolean;
  productCount: number;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  filterKey: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  childCount: number;
};

type CategoryParent = { id: string; name: string; parentId: string | null };
type CatalogResource = "brands" | "categories";
type CatalogItem = BrandItem | CategoryItem;
type CatalogDraft = {
  name: string;
  slug: string;
  parentId: string;
  filterKey: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyDraft: CatalogDraft = {
  name: "",
  slug: "",
  parentId: "",
  filterKey: "",
  description: "",
  sortOrder: "0",
  isActive: true,
};

type CatalogLoadResult = {
  items?: CatalogItem[];
  parents?: CategoryParent[];
  error?: string;
};

async function fetchAdminCatalog(resource: CatalogResource, title: string) {
  const response = await fetch(`/api/admin/catalog/${resource}`, { cache: "no-store" });
  const result = (await response.json()) as CatalogLoadResult;
  if (!response.ok) throw new Error(result.error ?? `Không thể tải ${title.toLowerCase()}.`);
  return result;
}

function slugify(value: string) {
  return value
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDescendantIds(categories: CategoryParent[], id: string) {
  const result = new Set([id]);
  let added = true;
  while (added) {
    added = false;
    for (const category of categories) {
      if (category.parentId && result.has(category.parentId) && !result.has(category.id)) {
        result.add(category.id);
        added = true;
      }
    }
  }
  return result;
}

export default function CatalogManager({
  resource,
  title,
}: {
  resource: CatalogResource;
  title: string;
}) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [parents, setParents] = useState<CategoryParent[]>([]);
  const [draft, setDraft] = useState<CatalogDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const applyLoadResult = useCallback((result: CatalogLoadResult) => {
    setItems(result.items ?? []);
    setParents(result.parents ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      applyLoadResult(await fetchAdminCatalog(resource, title));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : `Không thể tải ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [applyLoadResult, resource, title]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminCatalog(resource, title)
      .then((result) => {
        if (!cancelled) applyLoadResult(result);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : `Không thể tải ${title.toLowerCase()}.`);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applyLoadResult, resource, title]);

  const brands = resource === "brands" ? (items as BrandItem[]) : [];
  const categories = resource === "categories" ? (items as CategoryItem[]) : [];

  function resetForm() {
    setEditingId(null);
    setSlugManuallyEdited(false);
    setDraft(emptyDraft);
    setError("");
    setNotice("");
  }

  function beginEdit(item: CatalogItem) {
    setEditingId(item.id);
    setError("");
    setNotice("");
    if (resource === "brands") {
      const brand = item as BrandItem;
      setDraft({ ...emptyDraft, name: brand.name, isActive: brand.isActive });
      setSlugManuallyEdited(false);
    } else {
      const category = item as CategoryItem;
      setDraft({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId ?? "",
        filterKey: category.filterKey ?? "",
        description: category.description ?? "",
        sortOrder: String(category.sortOrder),
        isActive: category.isActive,
      });
      setSlugManuallyEdited(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const body = resource === "brands"
      ? { name: draft.name, isActive: draft.isActive }
      : {
          name: draft.name,
          slug: draft.slug,
          parentId: draft.parentId || null,
          filterKey: draft.filterKey,
          description: draft.description,
          sortOrder: Number(draft.sortOrder),
          isActive: draft.isActive,
        };

    try {
      const response = await fetch(
        editingId
          ? `/api/admin/catalog/${resource}/${editingId}`
          : `/api/admin/catalog/${resource}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? `Không thể lưu ${title.toLowerCase()}.`);

      const wasEditing = Boolean(editingId);
      resetForm();
      setNotice(wasEditing ? `Đã cập nhật ${title.toLowerCase()}.` : `Đã tạo ${title.toLowerCase()}.`);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : `Không thể lưu ${title.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: CatalogItem) {
    const prompt = resource === "brands"
      ? `Xóa thương hiệu “${item.name}”?`
      : `Xóa danh mục “${item.name}”?`;
    if (!window.confirm(prompt)) return;

    setDeletingId(item.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/catalog/${resource}/${item.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? `Không thể xóa ${title.toLowerCase()}.`);
      if (editingId === item.id) resetForm();
      setNotice(`Đã xóa ${title.toLowerCase()}.`);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : `Không thể xóa ${title.toLowerCase()}.`);
    } finally {
      setDeletingId(null);
    }
  }

  const excludedParents = editingId ? getDescendantIds(parents, editingId) : new Set<string>();

  return (
    <div className="admin-manager-grid admin-manager-grid-content">
      <section className="admin-card admin-editor-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">{resource === "brands" ? "THƯƠNG HIỆU" : "DANH MỤC"}</p>
            <h2>{editingId ? `Chỉnh sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}</h2>
          </div>
          {editingId && (
            <button className="admin-text-button" onClick={resetForm} type="button">
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        {error && <p className="admin-alert" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}

        <form className="admin-form" onSubmit={handleSave}>
          <label>
            Tên {resource === "brands" ? "thương hiệu" : "danh mục"}
            <input
              required
              maxLength={200}
              value={draft.name}
              onChange={(event) => {
                const name = event.target.value;
                setDraft((current) => ({
                  ...current,
                  name,
                  ...(resource === "categories" && !slugManuallyEdited
                    ? { slug: slugify(name) }
                    : {}),
                }));
              }}
            />
          </label>

          {resource === "categories" && (
            <>
              <div className="admin-form-grid">
                <label>
                  Đường dẫn (slug)
                  <input
                    required
                    maxLength={180}
                    placeholder="ten-danh-muc"
                    value={draft.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      setDraft({ ...draft, slug: event.target.value });
                    }}
                  />
                </label>
                <label>
                  Danh mục cha
                  <select
                    value={draft.parentId}
                    onChange={(event) => setDraft({ ...draft, parentId: event.target.value })}
                  >
                    <option value="">Không có</option>
                    {parents
                      .filter((parent) => !excludedParents.has(parent.id))
                      .map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.parentId ? "↳ " : ""}{parent.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Khóa lọc catalog
                  <input maxLength={160} value={draft.filterKey} onChange={(event) => setDraft({ ...draft, filterKey: event.target.value })} />
                </label>
              </div>
              <label>
                Mô tả
                <textarea rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
              </label>
            </>
          )}

          <div className="admin-checkbox-row">
            <label className="admin-checkbox">
              <input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} />
              Đang hoạt động
            </label>
          </div>

          {resource === "brands" && (
            <p className="admin-help-text">Thương hiệu đang được sản phẩm hoặc hồ sơ đối tác sử dụng không thể xóa; bạn có thể ngừng kích hoạt.</p>
          )}
          {resource === "categories" && (
            <p className="admin-help-text">Danh mục có sản phẩm hoặc danh mục con cần được chuyển trước khi xóa.</p>
          )}

          <div className="admin-form-actions">
            <button className="admin-button admin-button-primary" disabled={saving}>
              {saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : `Tạo ${title.toLowerCase()}`}
            </button>
            <button className="admin-button admin-button-outline" onClick={resetForm} type="button">
              Làm mới
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card admin-list-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">DANH SÁCH</p>
            <h2>{title} <span className="admin-count">{items.length}</span></h2>
          </div>
          <button className="admin-text-button" onClick={() => void load()} type="button">Tải lại</button>
        </div>

        {loading ? <p className="admin-help-text">Đang tải {title.toLowerCase()}…</p> : items.length === 0 ? (
          <p className="admin-help-text">Chưa có {title.toLowerCase()}.</p>
        ) : resource === "brands" ? (
          <div className="admin-record-list">
            {brands.map((brand) => (
              <article className="admin-record" key={brand.id}>
                <div className="admin-record-main">
                  <div className="admin-record-title-row">
                    <h3>{brand.name}</h3>
                    <span className={brand.isActive ? "admin-status active" : "admin-status"}>
                      {brand.isActive ? "Đang hoạt động" : "Đã ẩn"}
                    </span>
                  </div>
                  <p>{brand.productCount} sản phẩm</p>
                </div>
                <div className="admin-record-actions">
                  <button className="admin-button admin-button-outline" onClick={() => beginEdit(brand)} type="button">Sửa</button>
                  <button className="admin-button admin-button-danger" disabled={deletingId === brand.id} onClick={() => void handleDelete(brand)} type="button">Xóa</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-record-list">
            {categories.map((category) => (
              <article className="admin-record" key={category.id}>
                <div className="admin-record-main">
                  <div className="admin-record-title-row">
                    <h3>{category.parentName ? `${category.parentName} / ` : ""}{category.name}</h3>
                    <span className={category.isActive ? "admin-status active" : "admin-status"}>
                      {category.isActive ? "Đang hoạt động" : "Đã ẩn"}
                    </span>
                  </div>
                  <p>{category.productCount} sản phẩm · {category.childCount} danh mục con{category.filterKey ? ` · ${category.filterKey}` : ""}</p>
                  <span className="admin-record-slug">/{category.slug}</span>
                </div>
                <div className="admin-record-actions">
                  <button className="admin-button admin-button-outline" onClick={() => beginEdit(category)} type="button">Sửa</button>
                  <button className="admin-button admin-button-danger" disabled={deletingId === category.id} onClick={() => void handleDelete(category)} type="button">Xóa</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
