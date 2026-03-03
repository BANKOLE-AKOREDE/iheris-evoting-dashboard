<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">Create Election</h1>
          <p class="mt-1 text-sm text-slate-600">
            Configure election details, positions, and candidates. You can edit later before going LIVE.
          </p>
        </div>

        <div class="flex gap-2">
          <button class="btn btnGhost" @click="cancel()">Cancel</button>
          <button class="btn btnPrimary" :disabled="!canCreate" @click="create()">
            Create Election
          </button>
        </div>
      </div>
    </div>

    <!-- Form grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left: election details -->
      <section class="lg:col-span-1 space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-900">Election details</h2>

          <div class="mt-4 space-y-3">
            <label class="block">
              <div class="text-xs font-medium text-slate-600">Title</div>
              <input v-model.trim="title" class="input" placeholder="e.g. IHERIS SUG Elections 2026" />
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">Eligible voters (estimate)</div>
              <input v-model.number="eligibleVoters" type="number" min="0" class="input" />
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">Start date/time</div>
              <input v-model="startsAtLocal" type="datetime-local" class="input" />
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">End date/time</div>
              <input v-model="endsAtLocal" type="datetime-local" class="input" />
            </label>

            <label class="inline-flex items-center gap-2">
              <input v-model="liveResultsEnabled" type="checkbox" class="h-4 w-4" />
              <span class="text-sm text-slate-700">Enable LPR (live results) during voting</span>
            </label>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div class="font-semibold text-slate-800">Validation</div>
              <ul class="mt-1 list-disc pl-4 space-y-1">
                <li>Title is required</li>
                <li>At least 1 position</li>
                <li>Each position should have at least 1 candidate</li>
                <li>End time must be after start time</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-900">Summary</h2>
          <div class="mt-4 grid gap-3">
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs text-slate-500">Positions</div>
              <div class="text-lg font-semibold text-slate-900">{{ positions.length }}</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs text-slate-500">Candidates</div>
              <div class="text-lg font-semibold text-slate-900">{{ candidates.length }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: positions + candidates -->
      <section class="lg:col-span-2 space-y-6">
        <!-- Positions -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Positions</h2>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                v-model.trim="newPositionName"
                class="input h-10 w-full sm:w-72"
                placeholder="Add position (e.g. President)"
              />
              <button class="btn btnPrimary" @click="addPosition()" :disabled="!newPositionName.trim()">
                Add
              </button>
            </div>
          </div>

          <div
            v-if="positions.length === 0"
            class="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600"
          >
            No positions yet. Add at least one position to continue.
          </div>

          <div v-else class="mt-4 grid gap-3 md:grid-cols-2">
            <div v-for="pos in positions" :key="pos.id" class="rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-slate-900">{{ pos.name }}</div>
                  <div class="mt-1 text-xs text-slate-500">
                    Candidates:
                    <span class="font-medium text-slate-700">{{ countCandidatesFor(pos.id) }}</span>
                  </div>
                </div>

                <button class="btnIcon" type="button" title="Remove position" @click="removePosition(pos.id)">
                  ✕
                </button>
              </div>

              <div class="mt-3">
                <button class="btn btnGhost w-full" type="button" @click="setActivePosition(pos.id)">
                  Manage candidates
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Candidates -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Candidates</h2>
              <p class="mt-1 text-sm text-slate-600">Add candidates and assign them to positions.</p>
            </div>

            <div class="text-sm text-slate-500">
              Active position:
              <span class="font-medium text-slate-800">{{ activePositionName }}</span>
            </div>
          </div>

          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <label class="block">
              <div class="text-xs font-medium text-slate-600">Full name</div>
              <input v-model.trim="candName" class="input" placeholder="e.g. Amina Bello" />
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">Position</div>
              <select v-model="candPositionId" class="input" :disabled="positions.length === 0">
                <option v-for="p in positions" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">Department (optional)</div>
              <input v-model.trim="candDept" class="input" placeholder="e.g. IR" />
            </label>

            <label class="block">
              <div class="text-xs font-medium text-slate-600">Level (optional)</div>
              <input v-model.trim="candLevel" class="input" placeholder="e.g. 300" />
            </label>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn btnPrimary" type="button" @click="addCandidate()" :disabled="!canAddCandidate">
              Add candidate
            </button>
            <button class="btn btnGhost" type="button" @click="clearCandidateForm()">
              Clear
            </button>
          </div>

          <div class="mt-6">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Candidate list</div>

            <div
              v-if="candidates.length === 0"
              class="mt-3 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600"
            >
              No candidates yet. Add at least one candidate for each position.
            </div>

            <div v-else class="mt-3 space-y-3">
              <div
                v-for="cand in candidates"
                :key="cand.id"
                class="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-slate-900">{{ cand.fullName }}</div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ positionName(cand.positionId) }} • {{ cand.department ?? "—" }} • {{ cand.level ?? "—" }}
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button class="btn btnGhost" type="button" @click="toggleCandidate(cand.id)">
                    {{ cand.isActive ? "Active" : "Inactive" }}
                  </button>
                  <button class="btn btnDanger" type="button" @click="removeCandidate(cand.id)">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Validation banner -->
        <div v-if="!canCreate" class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div class="text-sm font-semibold text-amber-900">Can’t create yet</div>
          <div class="mt-1 text-sm text-amber-800">
            Ensure you have a title, at least one position, each position has at least one candidate, and end time is
            after start time.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useElectionsStore } from "@/stores/elections.store";
import { useAuditStore } from "@/stores/audit.store";

type Position = { id: string; name: string };
type Candidate = {
  id: string;
  fullName: string;
  positionId: string;
  department?: string;
  level?: string;
  isActive: boolean;
};

const router = useRouter();
const elections = useElectionsStore();
const audit = useAuditStore();

const title = ref("");
const eligibleVoters = ref<number>(300);
const liveResultsEnabled = ref<boolean>(true);

// datetime-local expects "YYYY-MM-DDTHH:mm"
function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const startsAtLocal = ref(toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000)));
const endsAtLocal = ref(toLocalInputValue(new Date(Date.now() + 3 * 60 * 60 * 1000)));

const positions = ref<Position[]>([]);
const candidates = ref<Candidate[]>([]);

const newPositionName = ref("");
const activePositionId = ref<string>("");

// candidate form
const candName = ref("");
const candPositionId = ref<string>("");
const candDept = ref("");
const candLevel = ref("");

const activePositionName = computed(() => {
  const p = positions.value.find((x) => x.id === activePositionId.value);
  return p?.name ?? positions.value[0]?.name ?? "—";
});

watch(
  () => positions.value.map((p) => p.id),
  () => {
    if (!activePositionId.value && positions.value.length > 0) activePositionId.value = positions.value[0]?.id ?? "";
    if (!candPositionId.value && positions.value.length > 0) candPositionId.value = positions.value[0]?.id ?? "";
  }
);

function setActivePosition(id: string) {
  activePositionId.value = id;
  if (!candPositionId.value) candPositionId.value = id;
}

function addPosition() {
  const name = newPositionName.value.trim();
  if (!name) return;

  const id = `p_${Math.random().toString(36).slice(2, 8)}`;
  positions.value.push({ id, name });

  newPositionName.value = "";
  if (!activePositionId.value) activePositionId.value = id;
  if (!candPositionId.value) candPositionId.value = id;
}

function removePosition(positionId: string) {
  positions.value = positions.value.filter((p) => p.id !== positionId);
  candidates.value = candidates.value.filter((c) => c.positionId !== positionId);

  if (activePositionId.value === positionId) {
    activePositionId.value = positions.value[0]?.id ?? "";
  }
  if (candPositionId.value === positionId) {
    candPositionId.value = positions.value[0]?.id ?? "";
  }
}

function positionName(positionId: string) {
  return positions.value.find((p) => p.id === positionId)?.name ?? "—";
}

function countCandidatesFor(positionId: string) {
  return candidates.value.filter((c) => c.positionId === positionId).length;
}

const canAddCandidate = computed(() => !!candName.value.trim() && !!candPositionId.value && positions.value.length > 0);

function addCandidate() {
  if (!canAddCandidate.value) return;

  const id = `c_${Math.random().toString(36).slice(2, 8)}`;
  candidates.value.push({
    id,
    fullName: candName.value.trim(),
    positionId: candPositionId.value,
    department: candDept.value.trim() || undefined,
    level: candLevel.value.trim() || undefined,
    isActive: true,
  });

  clearCandidateForm(false);
}

function clearCandidateForm(clearPosition: boolean = true) {
  candName.value = "";
  candDept.value = "";
  candLevel.value = "";
  if (clearPosition) candPositionId.value = positions.value[0]?.id ?? "";
}

function removeCandidate(candidateId: string) {
  candidates.value = candidates.value.filter((c) => c.id !== candidateId);
}

function toggleCandidate(candidateId: string) {
  const c = candidates.value.find((x) => x.id === candidateId);
  if (!c) return;
  c.isActive = !c.isActive;
}

const startISO = computed(() => new Date(startsAtLocal.value).toISOString());
const endISO = computed(() => new Date(endsAtLocal.value).toISOString());
const endAfterStart = computed(() => new Date(endISO.value).getTime() > new Date(startISO.value).getTime());

const eachPositionHasCandidate = computed(() => {
  if (positions.value.length === 0) return false;
  return positions.value.every((p) => candidates.value.some((c) => c.positionId === p.id));
});

const canCreate = computed(() => {
  return (
    !!title.value.trim() &&
    positions.value.length > 0 &&
    candidates.value.length > 0 &&
    eachPositionHasCandidate.value &&
    endAfterStart.value
  );
});

function create() {
  if (!canCreate.value) return;

  const id = elections.createElection({
    title: title.value.trim(),
    startsAt: startISO.value,
    endsAt: endISO.value,
    liveResultsEnabled: liveResultsEnabled.value,
    eligibleVoters: Math.max(0, Number(eligibleVoters.value || 0)),
    positions: positions.value,
    candidates: candidates.value,
  });

  audit.add("admin", "election_created", `id=${id} title=${title.value.trim()}`);
  router.push({ name: "election-details", params: { id } });
}

function cancel() {
  router.push({ name: "elections" });
}
</script>

<style scoped>
.input {
  @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900/10;
}

.btn {
  @apply inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50;
}
.btnPrimary {
  @apply bg-slate-900 text-white hover:bg-slate-800;
}
.btnGhost {
  @apply border border-slate-200 bg-white text-slate-700 hover:bg-slate-50;
}
.btnDanger {
  @apply border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100;
}
.btnIcon {
  @apply inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50;
}
</style>