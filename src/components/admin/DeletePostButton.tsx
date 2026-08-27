"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react";

export default function DeletePostButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      window.alert(data?.error ?? "Failed to delete post.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Delete ${title}`}
      className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-charcoal-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60"
    >
      <Trash size={15} />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
