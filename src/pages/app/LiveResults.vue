<template>
  <div v-if="election" class="space-y-6">
    <!-- Header / Controls -->
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-lg font-semibold text-slate-900">Live Results</h1>

            <span
              class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="statusPillClass"
            >
              {{ election.status }}
            </span>

            <span
              class="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="election.liveResultsEnabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'"
            >
              LPR: {{ election.liveResultsEnabled ? "Enabled" : "Disabled" }}
            </span>
          </div>

          <p class="mt-1 text-sm text-slate-600">
            {{ election.title }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            class="btn btnPrimary"
            @click="toggleSim"
            :disabled="!election.liveResultsEnabled || election.status !== 'LIVE'"
            :title="election.status !== 'LIVE' ? 'Election must be LIVE' : (!election.liveResultsEnabled ? 'Enable LPR first' : '')"
          >
            <span class="inline-flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full"
                :class="simRunning ? 'bg-emerald-500' : 'bg-slate-300'"
              />
              {{ simRunning ? "Stop" : "Start" }} Simulator
            </span>
          </button>

          <button class="btn btnGhost" @click="resetAll">
            Reset Counts
          </button>

          <button class="btn btnGhost" @click="toggleLpr">
            {{ election.liveResultsEnabled ? "Disable" : "Enable" }} LPR
          </button>
        </div>
      </div>
    </div>

    <!-- Warning -->
    <div v-if="!election.liveResultsEnabled" class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div class="text-sm font-semibold text-amber-900">Live results are currently disabled</div>
      <div class="mt-1 text-sm text-amber-800">
        Enable LPR to show real-time updates while voting is ongoing.
      </div>
    </div>

    <!-- Results Grid -->
    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="pos in election.positions"
        :key="pos.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ pos.name }}</h3>
            <p class="mt-1 text-xs text-slate-500">
              Leading: <span class="font-medium text-slate-700">{{ topCandidateName(pos.id) }}</span>
            </p>
          </div>

          <div class="text-right">
            <div class="text-xs text-slate-500">Total votes</div>
            <div class="text-sm font-semibold text-slate-900 tabular-nums">
              {{ totalVotesForPosition(pos.id) }}
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-4">
          <div v-for="cand in sortedCandidatesByPosition(pos.id)" :key="cand.id">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate text-sm font-medium text-slate-800">
                  {{ cand.fullName }}
                </div>
                <div class="mt-0.5 text-xs text-slate-500">
                  {{ cand.department ?? "—" }} • {{ cand.level ?? "—" }}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-500">{{ barPct(pos.id, cand.id) }}%</span>
                <span class="text-sm font-semibold text-slate-900 tabular-nums">
                  {{ votesFor(cand.id) }}
                </span>
              </div>
            </div>

            <div class="mt-2 h-2 w-full rounded-full bg-slate-100">
              <div
                class="h-2 rounded-full bg-slate-900 transition-all duration-500"
                :style="{ width: barPct(pos.id, cand.id) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Turnout -->
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="text-sm font-semibold text-slate-900">Turnout</div>
          <div class="mt-1 text-sm text-slate-600">
            Votes Cast: <span class="font-semibold text-slate-900">{{ election.votesCast }}</span>
            /
            <span class="font-semibold text-slate-900">{{ election.eligibleVoters }}</span>
            <span class="text-slate-500">({{ turnoutPct }}%)</span>
          </div>
        </div>

        <div class="w-full max-w-md">
          <div class="h-2 w-full rounded-full bg-slate-100">
            <div
              class="h-2 rounded-full bg-slate-900 transition-all duration-500"
              :style="{ width: turnoutPct + '%' }"
            />
          </div>
          <div class="mt-2 flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EmptyState v-else title="Election not found" description="Return to Elections list and choose a valid election." />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useElectionsStore } from "@/stores/elections.store";
import { useResultsStore } from "@/stores/results.store";
import { startResultsSimulator } from "@/realtime/resultsSimulator";
import { useAuditStore } from "@/stores/audit.store";

const route = useRoute();
const elections = useElectionsStore();
const results = useResultsStore();
const audit = useAuditStore();

const electionId = computed(() => String(route.params.id));
const election = computed(() => elections.getById(electionId.value));

const simRunning = ref(false);
let handle: { stop: () => void } | null = null;

const turnoutPct = computed(() => {
  const e = election.value;
  if (!e) return 0;
  return e.eligibleVoters ? Math.round((e.votesCast / e.eligibleVoters) * 100) : 0;
});

const statusPillClass = computed(() => {
  const status = election.value?.status;
  if (status === "LIVE") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "CLOSED") return "border-slate-200 bg-slate-50 text-slate-700";
  if (status === "SCHEDULED") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
});

function ensureResults() {
  const e = election.value;
  if (!e) return;

  const ids = e.candidates.map((c) => c.id);
  const map: Record<string, string> = {};
  e.candidates.forEach((c) => (map[c.id] = c.positionId));
  results.ensureElection(e.id, ids, map);
}

function candidatesByPosition(positionId: string) {
  return election.value?.candidates.filter((c) => c.positionId === positionId) ?? [];
}

function sortedCandidatesByPosition(positionId: string) {
  const cands = candidatesByPosition(positionId);
  return [...cands].sort((a, b) => votesFor(b.id) - votesFor(a.id));
}

function votesFor(candidateId: string) {
  if (!election.value) return 0;
  return results.votesFor(election.value.id, candidateId);
}

function totalVotesForPosition(positionId: string) {
  const e = election.value;
  if (!e) return 0;
  const cands = candidatesByPosition(positionId);
  return cands.reduce((sum, c) => sum + votesFor(c.id), 0);
}

function barPct(positionId: string, candidateId: string) {
  const total = totalVotesForPosition(positionId);
  if (!total) return 0;
  return Math.round((votesFor(candidateId) / total) * 100);
}

function topCandidateName(positionId: string) {
  const sorted = sortedCandidatesByPosition(positionId);
  return sorted[0]?.fullName ?? "—";
}

function toggleLpr() {
  const e = election.value;
  if (!e) return;
  elections.toggleLiveResults(e.id, !e.liveResultsEnabled);
  audit.add("admin", "lpr_toggled", `id=${e.id} enabled=${!e.liveResultsEnabled}`);
}

function resetAll() {
  const e = election.value;
  if (!e) return;
  results.resetElection(e.id);
  elections.updateVotesCast(e.id, 0);
  audit.add("admin", "results_reset", `id=${e.id}`);
}

function startSim() {
  const e = election.value;
  if (!e) return;
  if (handle) handle.stop();
  handle = startResultsSimulator(e.id);
  simRunning.value = true;
  audit.add("admin", "simulator_started", `id=${e.id}`);
}

function stopSim() {
  if (handle) handle.stop();
  handle = null;
  simRunning.value = false;
  audit.add("admin", "simulator_stopped");
}

function toggleSim() {
  simRunning.value ? stopSim() : startSim();
}

onMounted(() => {
  ensureResults();
  const e = election.value;
  if (e && e.status === "LIVE" && e.liveResultsEnabled) startSim();
});

onBeforeUnmount(() => stopSim());
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50;
}

.btnPrimary {
  @apply bg-slate-900 text-white hover:bg-slate-800;
}

.btnGhost {
  @apply border border-slate-200 bg-white text-slate-700 hover:bg-slate-50;
}
</style>