import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { summarizeMetrics, type MetricsSummary } from '@/lib/metrics';
import { metrics, proposalStats } from '@/services/moderationService';

const LEVEL_LABEL: Record<string, string> = {
  danger: 'Rất nguy hiểm',
  warning: 'Có dấu hiệu',
  unknown: 'Chưa đủ thông tin',
  official: 'Kênh chính thức',
};

const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)}%`);

const Stat = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <Card>
    <CardContent className="p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
    </CardContent>
  </Card>
);

const MetricsPanel = ({ vi }: { vi: boolean }) => {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [agents, setAgents] = useState<Record<string, Record<string, number>>>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([metrics(14), proposalStats()])
      .then(([rows, proposals]) => {
        setSummary(summarizeMetrics(rows));
        const byAgent: Record<string, Record<string, number>> = {};
        for (const p of proposals) {
          byAgent[p.agent] = byAgent[p.agent] ?? {};
          byAgent[p.agent][p.status] = (byAgent[p.agent][p.status] ?? 0) + 1;
        }
        setAgents(byAgent);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-danger-red">{vi ? 'Không tải được số liệu.' : 'Metrics could not be loaded.'}</p>;
  if (!summary) return <p className="text-gray-600">{vi ? 'Đang tải…' : 'Loading…'}</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {vi
          ? '14 ngày gần nhất. Chỉ là số đếm theo ngày; không lưu nội dung kiểm tra. Lượt kiểm tra chạy trên trình duyệt (khi máy chủ lỗi) không được đếm.'
          : 'Last 14 days. Daily counts only; no checked content is stored. Checks that ran in the browser (server down) are not counted.'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label={vi ? 'Lượt kiểm tra' : 'Checks'} value={String(summary.totalChecks)} />
        <Stat
          label={vi ? 'Dừng lại sau cảnh báo' : 'Stopped after a warning'}
          value={pct(summary.stopRate)}
          note={vi ? 'chỉ số chính, người dùng tự trả lời' : 'north-star, self-reported'}
        />
        <Stat label={vi ? 'Báo kết quả sai' : 'Said result was wrong'} value={pct(summary.wrongRate)} />
        <Stat label={vi ? 'Lượt gọi AI' : 'AI calls'} value={String(summary.aiCalls)} />
      </div>
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1">{vi ? 'Kết luận' : 'Answer'}</th>
                <th>{vi ? 'Lượt' : 'Checks'}</th>
                <th>{vi ? 'Dừng' : 'Stop'}</th>
                <th>{vi ? 'Vẫn làm' : 'Go ahead'}</th>
                <th>{vi ? 'Chưa biết' : 'Unsure'}</th>
                <th>{vi ? 'Sai' : 'Wrong'}</th>
              </tr>
            </thead>
            <tbody>
              {['danger', 'warning', 'unknown', 'official'].map((level) => {
                const f = summary.feedback[level] ?? {};
                return (
                  <tr key={level} className="border-t">
                    <td className="py-1">{vi ? LEVEL_LABEL[level] : level}</td>
                    <td>{summary.checks[level] ?? 0}</td>
                    <td>{f.stopped ?? 0}</td>
                    <td>{f.continued ?? 0}</td>
                    <td>{f.unsure ?? 0}</td>
                    <td>{f.wrong ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="font-medium text-gray-900 mb-2">{vi ? 'Đề xuất của agent (30 ngày)' : 'Agent proposals (30 days)'}</div>
          {Object.keys(agents).length === 0 ? (
            <p className="text-sm text-gray-600">{vi ? 'Chưa có đề xuất.' : 'No proposals yet.'}</p>
          ) : (
            <ul className="text-sm space-y-1">
              {Object.entries(agents).map(([agent, s]) => {
                const decided = (s.accepted ?? 0) + (s.dismissed ?? 0);
                return (
                  <li key={agent}>
                    <span className="font-mono">{agent}</span>: {s.accepted ?? 0} {vi ? 'chấp nhận' : 'accepted'}, {s.dismissed ?? 0}{' '}
                    {vi ? 'bỏ qua' : 'dismissed'}, {s.pending ?? 0} {vi ? 'đang chờ' : 'pending'}
                    {decided ? ` · ${vi ? 'tỷ lệ chấp nhận' : 'acceptance'} ${pct((s.accepted ?? 0) / decided)}` : ''}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPanel;
