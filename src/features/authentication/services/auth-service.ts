import { api } from "@/services/api";
import type { LoginInput } from "../schemas/login-schema";
import type { RegisterInput } from "../schemas/register-schema";

/**
 * POST /api/auth/sign-in/email — Better Auth built-in email sign-in.
 * This endpoint sets the session cookie with the HMAC signature that
 * Better Auth requires for session validation.
 */
export const login = async (data: LoginInput) => {
  const response = await api.post("/api/auth/sign-in/email", {
    email: data.email,
    password: data.password,
  });
  // Better Auth returns { user, token, redirect } directly
  return {
    ...response,
    data: response.data || null,
  };
};

/**
 * POST /api/auth/sign-up/email — Better Auth built-in email sign-up.
 * This endpoint sets the session cookie with the HMAC signature that
 * Better Auth requires for session validation.
 */
export const register = async (data: Omit<RegisterInput, "confirmPassword">) => {
  const response = await api.post("/api/auth/sign-up/email", {
    email: data.email,
    password: data.password,
    name: data.name,
  });
  // Better Auth returns { user, token, redirect } directly
  return {
    ...response,
    data: response.data || null,
  };
};

/** POST /api/auth/sign-out — Invalidates the current session via Better Auth */
export const logout = () => api.post("/api/auth/sign-out");

/**
 * GET /api/auth/get-session — Better Auth built-in session check.
 * Returns { session, user } when authenticated, or null when not.
 */
export const getSession = async () => {
  const response = await api.get("/api/auth/get-session");
  // Better Auth returns { session, user } directly (not wrapped in data.data)
  return {
    ...response,
    data: response.data || null,
  };
};

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined
});

/** Google Sign In — uses official Better Auth client to handle redirect */
export const loginWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  } catch (error) {
    console.error("Google sign in failed:", error);
  }
};

export const forgotPassword = async (email: string) => {
  return await api.post("/api/auth/forgot-password", { email });
};

export const verifyOtp = async (email: string, code: string) => {
  return await api.post("/api/auth/verify-otp", { email, code });
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  return await api.post("/api/auth/reset-password", { email, code, newPassword });
};
