import { useResultsStore } from "@/stores/results.store";
import { useElectionsStore } from "@/stores/elections.store";
import { useAuditStore } from "@/stores/audit.store";

type SimHandle = { stop: () => void };

export function startResultsSimulator(electionId: string): SimHandle {
  const results = useResultsStore();
  const elections = useElectionsStore();
  const audit = useAuditStore();

  const election = elections.getById(electionId);
  if (!election) return { stop: () => {} };

  const candidateIds = election.candidates.map((c) => c.id);
  const map: Record<string, string> = {};
  election.candidates.forEach((c) => (map[c.id] = c.positionId));

  results.ensureElection(electionId, candidateIds, map);

  let timer: number | null = null;

  const scheduleNext = () => {
    timer = window.setTimeout(tick, 900 + Math.floor(Math.random() * 800));
  };

  const tick = () => {
    const e = elections.getById(electionId);
    if (!e) return;
    if (e.status !== "LIVE") return;
    if (!e.liveResultsEnabled) return;

    // ✅ Guard: must have candidates
    const count = e.candidates.length;
    if (count === 0) {
      audit.add("system", "vote_cast_simulated_skipped", "reason=no_candidates");
      scheduleNext();
      return;
    }

    // ✅ Safe pick
    const idx = Math.floor(Math.random() * count);
    const candidate = e.candidates[idx];
    if (!candidate) {
      // extra safety (shouldn't happen, but keeps TS & runtime safe)
      scheduleNext();
      return;
    }

    results.increment(electionId, candidate.id, 1);

    // update votesCast with approx realism
    elections.updateVotesCast(electionId, Math.min(e.eligibleVoters, e.votesCast + 1));

    audit.add("system", "vote_cast_simulated", `candidate=${candidate.fullName}`);

    scheduleNext();
  };

  timer = window.setTimeout(tick, 800);

  return {
    stop: () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    },
  };
}