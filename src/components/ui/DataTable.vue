<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th v-for="h in headers" :key="h" class="px-4 py-3 font-medium">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows" :key="idx" class="border-t border-slate-100">
          <td v-for="(cell, cidx) in row" :key="cidx" class="px-4 py-3">
            <span v-if="typeof cell === 'string' || typeof cell === 'number'">{{ cell }}</span>
            <component v-else :is="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
type Cell = string | number | any;

defineProps<{
  headers: string[];
  rows: Cell[][];
}>();
</script>