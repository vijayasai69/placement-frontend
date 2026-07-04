// ⚠️ DO NOT store API/server data here.
// Use TanStack Query for all server state (profiles, jobs, resume, dashboard, etc.)
// This store holds ONLY auth identity: who is logged in.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { useActiveProfile } from "@/store/useActiveProfile";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  customAvatars: Record<string, string>;
  setUser: (user: User) => void;
  clearUser: () => void;
  setCustomAvatar: (avatar: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      customAvatars: {},
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => {
        useActiveProfile.getState().setActiveProfileId(null);
        set({ user: null, isAuthenticated: false });
      },
      setCustomAvatar: (avatar) => set((state) => {
        if (!state.user) return state;
        const newAvatars = { ...state.customAvatars };
        if (avatar) {
          newAvatars[state.user.id] = avatar;
        } else {
          delete newAvatars[state.user.id];
        }
        return { customAvatars: newAvatars };
      }),
    }),
    { name: "placeai-auth" }
  )
);
