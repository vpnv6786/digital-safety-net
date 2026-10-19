// Triage agent: reads pending reports, proposes verify/reject decisions and
// groups reports about the same entity. Changes nothing by itself: every
// proposal waits for a moderator in /kiem-duyet.
//
//   AGENT_API_URL=https://<web address>/api/agent \
//   AGENT_API_TOKEN=... ANTHROPIC_API_KEY=... npx tsx agents/triage.ts [--dry-run]

import Anthropic from '@anthropic-ai/sdk';
import { agentApi, requireEnv } from './client.ts';
import { DEFAULT_MODEL, buildTriageRequest, clusterProposals, ruleFindings, triageProposals, type Proposal } from './lib.ts';

const MAX_REPORTS_PER_RUN = 20;

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const api = agentApi(requireEnv('AGENT_API_URL'), requireEnv('AGENT_API_TOKEN'));
  const { reports } = await api.queue();
  if (reports.length === 0) {
    console.log('triage: queue is empty');
    return;
  }

  const batch = reports.slice(0, MAX_REPORTS_PER_RUN);
  const proposals: Proposal[] = clusterProposals(reports);

  if (process.env.ANTHROPIC_API_KEY) {
    const findings = new Map(await Promise.all(batch.map(async (r) => [r.id, await ruleFindings(r)] as const)));
    const client = new Anthropic();
    try {
      const message = await client.beta.messages.create(buildTriageRequest(batch, findings, process.env.LLM_MODEL || DEFAULT_MODEL));
      proposals.push(...triageProposals(message, batch));
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) console.warn('triage: model rate limited, sending clusters only');
      else if (error instanceof Anthropic.APIError) console.error(`triage: model error ${error.status}, sending clusters only`);
      else throw error;
    }
  } else {
    console.log('triage: ANTHROPIC_API_KEY not set, sending clusters only');
  }

  console.log(`triage: ${reports.length} pending, ${proposals.length} proposals`);
  for (const p of proposals) console.log(`  ${p.kind} ${p.target_id ?? ''} ${p.confidence ?? ''} ${p.rationale}`);
  if (dryRun || proposals.length === 0) return;
  const ids = await api.propose('triage', proposals);
  console.log(`triage: stored ${ids.length} proposals for review`);
}

main().catch((error) => {
  console.error('triage failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
