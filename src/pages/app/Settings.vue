<template>
  <div class="space-y-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="text-lg font-semibold">Settings</div>
      <div class="text-sm text-slate-600">Admin-only settings (role guarded).</div>
    </div>

    <EmptyState title="Not implemented yet" description="Next: institute branding, OTP mail config, results policy toggles." />
  </div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
</script>