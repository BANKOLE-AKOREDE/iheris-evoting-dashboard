<!-- src/pages/app/ElectionsList.vue -->
<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="text-lg font-semibold">Elections</div>
        <div class="text-sm text-slate-600">Manage elections and open Live Results.</div>

        <!-- Tabs + badges -->
        <div class="mt-3 inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            class="tab"
            :class="{ activeTab: !showArchived }"
            @click="switchView(false)"
          >
            Active
            <span class="badge">{{ elections.counts.active }}</span>
          </button>
          <button
            type="button"
            class="tab"
            :class="{ activeTab: showArchived }"
            @click="switchView(true)"
          >
            Archived
            <span class="badge">{{ elections.counts.archived }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <!-- Search -->
        <input
          v-model.trim="query"
          class="search"
          type="text"
          placeholder="Search elections (title/status)…"
        />

        <!-- Create button only on Active view -->
        <RouterLink v-if="!showArchived" class="btnPrimary" to="/app/elections/new">
          + Create Election
        </RouterLink>
      </div>
    </div>

    <!-- Fade between views -->
    <Transition name="fade" mode="out-in">
      <div :key="showArchived ? 'archived' : 'active'">
        <DataTable
          :headers="headers"
          :rows="tableRows"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import DataTable from "@/components/ui/DataTable.vue";
import { computed, h, ref } from "vue";
import { useElectionsStore } from "@/stores/elections.store";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useAuditStore } from "@/stores/audit.store";

const elections = useElectionsStore();
const router = useRouter();
const auth = useAuthStore();
const audit = useAuditStore();

const isSuperAdmin = computed(() => auth.user?.role === "SUPER_ADMIN");

const showArchived = ref(false);
const query = ref("");

const headers = computed(() => {
  // Add a bit more context in archived mode
  return showArchived.value
    ? ["Title", "Status", "Voters", "Votes", "Live", "Archived", "Actions"]
    : ["Title", "Status", "Voters", "Votes", "Live", "Actions"];
});

function switchView(archived: boolean) {
  showArchived.value = archived;
  // optional: keep query while switching; if you want to clear, uncomment:
  // query.value = "";
}

const source = computed(() => (showArchived.value ? elections.archivedElections : elections.visibleElections));

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return source.value;

  return source.value.filter((e) => {
    const title = (e.title ?? "").toLowerCase();
    const status = String(e.status ?? "").toLowerCase();
    const live = e.liveResultsEnabled ? "enabled" : "disabled";
    return title.includes(q) || status.includes(q) || live.includes(q);
  });
});

const tableRows = computed(() => {
  return filtered.value.map((e) => {
    const actionsChildren: any[] = [
      h(
        "button",
        {
          class: "btnAction",
          onClick: () => router.push(`/app/elections/${e.id}`),
        },
        "Open"
      ),
      h(
        "button",
        {
          class: "btnActionPrimary",
          onClick: () => router.push(`/app/elections/${e.id}/results-live`),
        },
        "Live Results"
      ),
    ];

    // SUPER_ADMIN-only controls
    if (isSuperAdmin.value) {
      if (!showArchived.value) {
        // Archive from Active view
        actionsChildren.push(
          h(
            "button",
            {
              class: "btnActionWarn",
              onClick: () => {
                const ok = confirm(`Archive "${e.title}"?\n\nThis will hide it from the Active list.`);
                if (!ok) return;
                elections.archiveElection(e.id);
                audit.add("admin", "election_archived", `id=${e.id}`);
              },
            },
            "Archive"
          )
        );
      } else {
        // Restore + Permanent delete from Archived view
        actionsChildren.push(
          h(
            "button",
            {
              class: "btnActionSuccess",
              onClick: () => {
                elections.unarchiveElection(e.id);
                audit.add("admin", "election_restored", `id=${e.id}`);
              },
            },
            "Restore"
          )
        );

        actionsChildren.push(
          h(
            "button",
            {
              class: "btnActionDanger",
              onClick: () => {
                const ok = confirm(
                  `PERMANENTLY delete "${e.title}"?\n\nThis cannot be undone and will remove it completely.`
                );
                if (!ok) return;

                elections.deleteElectionPermanently(e.id);
                audit.add("admin", "election_deleted_permanently", `id=${e.id}`);
              },
            },
            "Delete"
          )
        );
      }
    }

    const actions = h("div", { class: "flex flex-wrap gap-2" }, actionsChildren);

    const base = [e.title, e.status, e.eligibleVoters, e.votesCast, e.liveResultsEnabled ? "Enabled" : "Disabled"];

    if (showArchived.value) {
      return [...base, "Yes", actions];
    }

    return [...base, actions];
  });
});
</script>

<style scoped>
.btnPrimary {
  @apply inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800;
}

.search {
  @apply w-full sm:w-72 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900/10;
}

.tab {
  @apply inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition;
}

.activeTab {
  @apply bg-slate-900 text-white hover:bg-slate-900;
}

.badge {
  @apply inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700;
}

.activeTab .badge {
  @apply bg-white/15 text-white;
}

/* Action buttons */
.btnAction {
  @apply rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs hover:bg-slate-50;
}
.btnActionPrimary {
  @apply rounded-xl bg-slate-900 px-3 py-2 text-xs text-white hover:bg-slate-800;
}
.btnActionWarn {
  @apply rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 hover:bg-amber-100;
}
.btnActionSuccess {
  @apply rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 hover:bg-emerald-100;
}
.btnActionDanger {
  @apply rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 hover:bg-rose-100;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>