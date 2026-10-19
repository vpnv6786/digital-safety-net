import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsModerator } from '@/hooks/useIsModerator';
import {
  decideProposal,
  evidenceLinks,
  moderateAlert,
  moderateReport,
  pendingAlerts,
  pendingAppeals,
  pendingProposals,
  pendingReports,
  resolveAppeal,
  type AgentProposal,
  type PendingReport,
} from '@/services/moderationService';
import { REPORT_CATEGORIES, bankName } from '@core/index.ts';

type Tab = 'reports' | 'appeals' | 'alerts' | 'proposals';

function errorText(e: unknown, vi: boolean): string {
  const msg = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? '');
  if (msg.includes('own_')) return vi ? 'Không thể tự duyệt mục do chính bạn gửi.' : 'You cannot rule on your own submission.';
  return vi ? 'Thao tác chưa thành công.' : 'The action failed.';
}

const ReportItem = ({ report, vi, onDone }: { report: PendingReport; vi: boolean; onDone: () => void }) => {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [links, setLinks] = useState<string[]>([]);
  useEffect(() => {
    evidenceLinks(report.evidence_urls ?? []).then(setLinks).catch(() => setLinks([]));
  }, [report.evidence_urls]);

  const category = REPORT_CATEGORIES.find((c) => c.code === report.scam_category);
  const entity = report.entity;
  const shown = entity?.display_value ?? entity?.normalized_value ?? '?';
  const decide = async (decision: 'verified' | 'rejected') => {
    setBusy(true);
    try {
      await moderateReport(report.id, decision, note);
      toast.success(decision === 'verified' ? (vi ? 'Đã xác minh' : 'Verified') : vi ? 'Đã từ chối' : 'Rejected');
      onDone();
    } catch (e) {
      toast.error(errorText(e, vi));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{entity?.entity_type}</Badge>
          <span className="font-mono font-semibold">
            {shown}
            {entity?.bank_code ? ` (${bankName(entity.bank_code) ?? entity.bank_code})` : ''}
          </span>
          <Badge variant="outline">{category ? (vi ? category.vi : category.en) : report.scam_category}</Badge>
          <span className="text-xs text-gray-500">{new Date(report.created_at).toLocaleString(vi ? 'vi-VN' : 'en-GB')}</span>
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{report.description}</p>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={vi ? 'Ảnh bằng chứng' : 'Evidence'} className="h-28 rounded border object-cover" />
              </a>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={vi ? 'Ghi chú lý do (lưu vào nhật ký)' : 'Reason (kept in the log)'} />
          <Button disabled={busy} onClick={() => decide('verified')} className="bg-danger-red hover:bg-red-700">
            <Check className="w-4 h-4 mr-1" />
            {vi ? 'Xác minh lừa đảo' : 'Verify scam'}
          </Button>
          <Button disabled={busy} variant="outline" onClick={() => decide('rejected')}>
            <X className="w-4 h-4 mr-1" />
            {vi ? 'Từ chối' : 'Reject'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

type Row = Record<string, string | null>;

const SimpleItem = ({
  row,
  vi,
  title,
  body,
  actions,
}: {
  row: Row;
  vi: boolean;
  title: string;
  body: string;
  actions: { label: string; run: (note: string) => Promise<void>; primary?: boolean }[];
}) => {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{title}</span>
          {row.created_at && <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleString(vi ? 'vi-VN' : 'en-GB')}</span>}
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{body}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={vi ? 'Ghi chú lý do (lưu vào nhật ký)' : 'Reason (kept in the log)'} />
          {actions.map((a) => (
            <Button
              key={a.label}
              disabled={busy}
              variant={a.primary ? 'default' : 'outline'}
              onClick={async () => {
                setBusy(true);
                try {
                  await a.run(note);
                } catch (e) {
                  toast.error(errorText(e, vi));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Moderation = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const moderator = useIsModerator();
  const [tab, setTab] = useState<Tab>('reports');
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [appeals, setAppeals] = useState<Row[]>([]);
  const [alerts, setAlerts] = useState<Row[]>([]);
  const [proposals, setProposals] = useState<AgentProposal[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, a, al, p] = await Promise.all([pendingReports(), pendingAppeals(), pendingAlerts(), pendingProposals()]);
      setReports(r);
      setProposals(p);
      setAppeals(a as unknown as Row[]);
      setAlerts(al as unknown as Row[]);
    } catch {
      toast.error(vi ? 'Không tải được hàng chờ.' : 'The queue could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [vi]);

  useEffect(() => {
    if (moderator) load();
  }, [moderator, load]);

  if (moderator === null) {
    return <div className="p-8 text-center text-gray-600">{vi ? 'Đang kiểm tra quyền…' : 'Checking access…'}</div>;
  }
  if (!moderator) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-3">
        <p className="text-gray-700">{vi ? 'Trang này chỉ dành cho người kiểm duyệt.' : 'This page is for moderators only.'}</p>
        <Link to="/" className="text-trust-blue underline">
          {vi ? 'Về trang chủ' : 'Home'}
        </Link>
      </div>
    );
  }

  const tabs: { id: Tab; vi: string; en: string; count: number }[] = [
    { id: 'reports', vi: 'Báo cáo', en: 'Reports', count: reports.length },
    { id: 'appeals', vi: 'Khiếu nại', en: 'Appeals', count: appeals.length },
    { id: 'alerts', vi: 'Cảnh báo', en: 'Alerts', count: alerts.length },
    { id: 'proposals', vi: 'Đề xuất của agent', en: 'Agent proposals', count: proposals.length },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{vi ? 'Kiểm duyệt' : 'Moderation'}</h1>
        <p className="text-sm text-gray-600">
          {vi
            ? 'Mọi quyết định được ghi vào nhật ký kèm tên người duyệt. Chỉ xác minh khi có căn cứ: ảnh bằng chứng khớp kịch bản lừa đảo, nhiều người báo cáo độc lập, hoặc nguồn chính thức. Không thể tự duyệt mục do chính mình gửi.'
            : 'Every decision is logged with the moderator. Verify only with grounds: evidence matching a scam script, several independent reporters, or an official source. You cannot rule on your own submissions.'}
        </p>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Button key={t.id} variant={tab === t.id ? 'default' : 'outline'} onClick={() => setTab(t.id)}>
              {vi ? t.vi : t.en} ({t.count})
            </Button>
          ))}
          <Button variant="ghost" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : vi ? 'Tải lại' : 'Reload'}
          </Button>
        </div>

        {tab === 'reports' &&
          (reports.length ? (
            reports.map((r) => <ReportItem key={r.id} report={r} vi={vi} onDone={load} />)
          ) : (
            <p className="text-gray-600">{vi ? 'Không có báo cáo chờ duyệt.' : 'No reports waiting.'}</p>
          ))}

        {tab === 'appeals' &&
          (appeals.length ? (
            appeals.map((a) => (
              <SimpleItem
                key={a.id}
                row={a}
                vi={vi}
                title={`${a.entity_type}: ${a.display_value ?? ''}`}
                body={`${a.reason}${a.contact ? `\n\n${vi ? 'Liên hệ' : 'Contact'}: ${a.contact}` : ''}`}
                actions={[
                  {
                    label: vi ? 'Chấp nhận (gỡ mọi báo cáo)' : 'Accept (clear all reports)',
                    primary: true,
                    run: async (note) => {
                      await resolveAppeal(a.id!, 'accepted', note);
                      load();
                    },
                  },
                  {
                    label: vi ? 'Không chấp nhận' : 'Reject',
                    run: async (note) => {
                      await resolveAppeal(a.id!, 'rejected', note);
                      load();
                    },
                  },
                ]}
              />
            ))
          ) : (
            <p className="text-gray-600">{vi ? 'Không có khiếu nại chờ xử lý.' : 'No appeals waiting.'}</p>
          ))}

        {tab === 'alerts' &&
          (alerts.length ? (
            alerts.map((al) => (
              <SimpleItem
                key={al.id}
                row={al}
                vi={vi}
                title={al.title ?? ''}
                body={al.description ?? ''}
                actions={[
                  {
                    label: vi ? 'Công khai' : 'Publish',
                    primary: true,
                    run: async (note) => {
                      await moderateAlert(al.id!, 'verify', note);
                      load();
                    },
                  },
                  {
                    label: vi ? 'Ẩn' : 'Hide',
                    run: async (note) => {
                      await moderateAlert(al.id!, 'hide', note);
                      load();
                    },
                  },
                ]}
              />
            ))
          ) : (
            <p className="text-gray-600">{vi ? 'Không có cảnh báo chờ duyệt.' : 'No alerts waiting.'}</p>
          ))}
        {tab === 'proposals' &&
          (proposals.length ? (
            proposals.map((p) => (
              <SimpleItem
                key={p.id}
                row={{ id: p.id, created_at: p.created_at }}
                vi={vi}
                title={`${p.agent} · ${PROPOSAL_LABEL[p.kind] ? (vi ? PROPOSAL_LABEL[p.kind].vi : PROPOSAL_LABEL[p.kind].en) : p.kind}${
                  p.confidence != null ? ` · ${Math.round(p.confidence * 100)}%` : ''
                }`}
                body={`${p.rationale}${Object.keys(p.payload ?? {}).length ? `\n\n${JSON.stringify(p.payload, null, 2)}` : ''}${
                  p.target_id ? `\n\n${vi ? 'Mục' : 'Target'}: ${p.target_id}` : ''
                }`}
                actions={[
                  {
                    label: vi ? 'Chấp nhận' : 'Accept',
                    primary: true,
                    run: async (note) => {
                      await decideProposal(p.id, 'accepted', note);
                      load();
                    },
                  },
                  {
                    label: vi ? 'Bỏ qua' : 'Dismiss',
                    run: async (note) => {
                      await decideProposal(p.id, 'dismissed', note);
                      load();
                    },
                  },
                ]}
              />
            ))
          ) : (
            <p className="text-gray-600">{vi ? 'Không có đề xuất nào.' : 'No proposals.'}</p>
          ))}
      </div>
    </div>
  );
};

const PROPOSAL_LABEL: Record<string, { vi: string; en: string }> = {
  verify_report: { vi: 'đề xuất xác minh báo cáo', en: 'proposes verifying a report' },
  reject_report: { vi: 'đề xuất từ chối báo cáo', en: 'proposes rejecting a report' },
  publish_alert: { vi: 'đề xuất công khai cảnh báo', en: 'proposes publishing an alert' },
  hide_alert: { vi: 'đề xuất ẩn cảnh báo', en: 'proposes hiding an alert' },
  draft_alert: { vi: 'soạn cảnh báo mới (chấp nhận = tạo bản nháp chưa công khai)', en: 'drafted an alert (accept = create an unpublished draft)' },
  cluster_reports: { vi: 'gom nhóm báo cáo', en: 'grouped reports' },
  takedown_request: { vi: 'đề xuất yêu cầu gỡ trang', en: 'proposes a takedown request' },
};

export default Moderation;
