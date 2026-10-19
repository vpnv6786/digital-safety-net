import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Flag, HelpCircle, LifeBuoy, Share2, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ACTIONS, bankName, type CheckResult as Result, type Entity, type ReasonSource, type VerdictLevel } from '@core/index.ts';

const LEVELS: Record<
  VerdictLevel,
  { icon: React.ElementType; tone: string; vi: string; en: string; subVi: string; subEn: string }
> = {
  danger: {
    icon: XCircle,
    tone: 'border-danger-red bg-danger-red/10 text-danger-red',
    vi: 'Rất nguy hiểm. Dừng lại.',
    en: 'Dangerous. Stop.',
    subVi: 'Nội dung này khớp thủ đoạn lừa đảo đã biết hoặc báo cáo đã xác minh.',
    subEn: 'This matches a known scam script or verified reports.',
  },
  warning: {
    icon: AlertTriangle,
    tone: 'border-warning-orange bg-warning-orange/10 text-orange-700',
    vi: 'Có dấu hiệu lừa đảo',
    en: 'Signs of a scam',
    subVi: 'Hãy dừng lại và xác minh qua kênh chính thức trước khi làm theo.',
    subEn: 'Pause and verify through an official channel before acting.',
  },
  unknown: {
    icon: HelpCircle,
    tone: 'border-slate-400 bg-slate-100 text-slate-700',
    vi: 'Chưa đủ thông tin để kết luận',
    en: 'Not enough information to conclude',
    subVi: 'Chưa có dữ liệu không có nghĩa là an toàn.',
    subEn: 'No data does not mean safe.',
  },
  official: {
    icon: ShieldCheck,
    tone: 'border-trust-blue bg-trust-blue/10 text-trust-blue',
    vi: 'Khớp kênh chính thức',
    en: 'Matches an official channel',
    subVi: 'Vẫn không cung cấp OTP, mật khẩu cho bất kỳ ai.',
    subEn: 'Still, never share an OTP or password with anyone.',
  },
};

const SOURCE_LABEL: Record<ReasonSource, { vi: string; en: string }> = {
  rule: { vi: 'Dấu hiệu trong nội dung', en: 'Signal in the content' },
  community_verified: { vi: 'Báo cáo đã xác minh', en: 'Verified reports' },
  community_unverified: { vi: 'Báo cáo chưa xác minh', en: 'Unverified reports' },
  official_list: { vi: 'Danh sách chính thức', en: 'Official list' },
  external: { vi: 'Nguồn bên ngoài', en: 'External source' },
  ai: { vi: 'AI', en: 'AI' },
  system: { vi: 'Hệ thống', en: 'System' },
};

const KIND_LABEL: Record<Entity['kind'], { vi: string; en: string }> = {
  phone: { vi: 'Số điện thoại', en: 'Phone' },
  url: { vi: 'Trang web', en: 'Website' },
  bank_account: { vi: 'Số tài khoản', en: 'Bank account' },
  email: { vi: 'Email', en: 'Email' },
};

export function entityDisplay(e: Entity): string {
  if (e.kind === 'bank_account') {
    const bank = bankName(e.bankCode);
    return `••••${e.key.slice(-4)}${bank ? ` (${bank})` : ''}`;
  }
  return e.kind === 'url' ? e.key : e.raw;
}

interface CheckResultProps {
  result: Result;
  onReport: (entity?: Entity) => void;
}

const CheckResult: React.FC<CheckResultProps> = ({ result, onReport }) => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const { verdict, entities } = result;
  const level = LEVELS[verdict.level];
  const Icon = level.icon;
  const action = ACTIONS[verdict.action];
  const risky = verdict.level === 'danger' || verdict.level === 'warning';

  const share = async () => {
    const text = vi
      ? `Vệ Binh Mạng: ${level.vi}. ${verdict.reasons[0]?.vi ?? ''} ${action.vi}`
      : `Vệ Binh Mạng: ${level.en}. ${verdict.reasons[0]?.en ?? ''} ${action.en}`;
    try {
      if (navigator.share) {
        await navigator.share({ text, url: window.location.origin });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
        toast.success(vi ? 'Đã sao chép cảnh báo' : 'Warning copied');
      }
    } catch {
      // The person closed the share sheet.
    }
  };

  return (
    <div className="space-y-4" aria-live="polite">
      <Card className={`border-2 ${level.tone}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Icon className="w-10 h-10 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{vi ? level.vi : level.en}</h2>
              <p className="text-sm sm:text-base text-gray-700 mt-1">{vi ? level.subVi : level.subEn}</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-white p-4 border border-gray-200">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              {vi ? 'Làm ngay' : 'Do this now'}
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{vi ? action.vi : action.en}</p>
          </div>

          {verdict.reasons.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{vi ? 'Vì sao' : 'Why'}</div>
              <ul className="space-y-2">
                {verdict.reasons.map((r) => (
                  <li key={r.code} className="flex items-start gap-2 text-sm text-gray-800">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                    <span>
                      {vi ? r.vi : r.en}{' '}
                      <Badge variant="outline" className="ml-1 align-middle text-[11px] font-normal">
                        {vi ? SOURCE_LABEL[r.source].vi : SOURCE_LABEL[r.source].en}
                      </Badge>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {entities.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                {vi ? 'Đã nhận ra trong nội dung' : 'Found in the content'}
              </div>
              <div className="flex flex-wrap gap-2">
                {entities.map((e) => (
                  <Badge key={`${e.kind}:${e.key}`} variant="secondary" className="font-normal">
                    {vi ? KIND_LABEL[e.kind].vi : KIND_LABEL[e.kind].en}: {entityDisplay(e)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button asChild variant={risky ? 'destructive' : 'default'} className="h-auto whitespace-normal py-2 text-left">
              <Link to="/tro-giup">
                <LifeBuoy className="w-4 h-4 mr-2 flex-shrink-0" />
                {vi ? 'Đã lỡ làm theo? Xem cần làm gì ngay' : 'Already did it? What to do now'}
              </Link>
            </Button>
            {entities.length > 0 && (
              <Button variant="outline" onClick={() => onReport(entities[0])}>
                <Flag className="w-4 h-4 mr-2" />
                {vi ? 'Báo cáo lừa đảo' : 'Report scam'}
              </Button>
            )}
            {risky && (
              <Button variant="outline" onClick={share}>
                <Share2 className="w-4 h-4 mr-2" />
                {vi ? 'Chia sẻ cảnh báo cho người thân' : 'Warn your family'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500">
        {vi
          ? 'Không công cụ nào chắc chắn 100%. Kết luận dựa trên dấu hiệu trong nội dung, danh sách tên miền chính thức và báo cáo của cộng đồng. Khi còn nghi ngờ, hãy tự gọi số chính thức hoặc hỏi người thân.'
          : 'No tool is 100% certain. This answer uses signals in the content, official domain lists and community reports. When in doubt, call the official number yourself or ask family.'}
      </p>
    </div>
  );
};

export default CheckResult;
