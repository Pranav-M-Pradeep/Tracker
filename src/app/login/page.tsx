"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import styles from "./page.module.css";
import { motion, AnimatePresence } from "framer-motion";

// Map NextAuth error codes to friendly messages
const AUTH_ERRORS: Record<string, string> = {
  Configuration: "Server configuration error. Please contact support.",
  AccessDenied: "Access denied.",
  Verification: "The verification link is invalid or has expired.",
  OAuthSignin: "Error connecting to the sign-in service.",
  OAuthCallback: "Error during authentication callback.",
  OAuthCreateAccount: "Could not create account.",
  EmailCreateAccount: "Could not create account with this email.",
  Callback: "Authentication error.",
  OAuthAccountNotLinked: "This email is already linked to another account.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An error occurred. Please try again.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Read NextAuth error from URL query param (?error=Configuration etc.)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(AUTH_ERRORS[urlError] || AUTH_ERRORS.Default);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("Invalid email or password.");
        } else if (res?.ok) {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to register");
        } else {
          const signInRes = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          if (signInRes?.ok) {
            router.push("/dashboard");
            router.refresh();
          } else {
            setError("Account created! Please sign in.");
            setIsLogin(true);
          }
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.authCard}
    >
      <div className={styles.header}>
        <h1 className="text-gradient">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className={styles.subtitle}>
          {isLogin
            ? "Log in to access your planner and expenses."
            : "Sign up for a secure tracker."}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.error}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.inputGroup}
            >
              <UserIcon className={styles.inputIcon} size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: "2.5rem" }}
                required={!isLogin}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.inputGroup}>
          <Mail className={styles.inputIcon} size={18} />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            style={{ paddingLeft: "2.5rem" }}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <Lock className={styles.inputIcon} size={18} />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field"
            style={{ paddingLeft: "2.5rem" }}
            required
            minLength={8}
          />
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <p className={styles.toggleText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
          className={styles.toggleBtn}
          type="button"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
