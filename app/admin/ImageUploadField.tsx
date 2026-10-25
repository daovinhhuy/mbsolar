"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  timestamp: string;
  folder: string;
  signature: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export type ImageUploadFieldHandle = {
  uploadSelectedFiles: () => Promise<string[]>;
};

type ImageUploadFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  helpText: string;
  onChange: (value: string) => void;
  onUploadingChange: (uploading: boolean) => void;
};

const ImageUploadField = forwardRef<ImageUploadFieldHandle, ImageUploadFieldProps>(
  function ImageUploadField({ label, value, placeholder, helpText, onChange, onUploadingChange }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const uploadSelectedFiles = useCallback(async () => {
      if (files.length === 0) return [];

      const sources = value.split(/\r?\n/).map((source) => source.trim()).filter(Boolean);
      if (sources.length + files.length > MAX_IMAGES) {
        const message = `Mỗi mục chỉ được có tối đa ${MAX_IMAGES} ảnh.`;
        setError(message);
        throw new Error(message);
      }

      const invalidFile = files.find((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE);
      if (invalidFile) {
        const message = !ALLOWED_TYPES.has(invalidFile.type)
          ? `Định dạng ảnh không được hỗ trợ: ${invalidFile.name}. Hãy chọn JPG, PNG, WebP, AVIF hoặc GIF.`
          : `Ảnh ${invalidFile.name} vượt quá giới hạn 10 MB.`;
        setError(message);
        throw new Error(message);
      }

      setUploading(true);
      onUploadingChange(true);
      setError("");
      setNotice("");
      const selectedFiles = files;
      const uploadedUrls: string[] = [];
      let completed = 0;

      try {
        const signatureResponse = await fetch("/api/admin/images/signature", {
          method: "POST",
          cache: "no-store",
        });
        const signature = (await signatureResponse.json()) as CloudinarySignature & { error?: string };
        if (!signatureResponse.ok) {
          throw new Error(signature.error ?? "Không thể khởi tạo tải ảnh lên Cloudinary.");
        }

        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.set("file", file);
          formData.set("api_key", signature.apiKey);
          formData.set("timestamp", signature.timestamp);
          formData.set("folder", signature.folder);
          formData.set("signature", signature.signature);

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
            { method: "POST", body: formData },
          );
          const uploadResult = (await cloudinaryResponse.json()) as CloudinaryUploadResponse;
          if (!cloudinaryResponse.ok || !uploadResult.secure_url) {
            throw new Error(uploadResult.error?.message ?? `Cloudinary không tải được ảnh ${file.name}.`);
          }

          const uploadedUrl = new URL(uploadResult.secure_url);
          if (uploadedUrl.protocol !== "https:" || uploadedUrl.hostname !== "res.cloudinary.com") {
            throw new Error("Cloudinary trả về đường dẫn ảnh không hợp lệ.");
          }

          sources.push(uploadedUrl.href);
          uploadedUrls.push(uploadedUrl.href);
          completed += 1;
          onChange(sources.join("\n"));
          setFiles(selectedFiles.slice(completed));
        }

        setNotice(`Đã tải ${uploadedUrls.length} ảnh lên Cloudinary. Nhấn lưu để ghi đường dẫn vào database.`);
        setFiles([]);
        if (inputRef.current) inputRef.current.value = "";
        return uploadedUrls;
      } catch (uploadError) {
        setFiles(selectedFiles.slice(completed));
        if (inputRef.current) inputRef.current.value = "";
        const message = uploadError instanceof Error ? uploadError.message : "Không thể tải ảnh lên Cloudinary.";
        setError(message);
        throw new Error(message);
      } finally {
        setUploading(false);
        onUploadingChange(false);
      }
    }, [files, onChange, onUploadingChange, value]);

    useImperativeHandle(ref, () => ({ uploadSelectedFiles }), [uploadSelectedFiles]);

    return (
      <div className="admin-image-field">
        <span className="admin-image-field-label">{label}</span>
        <input
          ref={inputRef}
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="admin-file-input-hidden"
          multiple
          onChange={(event) => {
            setFiles(Array.from(event.target.files ?? []));
            setError("");
            setNotice("");
          }}
          type="file"
        />
        <div className="admin-upload-actions">
          <button
            className="admin-button admin-button-outline"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            Chọn ảnh
          </button>
          {files.length > 0 && (
            <span className="admin-help-text">Đã chọn {files.length} ảnh</span>
          )}
          {uploading && (
            <span className="admin-help-text" role="status">Đang tải ảnh lên Cloudinary…</span>
          )}
        </div>
        {error && <p className="admin-alert" role="alert">{error}</p>}
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        <textarea
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="admin-help-text">{helpText}</span>
      </div>
    );
  },
);

export default ImageUploadField;
