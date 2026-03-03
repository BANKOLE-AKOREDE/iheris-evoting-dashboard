<template>
  <div class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
    <div class="text-base font-medium">{{ title }}</div>
    <div class="mt-1 text-sm text-slate-600">{{ description }}</div>
    <div v-if="$slots.action" class="mt-4 flex justify-center">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>