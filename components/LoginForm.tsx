"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Music2 } from "lucide-react";
import { toast } from "sonner";
import { ThemeSelector } from "@/components/ThemeSelector";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (signInError) {
        setError(signInError.message);
        toast.error("Couldn't log in. Check your email and password.");
        return;
      }
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      toast.error("Couldn't create your account.");
      return;
    }

    if (data.session) {
      toast.success("Account created. Let's track some shows!");
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMessage(
      "Account created! Check your email if confirmation is required, then log in.",
    );
    toast.message("Check your email to finish signing up.");
    setMode("login");
  }

  return (
    <div className="card w-full max-w-md border border-base-content/10 bg-base-100/90 shadow-xl backdrop-blur">
      <div className="card-body gap-3">
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Music2 className="size-5" />
            <span className="text-sm font-medium">Welcome</span>
          </div>
          <ThemeSelector compact />
        </div>

        <h2 className="font-display text-2xl font-bold">
          {mode === "login" ? "Log in" : "Create an account"}
        </h2>
        <p className="text-sm text-base-content/70">
          {mode === "login"
            ? "Jump back in and see how your shows stack up."
            : "Start tracking concerts, costs, and fun scores."}
        </p>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-3">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-3">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                className="input input-bordered w-full pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm absolute top-1/2 right-1 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          ) : null}
          {message ? (
            <div className="alert alert-info text-sm">
              <span>{message}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : null}
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-1 text-center text-sm text-base-content/70">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setMessage(null);
                }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
