import { api } from "@/services/api";
import type { ProfileUpdateInput } from "@/types";

// GET /api/profile
export const getProfile = () => api.get("/api/profile");

// PUT /api/profile
export const updateProfile = (data: ProfileUpdateInput) =>
  api.put("/api/profile", data);
