import axios from "axios";

// Central Axios instance for all API calls
// withCredentials: true is REQUIRED for Better Auth httpOnly session cookies
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true, // Required for Better Auth session cookies
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — Better Auth uses httpOnly cookies, no manual token injection needed
api.interceptors.request.use((config) => {
  return config;
});

// Response interceptor — catch 401 globally and redirect to /auth
// (but not for auth endpoints like sign-in/sign-up where 401 = wrong credentials)
api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      "config" in error
    ) {
      const status = (error as { response?: { status?: number } }).response?.status;
      const url = (error as { config?: { url?: string } }).config?.url || "";
      const isAuthEndpoint = url.includes("/sign-in/") || url.includes("/sign-up/") || url.includes("/sign-out");

      if (status === 401 && !isAuthEndpoint) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);
