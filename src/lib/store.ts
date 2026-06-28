// Slim UI-only store. All persistent data lives in Supabase; only ephemeral session
// derived from auth + last-known role are kept here.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "donor" | "volunteer" | "mentor" | "institution" | "admin";

export type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string;
  avatar?: string;
} | null;

type State = {
  session: Session;
  signOut: () => void;
  syncSession: (s: Session) => void;
};

export const useStore = create<State>()(
  persist(
    (set) => ({
      session: null,
      signOut: () => set({ session: null }),
      syncSession: (s) => set({ session: s }),
    }),
    { name: "carebridge-store", version: 2 },
  ),
);

export function useSession() {
  return useStore((s) => s.session);
}
