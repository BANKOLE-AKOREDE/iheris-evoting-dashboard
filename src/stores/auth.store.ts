import { defineStore } from "pinia";
import type { Role } from "@/types/models";

type User = { id: string; name: string; role: Role };

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "" as string,
    user: null as User | null,
  }),
  getters: {
    isAuthed: (s) => !!s.token,
    role: (s) => s.user?.role ?? null,
  },
  actions: {
    loginMock(payload: { name: string; role: Role }) {
      // mock token
      this.token = `mock_${Math.random().toString(36).slice(2)}`;
      this.user = { id: crypto.randomUUID(), name: payload.name, role: payload.role };
    },
    logout() {
      this.token = "";
      this.user = null;
    },
  },
  persist: true,
});