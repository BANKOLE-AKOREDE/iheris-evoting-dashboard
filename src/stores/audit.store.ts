import { defineStore } from "pinia";
import type { AuditLog } from "@/types/models";

export const useAuditStore = defineStore("audit", {
  state: () => ({
    logs: [] as AuditLog[],
  }),
  getters: {
    latest: (s) => s.logs.slice(0, 20),
  },
  actions: {
    add(actor: string, action: string, meta?: string) {
      this.logs.unshift({
        id: crypto.randomUUID(),
        ts: new Date().toISOString(),
        actor,
        action,
        meta,
      });
    },
    clear() {
      this.logs = [];
    },
  },
  persist: true,
});