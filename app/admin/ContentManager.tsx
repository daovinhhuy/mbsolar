"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import ImageUploadField, { type ImageUploadFieldHandle } from "./ImageUploadField";

type ContentResource = "solutions" | "construction-projects";
type AdminContent = {
  id: string;
  title: string;
  introduction: string;
  content: string;
  images: string[];
  sortOrder: number;
  isPublished: boolean;
};
type ContentDraft = {
  title: string;
  introduction: string;
  content: string;
  images: string;
  sortOrder: string;
  isPublished: boolean;
};

const emptyDraft: ContentDraft = {
  title: "",
  introduction: "",
  content: "",
  images: "",
  sortOrder: "0",
  isPublished: true,
};

type ContentLoadResult = { items?: AdminContent[]; error?: string };

async function fetchAdminContent(resource: ContentResource, title: string) {
  const response = await fetch(`/api/admin/${resource}`, { cache: "no-store" });
  const result = (await response.json()) as ContentLoadResult;
  if (!response.ok) throw new Error(result.error ?? `Không thể tải ${title.toLowerCase()}.`);
  return result;
}

export default function ContentManager({
  resource,
  title,
}: {
  resource: ContentResource;
  title: string;
}) {
  const [items, setItems] = useState<AdminContent[]>([]);
  const [draft, setDraft] = useState<ContentDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFieldKey, setImageFieldKey] = useState(0);
  const imageUploaderRef = useRef<ImageUploadFieldHandle>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const applyLoadResult = useCallback((result: ContentLoadResult) => {
    setItems(result.items ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      applyLoadResult(await fetchAdminContent(resource, title));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [applyLoadResult, resource, title]);

  useEffect(() => {
    let cancelled = false;
    fetchAdminContent(resource, title)
      .then((result) => {
        if (!cancelled) applyLoadResult(result);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applyLoadResult, resource, title]);

  function resetForm() {
    setEditingId(null);
    setImageFieldKey((current) => current + 1);
    setDraft(emptyDraft);
    setError("");
    setNotice("");
  }

  function beginEdit(item: AdminContent) {
    setEditingId(item.id);
    setImageFieldKey((current) => current + 1);
    setError("");
    setNotice("");
    setDraft({
      title: item.title,
      introduction: item.introduction,
      content: item.content,
      images: item.images.join("\n"),
      sortOrder: String(item.sortOrder),
      isPublished: item.isPublished,
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
        editingId ? `/api/admin/${resource}/${editingId}` : `/api/admin/${resource}`,
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
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu nội dung.");

      resetForm();
      setNotice(editingId ? "Đã cập nhật nội dung." : "Đã tạo nội dung.");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu nội dung.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: AdminContent) {
    if (!window.confirm(`Xóa “${item.title}”?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/${resource}/${item.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Không thể xóa nội dung.");
      if (editingId === item.id) resetForm();
      setNotice("Đã xóa nội dung.");
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa nội dung.");
    }
  }

  return (
    <div className="admin-manager-grid admin-manager-grid-content">
      <section className="admin-card admin-editor-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">{title.toLocaleUpperCase("vi-VN")}</p>
            <h2>{editingId ? `Chỉnh sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}</h2>
          </div>
          {editingId && <button className="admin-text-button" onClick={resetForm} type="button">Hủy chỉnh sửa</button>}
        </div>

        {error && <p className="admin-alert" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        <form className="admin-form" onSubmit={handleSave}>
          <label>
            Tiêu đề
            <input required maxLength={300} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>
            Giới thiệu ngắn
            <textarea required rows={3} value={draft.introduction} onChange={(event) => setDraft({ ...draft, introduction: event.target.value })} />
          </label>
          <label>
            Nội dung chi tiết
            <textarea required rows={8} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} />
            <span className="admin-help-text">Tách các đoạn văn bằng một dòng trống.</span>
          </label>
          <ImageUploadField
            key={imageFieldKey}
            ref={imageUploaderRef}
            label="Ảnh minh họa"
            placeholder="/image/solutions/ten-anh.jpg hoặc URL Cloudinary"
            helpText="Chọn ảnh để tải lên Cloudinary hoặc giữ đường dẫn ảnh cũ. Khi bấm lưu, ảnh đã chọn sẽ được tải lên rồi lưu đường dẫn vào database."
            value={draft.images}
            onChange={(images) => setDraft((current) => ({ ...current, images }))}
            onUploadingChange={setUploadingImage}
          />
          <div className="admin-checkbox-row">
            <label className="admin-checkbox">
              <input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })} />
              Đang xuất bản
            </label>
          </div>
          <div className="admin-form-actions">
            <button className="admin-button admin-button-primary" disabled={saving || uploadingImage}>
              {uploadingImage ? "Đang tải ảnh…" : saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : `Tạo ${title.toLowerCase()}`}
            </button>
            <button className="admin-button admin-button-outline" onClick={resetForm} type="button">Làm mới</button>
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
        {loading ? <p className="admin-help-text">Đang tải dữ liệu…</p> : items.length === 0 ? (
          <p className="admin-help-text">Chưa có nội dung.</p>
        ) : (
          <div className="admin-record-list">
            {items.map((item) => (
              <article className="admin-record" key={item.id}>
                {item.images[0] ? <Image className="admin-record-image" src={item.images[0]} alt="" width={76} height={76} /> : <div className="admin-record-image admin-record-image-empty">MB</div>}
                <div className="admin-record-main">
                  <div className="admin-record-title-row">
                    <h3>{item.title}</h3>
                    <span className={item.isPublished ? "admin-status active" : "admin-status"}>{item.isPublished ? "Đã xuất bản" : "Bản nháp"}</span>
                  </div>
                  <p>{item.introduction}</p>
                  <span className="admin-record-slug">Thứ tự {item.sortOrder} · {item.images.length} ảnh</span>
                </div>
                <div className="admin-record-actions">
                  <button className="admin-button admin-button-outline" onClick={() => beginEdit(item)} type="button">Sửa</button>
                  <button className="admin-button admin-button-danger" onClick={() => void handleDelete(item)} type="button">Xóa</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
