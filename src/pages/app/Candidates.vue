<template>
  <div class="space-y-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="text-lg font-semibold">Candidates</div>
      <div class="text-sm text-slate-600">This screen will manage candidates per position.</div>
    </div>

    <EmptyState title="Not implemented yet" description="Next: add candidate CRUD + photo upload + activate/deactivate." />
  </div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
</script>