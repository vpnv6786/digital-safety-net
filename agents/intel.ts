// Intel agent: looks for new sites that impersonate the banks, wallets, shops
// and government services people trust, and proposes takedown requests. It
// never opens those sites and never contacts anyone: a moderator checks each
// one and sends the request by hand.
//
// Sources: crt.sh (certificates logged in the last day) and the OpenPhish
// public feed. Either may be down; the run goes on with whatever answered.
//
//   AGENT_API_URL=... AGENT_API_TOKEN=... npx tsx agents/intel.ts [--dry-run]

import { agentApi, requireEnv } from './client.ts';
import {
  MAX_INTEL_PROPOSALS,
  intelSearchTerms,
  lookalikeCandidates,
  parseCrtSh,
  parseFeed,
  rdapRegistrar,
  takedownProposal,
  type IntelSighting,
} from './lib.ts';

const OPENPHISH_FEED = 'https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt';
const WINDOW_MS = 24 * 60 * 60 * 1000; // matches the daily schedule
const TIMEOUT_MS = 45_000;

async function get(url: string): Promise<Response> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'user-agent': 've-binh-mang-intel' } });
  if (!res.ok) throw new Error(`${new URL(url).hostname} answered ${res.status}`);
  return res;
}

async function fromCertificateLogs(since: Date): Promise<IntelSighting[]> {
  const out: IntelSighting[] = [];
  let failures = 0;
  for (const term of intelSearchTerms()) {
    try {
      const res = await get(`https://crt.sh/?q=${encodeURIComponent(`%${term}%`)}&output=json&exclude=expired&deduplicate=Y`);
      out.push(...parseCrtSh(await res.json(), since));
    } catch (error) {
      failures++;
      console.warn(`intel: crt.sh "${term}" failed: ${error instanceof Error ? error.message : error}`);
      if (failures >= 3 && out.length === 0) throw new Error('crt.sh is not answering');
    }
  }
  return out;
}

async function fromPhishingFeed(): Promise<IntelSighting[]> {
  return parseFeed(await (await get(OPENPHISH_FEED)).text());
}

async function registrarOf(domain: string): Promise<string | undefined> {
  try {
    return rdapRegistrar(await (await get(`https://rdap.org/domain/${encodeURIComponent(domain)}`)).json());
  } catch {
    return undefined; // many ccTLDs, including .vn, have no RDAP
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const api = dryRun && !process.env.AGENT_API_URL ? null : agentApi(requireEnv('AGENT_API_URL'), requireEnv('AGENT_API_TOKEN'));
  const since = new Date(Date.now() - WINDOW_MS);

  const results = await Promise.allSettled([fromCertificateLogs(since), fromPhishingFeed()]);
  const sightings: IntelSighting[] = [];
  for (const [i, r] of results.entries()) {
    const name = i === 0 ? 'certificate logs' : 'phishing feed';
    if (r.status === 'fulfilled') {
      console.log(`intel: ${name}: ${r.value.length} hosts`);
      sightings.push(...r.value);
    } else {
      console.warn(`intel: ${name} unavailable: ${r.reason instanceof Error ? r.reason.message : r.reason}`);
    }
  }
  if (results.every((r) => r.status === 'rejected')) throw new Error('no source answered');

  const candidates = lookalikeCandidates(sightings);
  console.log(`intel: ${candidates.length} lookalikes`);
  const proposals = [];
  for (const c of candidates.slice(0, MAX_INTEL_PROPOSALS)) {
    // On shared hosting the provider, not the registrar, takes the page down.
    proposals.push(takedownProposal(c, c.sharedHost ? undefined : await registrarOf(c.domain)));
    console.log(`  ${c.severity} ${c.source} ${c.host} (${c.brand})`);
  }
  if (candidates.length > MAX_INTEL_PROPOSALS) console.log(`intel: ${candidates.length - MAX_INTEL_PROPOSALS} weaker ones not sent`);
  if (dryRun || !api || proposals.length === 0) return;
  const ids = await api.propose('intel', proposals);
  // Hosts proposed in the last 30 days are skipped by the API.
  console.log(`intel: stored ${ids.length} new proposals for review`);
}

main().catch((error) => {
  console.error('intel failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
