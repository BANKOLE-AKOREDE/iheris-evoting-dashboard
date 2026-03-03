import { createRouter, createWebHistory } from "vue-router";
import { requireAuth, requireRole } from "./guards";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/auth/login" },

    { path: "/auth/login", name: "login", component: () => import("../pages/auth/Login.vue") },

    {
      path: "/app",
      component: () => import("../components/layout/AppShell.vue"),
      beforeEnter: requireAuth,
      children: [
        { path: "", redirect: "/app/overview" },
        { path: "overview", name: "overview", component: () => import("../pages/app/Overview.vue") },

        { path: "elections", name: "elections", component: () => import("../pages/app/ElectionsList.vue") },

        // ✅ NEW: Create Election
        { path: "elections/new", name: "election-create", component: () => import("@/pages/app/CreateElection.vue") },

        { path: "elections/:id", name: "election-details", component: () => import("../pages/app/ElectionDetails.vue") },
        { path: "elections/:id/candidates", name: "candidates", component: () => import("../pages/app/Candidates.vue") },
        { path: "elections/:id/voters", name: "voters", component: () => import("../pages/app/Voters.vue") },
        { path: "elections/:id/results-live", name: "live-results", component: () => import("../pages/app/LiveResults.vue") },

        {
          path: "audit-logs",
          name: "audit-logs",
          component: () => import("../pages/app/AuditLogs.vue"),
          beforeEnter: requireRole(["SUPER_ADMIN", "AUDITOR"]),
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../pages/app/Settings.vue"),
          beforeEnter: requireRole(["SUPER_ADMIN"]),
        },
      ],
    },

    { path: "/:pathMatch(.*)*", redirect: "/app/overview" },
  ],
});