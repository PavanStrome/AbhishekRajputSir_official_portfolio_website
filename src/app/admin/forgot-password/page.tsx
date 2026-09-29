"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [adminInfo, setAdminInfo] = useState<{ maskedEmail: string; adminName: string } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dispatchedTo, setDispatchedTo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/forgot-password")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.maskedEmail) {
          setAdminInfo({
            maskedEmail: data.maskedEmail,
            adminName: data.adminName || "Administrator",
          });
        }
      })
      .catch((err) => console.error("Failed to load registered admin info:", err))
      .finally(() => setLoadingInfo(false));
  }, []);

  const handleSendReset = async () => {
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Dispatches directly to registered admin email
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch reset email.");
      }

      setDispatchedTo(data.sentTo || adminInfo?.maskedEmail || "your registered email");
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
            A secure, time-limited reset link will be sent directly to your registered administrator email address.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success State: Email Dispatched (Sent strictly to inbox, never shown openly) */}
        {dispatchedTo ? (
          <div className="p-6 bg-emerald-950/30 border border-emerald-800/80 rounded-xl space-y-4 animate-in fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">Reset Link Dispatched!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We have generated a secure password reset link sent directly to your registered email:
              </p>
              <div className="py-1 px-3 bg-slate-950/80 rounded-lg inline-block text-emerald-400 font-mono text-xs font-semibold">
                {dispatchedTo}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg text-[11px] text-slate-400 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next Steps:</span>
              </div>
              <p>• Open your email inbox and click the reset link.</p>
              <p>• The link is valid for <strong>15 minutes</strong> and can only be used once.</p>
              <p>• If you do not see it within a few moments, check your spam folder.</p>
            </div>

            <Link
              href="/admin/login"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors text-xs"
            >
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          /* Direct Dispatch Form */
          <div className="space-y-5">
            {/* Registered Admin Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Registered Faculty Admin</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  Verified
                </span>
              </div>

              {loadingInfo ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  <span>Fetching registered administrator account...</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <strong className="block text-sm font-semibold text-white">
                    {adminInfo?.adminName || "Dr. Abhishek Rajput"}
                  </strong>
                  <p className="text-xs font-mono text-emerald-400">
                    {adminInfo?.maskedEmail || "Registered Administrator Email"}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Click the button below to generate a single-use password reset link and send it directly to the registered email address above.
            </p>

            <button
              type="button"
              onClick={handleSendReset}
              disabled={sending || loadingInfo}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Email...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link to Registered Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
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
