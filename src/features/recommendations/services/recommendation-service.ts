import { api } from "@/services/api";
import type { FilterParams } from "@/types";

// TODO: Backend — GET /api/recommendations (returns ranked job list with match scores)
export const getRecommendations = (filters?: FilterParams, profileId?: string | null) =>
  api.get("/api/recommendations", { params: { ...filters, profileId } });

// TODO: Backend — GET /api/recommendations/:id (single job detail)
export const getRecommendationById = (id: string) =>
  api.get(`/api/recommendations/${id}`);

// GET /api/skills/missing (returns skill gap analysis)
export const getSkillGaps = (jobId?: string, profileId?: string | null) =>
  api.get("/api/skills/missing", { params: { jobId, profileId } });
