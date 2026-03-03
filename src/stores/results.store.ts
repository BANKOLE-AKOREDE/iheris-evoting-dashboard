import { defineStore } from "pinia";
import type { ResultRow } from "@/types/models";

type ResultsState = {
  byElectionId: Record<string, ResultRow[]>;
};

export const useResultsStore = defineStore("results", {
  state: (): ResultsState => ({
    byElectionId: {},
  }),
  getters: {
    resultsFor: (s) => (electionId: string) => s.byElectionId[electionId] ?? [],
    votesFor: (s) => (electionId: string, candidateId: string) => {
      const rows = s.byElectionId[electionId] ?? [];
      return rows.find((r) => r.candidateId === candidateId)?.votes ?? 0;
    },
  },
  actions: {
    ensureElection(electionId: string, candidateIds: string[], positionIdsByCandidate: Record<string, string>) {
      if (this.byElectionId[electionId]) return;

      this.byElectionId[electionId] = candidateIds.map((cid) => ({
        candidateId: cid,
        positionId: positionIdsByCandidate[cid],
        votes: 0,
      }));
    },
    applyUpdate(electionId: string, candidateId: string, votes: number) {
      const rows = this.byElectionId[electionId];
      if (!rows) return;
      const row = rows.find((r) => r.candidateId === candidateId);
      if (!row) return;
      row.votes = votes;
    },
    increment(electionId: string, candidateId: string, by = 1) {
      const rows = this.byElectionId[electionId];
      if (!rows) return;
      const row = rows.find((r) => r.candidateId === candidateId);
      if (!row) return;
      row.votes += by;
    },
    resetElection(electionId: string) {
      const rows = this.byElectionId[electionId];
      if (!rows) return;
      rows.forEach((r) => (r.votes = 0));
    },
  },
  persist: true,
});