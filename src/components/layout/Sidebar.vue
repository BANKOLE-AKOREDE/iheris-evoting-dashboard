<template>
  <aside class="h-screen w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 flex">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-xs font-medium text-slate-500">E-Voting Dashboard</div>
        <div class="text-lg font-semibold text-slate-900">IHERIS</div>
      </div>

      <div class="flex items-center gap-2">
        <span class="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">Vue</span>
        <button
          v-if="mobile"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>

    <div class="mt-6">
      <div class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</div>
      <nav class="mt-3 flex flex-col gap-1">
        <RouterLink class="nav" to="/app/overview" @click="mobile && $emit('close')">Overview</RouterLink>
        <RouterLink class="nav" to="/app/elections" @click="mobile && $emit('close')">Elections</RouterLink>
        <RouterLink class="nav" to="/app/audit-logs" @click="mobile && $emit('close')">Audit Logs</RouterLink>
        <RouterLink class="nav" to="/app/settings" @click="mobile && $emit('close')">Settings</RouterLink>
      </nav>
    </div>

    <div class="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div class="text-sm font-semibold text-slate-900">{{ auth.user?.name }}</div>
      <div class="mt-1 text-xs text-slate-600">Role: {{ auth.user?.role }}</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
defineProps<{ mobile?: boolean }>();
defineEmits<{ (e: "close"): void }>();
const auth = useAuthStore();
</script>

<style scoped>
.nav {
  @apply block rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition;
}
.router-link-active {
  @apply bg-slate-900 text-white hover:bg-slate-900;
}
</style>