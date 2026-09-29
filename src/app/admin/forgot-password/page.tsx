"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dispatched, setDispatched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid administrator email address.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch reset email.");
      }

      setDispatched(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while dispatching the reset email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-slate-100">
      {/* Return to Login */}
      <div className="absolute top-6 left-6">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6 bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white mx-auto shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reset Admin Password
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your registered administrator email address. We will send a secure, one-time reset link directly to your inbox.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Dispatched State: Instructions to check email */}
        {dispatched ? (
          <div className="p-6 bg-emerald-950/30 border border-emerald-800/80 rounded-xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Check Your Email Inbox</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A secure password reset link has been dispatched to your email address.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Security Instructions:</span>
              </div>
              <p>• Open your email inbox and click the verified reset link.</p>
              <p>• The link is valid for <strong>15 minutes</strong> and can only be used once.</p>
              <p>• If you do not see it within a few moments, check your spam or junk folder.</p>
            </div>

            <Link
              href="/admin/login"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors text-xs"
            >
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          /* Email Input Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold uppercase tracking-wider text-slate-400">
                Registered Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@iiti.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                The password reset link will only be delivered to this verified email address.
              </p>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Remembered your credentials?{" "}
          <Link href="/admin/login" className="text-emerald-400 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
