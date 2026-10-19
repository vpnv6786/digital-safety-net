// Content agent: watches report trends and drafts a public warning when a scam
// type at least doubles week over week. The draft becomes an unpublished alert
// only after a moderator accepts it, and public only after a second approval.
//
//   AGENT_API_URL=... AGENT_API_TOKEN=... ANTHROPIC_API_KEY=... npx tsx agents/content.ts [--dry-run]

import Anthropic from '@anthropic-ai/sdk';
import { REPORT_CATEGORIES } from '../shared/core/index.ts';
import { agentApi, requireEnv } from './client.ts';
import { DEFAULT_MODEL, buildDraftRequest, draftProposal, risingCategories } from './lib.ts';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const api = agentApi(requireEnv('AGENT_API_URL'), requireEnv('AGENT_API_TOKEN'));
  const rows = await api.summary(14);
  const rising = risingCategories(rows, new Date());
  if (rising.length === 0) {
    console.log('content: no scam type doubled this week');
    return;
  }
  const top = rising[0];
  console.log(`content: ${top.category} rose ${top.lastWeek} -> ${top.thisWeek}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('content: ANTHROPIC_API_KEY not set, no draft written');
    return;
  }

  const label = REPORT_CATEGORIES.find((c) => c.code === top.category)?.vi ?? top.category;
  const client = new Anthropic();
  const message = await client.beta.messages.create(buildDraftRequest(top, label, process.env.LLM_MODEL || DEFAULT_MODEL));
  const proposal = draftProposal(message, top);
  if (!proposal) {
    console.log('content: the model did not return a usable draft');
    return;
  }
  console.log(JSON.stringify(proposal.payload, null, 2));
  if (dryRun) return;
  await api.propose('content', [proposal]);
  console.log('content: draft stored for review');
}

main().catch((error) => {
  console.error('content failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
