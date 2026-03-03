<template>
  <div class="space-y-4">
    <div class="grid gap-3 md:grid-cols-4">
      <StatCard label="Active election" :value="active?.title ?? '—'" hint="from Elections store" />
      <StatCard label="Status" :value="active?.status ?? '—'" />
      <StatCard label="Eligible voters" :value="active?.eligibleVoters ?? 0" />
      <StatCard label="Votes cast" :value="active?.votesCast ?? 0" :hint="turnoutHint" />
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-sm font-semibold">Quick actions</div>
        <div class="mt-3 flex flex-wrap gap-2">
          <RouterLink class="btn" to="/app/elections">View elections</RouterLink>
          <RouterLink v-if="active" class="btn" :to="`/app/elections/${active.id}/results-live`">Live results</RouterLink>
          <RouterLink class="btn" to="/app/audit-logs">Audit logs</RouterLink>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-sm font-semibold">Latest activity</div>
        <div class="mt-3 space-y-2 text-sm">
          <div v-if="audit.latest.length === 0" class="text-slate-500">No activity yet.</div>
          <div v-for="log in audit.latest" :key="log.id" class="flex items-start justify-between gap-3">
            <div>
              <div class="font-medium">{{ log.action }}</div>
              <div class="text-xs text-slate-500">{{ log.actor }} • {{ formatTs(log.ts) }}</div>
            </div>
            <div class="text-xs text-slate-500">{{ log.meta }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from "@/components/ui/StatCard.vue";
import { computed } from "vue";
import { useElectionsStore } from "@/stores/elections.store";
import { useAuditStore } from "@/stores/audit.store";

const elections = useElectionsStore();
const audit = useAuditStore();

const active = computed(() => elections.activeElection);

const turnoutHint = computed(() => {
  const e = active.value;
  if (!e) return "";
  const pct = e.eligibleVoters ? Math.round((e.votesCast / e.eligibleVoters) * 100) : 0;
  return `${pct}% turnout`;
});

function formatTs(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
</script>

<style scoped>
.btn {
  @apply rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50;
}
</style>