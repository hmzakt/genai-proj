"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
      if (waitingForVerification) {
      const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            // Email verified! Get ID token and complete signup
            try {
              const idToken = await user.getIdToken();
              
              // Verify with backend
              const response = await fetch(`${API_BASE_URL}/api/auth/check-verification`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
              });

              const data = await response.json();

              if (data.success && data.emailVerified) {
                setWaitingForVerification(false);
                // Store user data
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("idToken", idToken);
                router.push("/");
              }
            } catch (err) {
              console.error("Verification check error:", err);
            }
          }
        }
      });

      // Poll for email verification every 3 seconds
      const pollInterval = setInterval(async () => {
        const user = auth.currentUser;
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(pollInterval);
            unsubscribe();
            try {
              const idToken = await user.getIdToken(true); // Force refresh
              
              const response = await fetch(`${API_BASE_URL}/api/auth/check-verification`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
              });

              const data = await response.json();

              if (data.success && data.emailVerified) {
                setWaitingForVerification(false);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("idToken", idToken);
                router.push("/");
              }
            } catch (err) {
              console.error("Verification check error:", err);
            }
          }
        }
      }, 3000);

      return () => {
        clearInterval(pollInterval);
        unsubscribe();
      };
    }
  }, [waitingForVerification, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWaitingForVerification(false);

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      setUserEmail(formData.email);
      setWaitingForVerification(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      let errorMessage = "Failed to create account";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already registered";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleCancel = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    setWaitingForVerification(false);
    setUserEmail("");
  };

  if (waitingForVerification) {
    return (
      <div className="w-full rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            We've sent a verification link to
          </p>
          <p className="mt-1 font-medium text-black dark:text-zinc-50">
            {userEmail}
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          <p className="mb-2 font-medium">Please check your email:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Click the verification link in the email</li>
            <li>Come back here after clicking the link</li>
            <li>We'll automatically detect when your email is verified</li>
          </ul>
        </div>

        <div className="mb-4 flex items-center justify-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-75"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 delay-150"></div>
        </div>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Waiting for email verification...
        </p>

        <button
          onClick={handleCancel}
          className="mt-6 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Sign up to get started with HR AI Platform
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black dark:text-zinc-300"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black dark:text-zinc-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            placeholder="At least 6 characters"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-black dark:text-zinc-300"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
        </span>
        <Link
          href="/auth/login"
          className="font-medium text-black hover:underline dark:text-zinc-50"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
