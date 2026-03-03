import { defineStore } from "pinia";
import type { Election } from "@/types/models";

function nowPlus(hours: number) {
  return new Date(Date.now() + hours * 3600_000).toISOString();
}

/** Helper types for creation payload (keeps UI pages strongly typed) */
export type ElectionPositionInput = { id: string; name: string };

export type ElectionCandidateInput = {
  id: string;
  fullName: string;
  positionId: string;
  department?: string;
  level?: string;
  isActive: boolean;
};

export type CreateElectionPayload = {
  title: string;
  startsAt: string;
  endsAt: string;
  liveResultsEnabled: boolean;
  eligibleVoters: number;
  positions: ElectionPositionInput[];
  candidates: ElectionCandidateInput[];
};

// Soft-delete flag without changing your models file yet
export type ElectionWithArchive = Election & { archived?: boolean };

const seedElections: ElectionWithArchive[] = [
  {
    id: "e1",
    title: "IHERIS SUG Elections 2026",
    status: "LIVE",
    startsAt: nowPlus(-2),
    endsAt: nowPlus(4),
    positions: [
      { id: "p1", name: "President" },
      { id: "p2", name: "Vice President" },
      { id: "p3", name: "Secretary General" },
    ],
    candidates: [
      { id: "c1", fullName: "Amina Bello", positionId: "p1", department: "IR", level: "400", isActive: true },
      { id: "c2", fullName: "John Mensah", positionId: "p1", department: "PS", level: "400", isActive: true },

      { id: "c3", fullName: "Fatou Diallo", positionId: "p2", department: "IR", level: "300", isActive: true },
      { id: "c4", fullName: "Ibrahim Yusuf", positionId: "p2", department: "PS", level: "300", isActive: true },

      { id: "c5", fullName: "Grace Okafor", positionId: "p3", department: "IR", level: "200", isActive: true },
      { id: "c6", fullName: "Samuel Koffi", positionId: "p3", department: "PS", level: "200", isActive: true },
    ],
    eligibleVoters: 1200,
    votesCast: 312,
    liveResultsEnabled: true,
    archived: false,
  },
  {
    id: "e2",
    title: "Class Rep By-Election (Level 200)",
    status: "DRAFT",
    startsAt: nowPlus(24),
    endsAt: nowPlus(30),
    positions: [{ id: "p10", name: "Class Representative" }],
    candidates: [
      { id: "c10", fullName: "Marie Kouassi", positionId: "p10", isActive: true },
      { id: "c11", fullName: "Abdul Karim", positionId: "p10", isActive: true },
    ],
    eligibleVoters: 350,
    votesCast: 0,
    liveResultsEnabled: false,
    archived: false,
  },
];

export const useElectionsStore = defineStore("elections", {
  state: () => ({
    elections: seedElections as ElectionWithArchive[],
    activeElectionId: "e1" as string,
  }),
  getters: {
    activeElection(state) {
      return state.elections.find((e) => e.id === state.activeElectionId) ?? null;
    },
    getById: (state) => {
      return (id: string) => state.elections.find((e) => e.id === id) ?? null;
    },

    /** Active (non-archived) elections */
    visibleElections(state) {
      return state.elections.filter((e) => !e.archived);
    },

    /** Archived elections */
    archivedElections(state) {
      return state.elections.filter((e) => !!e.archived);
    },

    /** Badge counts */
    counts(state) {
      const active = state.elections.filter((e) => !e.archived).length;
      const archived = state.elections.filter((e) => !!e.archived).length;
      return { active, archived };
    },
  },
  actions: {
    setActiveElection(id: string) {
      this.activeElectionId = id;
    },

    /** Create a new election (DRAFT) with positions + candidates */
    createElection(payload: CreateElectionPayload) {
      const id = `e_${Math.random().toString(36).slice(2, 8)}`;

      const newElection: ElectionWithArchive = {
        id,
        title: payload.title,
        status: "DRAFT",
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        positions: payload.positions,
        candidates: payload.candidates,
        eligibleVoters: payload.eligibleVoters,
        votesCast: 0,
        liveResultsEnabled: payload.liveResultsEnabled,
        archived: false,
      };

      this.elections.unshift(newElection);
      this.activeElectionId = id;

      return id;
    },

    /** Soft-delete (archive) election */
    archiveElection(electionId: string) {
      const e = this.elections.find((x) => x.id === electionId);
      if (!e) return;
      e.archived = true;

      if (this.activeElectionId === electionId) {
        const next = this.elections.find((x) => !x.archived);
        this.activeElectionId = next?.id ?? "";
      }
    },

    /** Restore archived election */
    unarchiveElection(electionId: string) {
      const e = this.elections.find((x) => x.id === electionId);
      if (!e) return;
      e.archived = false;
    },

    /** Permanent delete (danger) */
    deleteElectionPermanently(electionId: string) {
      this.elections = this.elections.filter((e) => e.id !== electionId);

      if (this.activeElectionId === electionId) {
        const next = this.elections.find((x) => !x.archived);
        this.activeElectionId = next?.id ?? "";
      }
    },

    updateVotesCast(electionId: string, votesCast: number) {
      const e = this.elections.find((x) => x.id === electionId);
      if (!e) return;
      e.votesCast = votesCast;
    },

    toggleLiveResults(electionId: string, enabled: boolean) {
      const e = this.elections.find((x) => x.id === electionId);
      if (!e) return;
      e.liveResultsEnabled = enabled;
    },

    setStatus(electionId: string, status: "DRAFT" | "SCHEDULED" | "LIVE" | "CLOSED") {
      const e = this.elections.find((x) => x.id === electionId);
      if (!e) return;
      e.status = status;
    },
  },
  persist: true,
});