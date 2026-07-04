import { useState, useRef, useEffect } from "react";
import { X, Mail, KeyRound, Lock, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { forgotPassword, verifyOtp, resetPassword } from "../services/auth-service";
import { cn } from "@/lib/utils";

type Step = "email" | "otp" | "password" | "success";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetState = () => {
    setStep("email");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setResendCooldown(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setStep("otp");
      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Input Handling ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter the 6-digit code");
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(email, code);
      if (res.data?.valid === false) {
        setError(res.data.message || "Invalid or expired OTP");
      } else {
        setStep("password");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
    } catch (err: any) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      await resetPassword(email, otp.join(""), newPassword);
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0A0E1A] border border-slate-200 dark:border-white/10 shadow-2xl shadow-[#06B6D4]/10 overflow-hidden animate-fadeIn">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            {step !== "email" && step !== "success" && (
              <button
                onClick={() => {
                  setError("");
                  setStep(step === "otp" ? "email" : "otp");
                }}
                className="text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-display uppercase tracking-widest text-[#06B6D4]">
                {step === "email" && "Step 1 of 3"}
                {step === "otp" && "Step 2 of 3"}
                {step === "password" && "Step 3 of 3"}
                {step === "success" && "Complete"}
              </p>
              <h2 className="text-slate-900 dark:text-white font-display text-lg tracking-tight">
                {step === "email" && "Forgot Password"}
                {step === "otp" && "Verify Code"}
                {step === "password" && "New Password"}
                {step === "success" && "All Done!"}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-8">
          {/* Progress bar */}
          {step !== "success" && (
            <div className="flex gap-1 mb-8">
              {(["email", "otp", "password"] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-0.5 flex-1 transition-all duration-500",
                    (step === "email" && i === 0) ||
                    (step === "otp" && i <= 1) ||
                    (step === "password" && i <= 2)
                      ? "bg-[#06B6D4]"
                      : "bg-slate-200 dark:bg-white/10"
                  )}
                />
              ))}
            </div>
          )}

          {/* ── Email Step ── */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-[#06B6D4]" />
                </div>
                <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
                  Enter your registered email address. We'll send a 6-digit verification code.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field w-full"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-display uppercase tracking-wider">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-gradient w-full"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending Code...</>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* ── OTP Step ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="h-7 w-7 text-[#06B6D4]" />
                </div>
                <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-[#06B6D4] text-sm font-medium mt-1">{email}</p>
              </div>

              {/* OTP Boxes */}
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={cn(
                      "w-12 h-14 text-center text-xl font-bold bg-slate-100 dark:bg-white/5 border text-slate-900 dark:text-white transition-all duration-200",
                      "focus:outline-none focus:border-[#06B6D4] focus:bg-[#06B6D4]/10",
                      digit ? "border-[#06B6D4]/60 bg-[#06B6D4]/5" : "border-slate-300 dark:border-white/20"
                    )}
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-400 font-display uppercase tracking-wider text-center">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary-gradient w-full">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="text-center">
                <span className="text-slate-400 dark:text-white/30 text-xs">Didn't receive the code? </span>
                {resendCooldown > 0 ? (
                  <span className="text-slate-400 dark:text-white/30 text-xs">Resend in {resendCooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-[#06B6D4] text-xs hover:text-slate-900 dark:hover:text-white transition-colors font-display uppercase tracking-wider"
                  >
                    Resend
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ── New Password Step ── */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-[#06B6D4]" />
                </div>
                <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
                  Create a strong new password for your account.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="input-field w-full pr-12"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="input-field w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 font-display uppercase tracking-wider">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary-gradient w-full">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Updating Password...</>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* ── Success Step ── */}
          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-display text-lg mb-2">Password Updated!</h3>
                <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="btn-primary-gradient w-full"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
