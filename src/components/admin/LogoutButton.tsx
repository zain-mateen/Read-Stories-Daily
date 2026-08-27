"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="cursor-pointer text-charcoal-500 transition-colors hover:text-rust-600 disabled:cursor-wait disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
