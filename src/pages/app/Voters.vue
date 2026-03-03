<template>
  <div class="space-y-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="text-lg font-semibold">Voters</div>
      <div class="text-sm text-slate-600">
        This screen will import eligible voters (CSV), map matric → Gmail, and show vote status.
      </div>
    </div>

    <EmptyState title="Not implemented yet" description="Next: CSV import + validation + voter status table." />
  </div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/ui/EmptyState.vue";
</script>