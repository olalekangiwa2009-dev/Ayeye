"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(153,144,124,0.4)",
  padding: "0.75rem 0",
  color: "#e5e2e1",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.3s",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const result = await signIn("credentials", {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) { setError("Invalid email or password"); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="p-8 border" style={{ borderColor: "rgba(77,70,53,0.5)", background: "#1c1b1b" }}>
      <div className="mb-8">
        <span className="label-caps block mb-2" style={{ color: "#f2ca50" }}>Welcome Back</span>
        <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", fontWeight: 400, color: "#e5e2e1" }}>
          Sign In
        </h1>
      </div>

      {registered && (
        <div className="mb-6 p-4 border-l-2" style={{ borderColor: "#f2ca50", background: "rgba(242,202,80,0.05)" }}>
          <p className="label-caps" style={{ color: "#f2ca50", fontSize: "10px" }}>Account created — please sign in.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Email Address</label>
          <input name="email" type="email" required style={fieldStyle} />
        </div>
        <div>
          <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Password</label>
          <input name="password" type="password" required style={fieldStyle} />
        </div>

        {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

        <button type="submit" disabled={loading}
          className="label-caps w-full py-4 transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-8 label-caps" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
        No account?{" "}
        <Link href="/register" className="transition-colors" style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50" }}>
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
