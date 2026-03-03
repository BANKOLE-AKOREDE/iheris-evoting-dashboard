<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <div class="text-lg font-semibold">Audit Logs</div>
        <div class="text-sm text-slate-600">Append-only activity stream for transparency.</div>
      </div>
      <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @click="clear">
        Clear (local)
      </button>
    </div>

    <DataTable :headers="['Time', 'Actor', 'Action', 'Meta']" :rows="rows" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DataTable from "@/components/ui/DataTable.vue";
import { useAuditStore } from "@/stores/audit.store";

const audit = useAuditStore();

const rows = computed(() => {
  return audit.logs.map((l) => [new Date(l.ts).toLocaleString(), l.actor, l.action, l.meta ?? ""]);
});

function clear() {
  audit.clear();
}
</script>