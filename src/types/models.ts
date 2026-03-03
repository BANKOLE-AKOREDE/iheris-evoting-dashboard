export type Role = "SUPER_ADMIN" | "ELECTION_ADMIN" | "AUDITOR";

export type ElectionStatus = "DRAFT" | "SCHEDULED" | "LIVE" | "CLOSED";

export type Position = {
  id: string;
  name: string;
};

export type Candidate = {
  id: string;
  fullName: string;
  positionId: string;
  department?: string;
  level?: string;
  isActive: boolean;
};

export type Election = {
  id: string;
  title: string;
  status: ElectionStatus;
  startsAt: string; // ISO
  endsAt: string; // ISO
  positions: Position[];
  candidates: Candidate[];
  eligibleVoters: number;
  votesCast: number;
  liveResultsEnabled: boolean;
};

export type ResultRow = {
  positionId: string;
  candidateId: string;
  votes: number;
};

export type AuditLog = {
  id: string;
  ts: string; // ISO
  actor: string;
  action: string;
  meta?: string;
};