<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Desktop sidebar -->
    <Sidebar class="hidden md:flex" />

    <!-- Main -->
    <div class="flex flex-col flex-1 min-w-0">
      <Topbar :title="pageTitle" :subtitle="pageSubtitle" @toggleMobileNav="mobileNav = true" />

      <main class="flex-1 overflow-auto p-6">
        <!-- Keeps it wide enough to feel like a dashboard -->
        <div class="mx-auto w-full max-w-7xl">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Mobile sidebar drawer -->
    <div v-if="mobileNav" class="fixed inset-0 z-50 md:hidden">
      <div class="absolute inset-0 bg-black/40" @click="mobileNav = false"></div>
      <div class="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
        <Sidebar mobile @close="mobileNav = false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const mobileNav = ref(false);
const route = useRoute();

const pageTitle = computed(() => {
  const name = String(route.name ?? "");
  const map: Record<string, string> = {
    overview: "Overview",
    elections: "Elections",
    "election-details": "Election Details",
    candidates: "Candidates",
    voters: "Voters",
    "live-results": "Live Results",
    "audit-logs": "Audit Logs",
    settings: "Settings",
  };
  return map[name] ?? "Dashboard";
});

const pageSubtitle = computed(() => route.fullPath);
</script>