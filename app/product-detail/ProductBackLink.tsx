"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductBackLink() {
  const router = useRouter();

  return (
    <Link
      href="/#products"
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/#products");
        }
      }}
    >
      ← Quay lại danh sách sản phẩm
    </Link>
  );
}
