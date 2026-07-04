import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveProfileState {
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
}

export const useActiveProfile = create<ActiveProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      setActiveProfileId: (id) => set({ activeProfileId: id }),
    }),
    {
      name: "active-profile-storage",
    }
  )
);
