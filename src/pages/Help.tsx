import { useState } from 'react';
import { ExternalLink, Phone, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import PoliceReportDraft from '@/components/PoliceReportDraft';
import { useLanguage } from '@/contexts/LanguageContext';
import { RECOVERY_SITUATIONS, VERIFIED_CONTACTS, recoverySteps, type RecoverySituation } from '@core/index.ts';

const Help = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const [situations, setSituations] = useState<RecoverySituation[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const steps = recoverySteps(situations);

  const toggleSituation = (code: RecoverySituation) =>
    setSituations((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));
  const toggleDone = (id: string) =>
    setDone((d) => {
      const next = new Set(d);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-danger-red" aria-hidden="true" />
            {vi ? 'Đã lỡ bị lừa? Làm ngay những việc này' : 'Already scammed? Do this now'}
          </h1>
          <p className="text-gray-600 mt-2">
            {vi
              ? 'Thời gian rất quan trọng: báo ngân hàng càng sớm, khả năng phong toả tiền càng cao.'
              : 'Time matters: the sooner your bank knows, the better the chance to freeze the money.'}
          </p>
        </div>

        <section aria-labelledby="situation-heading" className="space-y-2">
          <h2 id="situation-heading" className="font-semibold text-gray-900">
            {vi ? 'Chuyện gì đã xảy ra? Chọn tất cả những gì đúng với bạn' : 'What happened? Choose everything that applies'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {RECOVERY_SITUATIONS.map((s) => {
              const on = situations.includes(s.code);
              return (
                <button
                  key={s.code}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleSituation(s.code)}
                  className={`rounded-full border px-4 py-2 text-sm text-left transition-colors ${
                    on ? 'bg-trust-blue text-white border-trust-blue' : 'bg-white text-gray-800 border-gray-300 hover:border-trust-blue'
                  }`}
                >
                  {vi ? s.vi : s.en}
                </button>
              );
            })}
          </div>
          {situations.length === 0 && (
            <p className="text-sm text-gray-500">
              {vi ? 'Chưa chọn gì thì hiện tất cả các bước.' : 'With nothing chosen, every step is shown.'}
            </p>
          )}
        </section>

        <ol className="space-y-3" aria-live="polite">
          {steps.map((s, i) => {
            const checked = done.has(s.id);
            return (
              <li key={s.id}>
                <Card className={checked ? 'opacity-60' : undefined}>
                  <CardContent className="p-4 flex gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-trust-blue text-white font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{vi ? s.vi : s.en}</h3>
                      <p className="text-sm text-gray-700 mt-1">{vi ? s.detailVi : s.detailEn}</p>
                      <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <Checkbox checked={checked} onCheckedChange={() => toggleDone(s.id)} />
                        {vi ? 'Đã làm' : 'Done'}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>

        <PoliceReportDraft situations={situations} />

        <Card>
          <CardHeader>
            <CardTitle>{vi ? 'Nơi liên hệ chính thức' : 'Official contacts'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {VERIFIED_CONTACTS.map((c) => (
              <div key={c.id} className="border-b last:border-0 pb-3 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{vi ? c.vi : c.en}</span>
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-trust-blue font-semibold">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      {c.phone}
                    </a>
                  )}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-trust-blue">
                      {new URL(c.url).hostname}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{vi ? c.noteVi : c.noteEn}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {vi ? 'Kiểm tra ngày' : 'Checked on'} {c.verifiedAt} ·{' '}
                  <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {vi ? 'nguồn' : 'source'}
                  </a>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-sm">
            {vi
              ? 'Vệ Binh Mạng không liệt kê số tổng đài ngân hàng: hãy dùng số in trên thẻ hoặc trong ứng dụng chính thức. Kẻ gian thường giả số tổng đài trên mạng.'
              : 'Vệ Binh Mạng does not list bank hotlines: use the number on your card or in the official app. Scammers often post fake hotline numbers online.'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Help;
