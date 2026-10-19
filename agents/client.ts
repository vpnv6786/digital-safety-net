// Minimal Agent API client shared by the runners.

import type { Proposal, QueueReport, SummaryRow } from './lib.ts';

export interface AgentApi {
  queue(): Promise<{ reports: QueueReport[]; pending_appeals: number }>;
  summary(days: number): Promise<SummaryRow[]>;
  propose(agent: string, proposals: Proposal[]): Promise<string[]>;
}

export function agentApi(baseUrl: string, token: string, fetchFn: typeof fetch = fetch): AgentApi {
  const base = baseUrl.replace(/\/+$/, '');
  const call = async (path: string, init?: RequestInit) => {
    const res = await fetchFn(`${base}${path}`, {
      ...init,
      headers: { 'x-agent-token': token, 'content-type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`agent-api ${path} answered ${res.status}`);
    return res.json();
  };
  return {
    queue: () => call('/queue'),
    summary: async (days) => (await call(`/summary?days=${days}`)).rows,
    propose: async (agent, proposals) => {
      const ids: string[] = [];
      for (let i = 0; i < proposals.length; i += 20) {
        const res = await call('/proposals', { method: 'POST', body: JSON.stringify({ agent, proposals: proposals.slice(i, i + 20) }) });
        ids.push(...res.ids);
      }
      return ids;
    },
  };
}

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`${name} is not set`);
    process.exit(2);
  }
  return value;
}
