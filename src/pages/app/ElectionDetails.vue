<template>
  <div v-if="election" class="space-y-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div class="text-lg font-semibold">{{ election.title }}</div>
          <div class="text-sm text-slate-600">
            Status: <span class="font-medium">{{ election.status }}</span> •
            Starts: {{ fmt(election.startsAt) }} • Ends: {{ fmt(election.endsAt) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="btn" @click="setStatus('LIVE')">Set LIVE</button>
          <button class="btn" @click="setStatus('CLOSED')">Close</button>
          <button class="btn" @click="toggleLpr">{{ election.liveResultsEnabled ? "Disable" : "Enable" }} LPR</button>
          <RouterLink class="btnPrimary" :to="`/app/elections/${election.id}/results-live`">Open Live Results</RouterLink>
        </div>
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-sm font-semibold">Modules</div>
        <div class="mt-3 flex flex-wrap gap-2">
          <RouterLink class="btn" :to="`/app/elections/${election.id}/candidates`">Candidates</RouterLink>
          <RouterLink class="btn" :to="`/app/elections/${election.id}/voters`">Voters</RouterLink>
          <RouterLink class="btn" :to="`/app/elections/${election.id}/results-live`">Live Results</RouterLink>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-sm font-semibold">Stats</div>
        <div class="mt-3 grid gap-3 md:grid-cols-3">
          <div class="rounded-xl bg-slate-50 p-3">
            <div class="text-xs text-slate-500">Eligible</div>
            <div class="text-lg font-semibold">{{ election.eligibleVoters }}</div>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <div class="text-xs text-slate-500">Votes cast</div>
            <div class="text-lg font-semibold">{{ election.votesCast }}</div>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <div class="text-xs text-slate-500">Positions</div>
            <div class="text-lg font-semibold">{{ election.positions.length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EmptyState v-else title="Election not found" description="Return to Elections list and choose a valid election." />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useElectionsStore } from "@/stores/elections.store";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useAuditStore } from "@/stores/audit.store";

const route = useRoute();
const elections = useElectionsStore();
const audit = useAuditStore();

const election = computed(() => elections.getById(String(route.params.id)));

function fmt(iso: string) {
  return new Date(iso).toLocaleString();
}

function setStatus(status: "DRAFT" | "SCHEDULED" | "LIVE" | "CLOSED") {
  if (!election.value) return;
  elections.setStatus(election.value.id, status);
  audit.add("admin", "election_status_changed", `id=${election.value.id} status=${status}`);
}

function toggleLpr() {
  if (!election.value) return;
  elections.toggleLiveResults(election.value.id, !election.value.liveResultsEnabled);
  audit.add("admin", "lpr_toggled", `id=${election.value.id} enabled=${!election.value.liveResultsEnabled}`);
}
</script>

<style scoped>
.btn {
  @apply rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50;
}
.btnPrimary {
  @apply rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800;
}
</style>