import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { registerSchema, type RegisterInput } from "../schemas/register-schema";
import { register as registerApi, loginWithGoogle } from "../services/auth-service";
import { useAuthStore } from "../store/auth-store";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/types";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await registerApi(data);
      return response.data;
    },
    onSuccess: (res) => {
      const user = res.user as UserType;
      if (user) setUser(user);
      void navigate({ to: "/dashboard" });
    },
    onError: (err: any) => {
      console.error("Signup error:", err);
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      setError("email", { message: msg });
    },
  });

  const onSubmit = (data: RegisterInput) => registerMutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="register-form">
      {/* Name */}
      <div>
        <label htmlFor="register-name" className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
          Full Name
        </label>
        <div className="relative">
          <input
            id="register-name"
            type="text"
            placeholder="John Doe"
            className={cn("input-field", errors.name && "border-red-500")}
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-xs text-red-500 font-display uppercase tracking-wider">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="register-email" className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            className={cn("input-field", errors.email && "border-red-500")}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-xs text-red-500 font-display uppercase tracking-wider">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="register-password" className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={cn("input-field pr-12", errors.password && "border-red-500")}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-blue-400 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-xs text-red-500 font-display uppercase tracking-wider">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="register-confirm" className="block text-xs font-display uppercase tracking-widest text-slate-500 dark:text-white/50 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className={cn("input-field pr-12", errors.confirmPassword && "border-red-500")}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-blue-400 transition-colors p-1"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-xs text-red-500 font-display uppercase tracking-wider">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        id="register-submit-btn"
        className="btn-primary-gradient w-full mt-8"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing...
          </>
        ) : (
          "Initialize Profile"
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-4 py-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
        <span className="text-[10px] font-display text-slate-400 dark:text-white/30 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={loginWithGoogle}
        id="google-register-btn"
        className="w-full py-4 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-display uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-purple-500 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
