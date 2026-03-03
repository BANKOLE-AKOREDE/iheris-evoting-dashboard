<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
    <div class="text-xs font-medium uppercase tracking-wider text-slate-500">
      {{ label }}
    </div>

    <div class="mt-3 flex items-end justify-between gap-4">
      <div class="text-3xl font-bold tracking-tight text-slate-900">
        {{ value }}
      </div>
      <div v-if="hint" class="text-xs font-medium text-slate-500">
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  hint?: string;
}>();
</script>