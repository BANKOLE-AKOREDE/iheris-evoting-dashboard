<template>
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <button
          class="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="$emit('toggleMobileNav')"
        >
          Menu
        </button>

        <div>
          <div class="text-base font-semibold text-slate-900">{{ title }}</div>
          <div class="text-xs text-slate-500">{{ subtitle }}</div>
        </div>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

defineProps<{ title: string; subtitle: string }>();
defineEmits<{ (e: "toggleMobileNav"): void }>();

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push({ name: "login" });
}
</script>