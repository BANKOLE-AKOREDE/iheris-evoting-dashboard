<template>
  <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <div class="text-sm font-medium text-amber-900">{{ title }}</div>
    <div class="mt-1 text-sm text-amber-800">{{ message }}</div>
    <div class="mt-3 flex gap-2">
      <button class="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white" @click="$emit('confirm')">
        Confirm
      </button>
      <button class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" @click="$emit('cancel')">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; message: string }>();
defineEmits<{ (e: "confirm"): void; (e: "cancel"): void }>();
</script>