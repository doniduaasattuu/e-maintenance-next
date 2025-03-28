// store/useAuthStore.ts
import { create } from "zustand";
import { SessionUser } from "@/types/user";

type AuthState = {
  user: SessionUser | undefined;
  setUser: (user: SessionUser | undefined) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
