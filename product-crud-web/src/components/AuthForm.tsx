"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/authApi";

type Props = { mode: "login" | "register" };

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!isLogin && password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await loginUser(email, password);
        router.push("/dashboard");
      } else {
        await registerUser(email, password);
        setSuccess("Account created! Redirecting to login...");
        window.setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="auth-subtitle">
          {isLogin ? "Sign in to manage your products" : "Sign up to get started"}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"}
          required placeholder="At least 6 characters" value={password}
          onChange={(e) => setPassword(e.target.value)} />

        {!isLogin && (
          <>
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" autoComplete="new-password" required
              placeholder="Repeat your password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} />
          </>
        )}

        <button className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
        </button>

        <p className="auth-footer">
          {isLogin ? "No account yet? " : "Already have an account? "}
          <Link href={isLogin ? "/register" : "/login"}>
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </form>
    </div>
  );
}
