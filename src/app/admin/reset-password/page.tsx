"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, KeyRound, ShieldAlert, Check, X } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isStrong = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !email) {
      setError("Missing reset token or email address. Please click the complete link provided in your email.");
      return;
    }

    if (!hasMinLength) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (!hasLetter || !hasNumber) {
      setError("Password must contain both letters and numbers for academic account security.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          token: token.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/login?email=${encodeURIComponent(email.trim())}&reset=success`);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-6 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Password Updated!</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your administrator password has been updated and the reset token has been invalidated. Redirecting to login...
          </p>
        </div>
        <Link
          href={`/admin/login?email=${encodeURIComponent(email)}&reset=success`}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
        >
          <span>Sign In Immediately</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // If URL has no token or email, show helpful warning
  if (!token || !email) {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Direct Access Prohibited</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            For security, password reset forms cannot be accessed directly. Please click the single-use reset link received in your email inbox.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/forgot-password"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-xs"
          >
            <span>Request a Password Reset Email</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="border-t border-slate-800 pt-3 text-xs">
          <Link href="/admin/login" className="text-slate-400 hover:text-white">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white mx-auto shadow-md">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Choose New Password
        </h1>
        <p className="text-xs text-slate-400">
          Resetting credentials for: <strong className="text-emerald-400">{email}</strong>
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block font-semibold uppercase tracking-wider text-slate-400">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password Strength Checklist */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-[11px]">
          <span className="font-semibold text-slate-400 block">Password Requirements:</span>
          <div className="grid grid-cols-2 gap-1 text-slate-400">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400 font-medium" : "text-slate-500"}`}>
              {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5" />}
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasLetter && hasNumber ? "text-emerald-400 font-medium" : "text-slate-500"}`}>
              {hasLetter && hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5" />}
              <span>Letters and numbers</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-semibold uppercase tracking-wider text-slate-400">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isStrong}
          className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Save & Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        <Link href="/admin/login" className="text-emerald-400 hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-slate-100">
      <Suspense
        fallback={
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span>Verifying reset session...</span>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
