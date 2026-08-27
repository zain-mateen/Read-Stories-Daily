import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">
) {
  const params = await props.searchParams;
  const raw = params.next;
  const next = typeof raw === "string" && raw.startsWith("/admin") ? raw : "/admin/posts";

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-charcoal-700/10 bg-beige-100/60 p-8">
        <h1 className="font-display text-xl font-semibold text-charcoal-800">
          Read Stories Daily <span className="text-rust-600">Admin</span>
        </h1>
        <p className="mt-1 mb-6 text-sm text-charcoal-400">
          Sign in to manage blog posts.
        </p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
