import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type { Role } from "@/types/models";

export function requireAuth(_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) {
  const auth = useAuthStore();
  if (!auth.isAuthed) return next({ name: "login" });
  next();
}

export function requireRole(roles: Role[]) {
  return (_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) => {
    const auth = useAuthStore();
    if (!auth.isAuthed) return next({ name: "login" });
    if (!auth.role || !roles.includes(auth.role)) return next({ name: "overview" });
    next();
  };
}