import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, Flag, ImageIcon, LifeBuoy, Loader2, Search, Share, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CheckResult from './CheckResult';
import ReportForm from './ReportForm';
import SocialShare from './SocialShare';
import { useLanguage } from '@/contexts/LanguageContext';
import { checkInput, prepareScreenshot, ScreenshotUnavailableError, type CheckOutcome, type ScreenshotInput } from '@/services/checkService';
import { BANKS, type Entity } from '@core/index.ts';

const EXAMPLES = [
  {
    vi: 'Tin nhắn mạo danh công an',
    en: 'Fake police message',
    text: 'Công an phường thông báo: tài khoản định danh mức 2 của bạn bị lỗi. Vui lòng tải ứng dụng VNeID mới tại link vneid-capnhat.online để cập nhật trong 24 giờ.',
  },
  { vi: 'Link giả ngân hàng', en: 'Fake bank link', text: 'vietcombank-hotro.com' },
  {
    vi: 'Việc làm online',
    en: 'Online job offer',
    text: 'Tuyển CTV làm nhiệm vụ trên app, hoa hồng 10-30% mỗi đơn. Nạp tiền để nhận nhiệm vụ tiếp theo và rút cả gốc lẫn lãi.',
  },
];

const LEVEL_GUIDE = [
  { dot: 'bg-danger-red', vi: 'Rất nguy hiểm', en: 'Dangerous', noteVi: 'Khớp kịch bản lừa đảo đã biết hoặc báo cáo đã kiểm duyệt.', noteEn: 'Matches a known scam script or moderator-verified reports.' },
  { dot: 'bg-warning-orange', vi: 'Có dấu hiệu lừa đảo', en: 'Signs of a scam', noteVi: 'Có dấu hiệu đáng ngờ hoặc nhiều người báo cáo chưa xác minh.', noteEn: 'Suspicious signals or several unverified reports.' },
  { dot: 'bg-slate-400', vi: 'Chưa đủ thông tin', en: 'Not enough information', noteVi: 'Mặc định khi chưa có dữ liệu. Không có nghĩa là an toàn.', noteEn: 'The default when there is no data. It does not mean safe.' },
  { dot: 'bg-trust-blue', vi: 'Khớp kênh chính thức', en: 'Official channel', noteVi: 'Tên miền chính thức của ngân hàng, cơ quan nhà nước (.gov.vn).', noteEn: 'Official domain of a bank or a government body (.gov.vn).' },
];

const HomePage = () => {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const [tab, setTab] = useState<'check' | 'report'>('check');
  const [input, setInput] = useState('');
  const [bankCode, setBankCode] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckOutcome | null>(null);
  const [screenshot, setScreenshot] = useState<{ preview: string; data: ScreenshotInput } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [reportPrefill, setReportPrefill] = useState<Entity | undefined>();
  const resultRef = useRef<HTMLDivElement>(null);

  const digitsOnly = /^[\d\s.-]{6,}$/.test(input.trim());

  const pickScreenshot = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const data = await prepareScreenshot(file);
      setScreenshot({ preview: `data:${data.mediaType};base64,${data.base64}`, data });
    } catch {
      setError(vi ? 'Không mở được ảnh này.' : 'This image could not be opened.');
    }
  };

  const runCheck = async (text = input) => {
    if (!text.trim() && !screenshot) return;
    setChecking(true);
    setError(null);
    try {
      setResult(await checkInput(text, { bankCode: digitsOnly ? bankCode : undefined, image: screenshot?.data }));
    } catch (e) {
      setResult(null);
      setError(
        e instanceof ScreenshotUnavailableError
          ? vi
            ? 'Chưa đọc được ảnh lúc này. Bạn có thể gõ hoặc dán lại nội dung tin nhắn để kiểm tra.'
            : 'The screenshot cannot be read right now. You can type or paste the message text instead.'
          : vi
            ? 'Chưa kiểm tra được. Vui lòng thử lại.'
            : 'The check failed. Please try again.',
      );
    } finally {
      setChecking(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  };

  const startReport = (entity?: Entity) => {
    setReportPrefill(entity);
    setTab('report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <section className="px-4 pt-8 pb-6 sm:pt-14 text-center">
        <div className="max-w-3xl mx-auto">
          <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-trust-blue mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3">Vệ Binh Mạng</h1>
          <p className="text-lg sm:text-2xl text-gray-800 font-medium">
            {vi ? 'Hỏi trước khi chuyển tiền, cài app hay bấm link.' : 'Ask before you pay, install an app or tap a link.'}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-3">
            {vi
              ? 'Dán tin nhắn, số điện thoại, link, email hoặc số tài khoản. Bạn sẽ biết có dấu hiệu lừa đảo không và nên làm gì ngay.'
              : 'Paste a message, phone number, link, email or bank account. You will see whether it shows signs of a scam and what to do now.'}
          </p>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex gap-2" role="tablist">
                <Button role="tab" aria-selected={tab === 'check'} variant={tab === 'check' ? 'default' : 'outline'} onClick={() => setTab('check')}>
                  <Search className="w-4 h-4 mr-2" />
                  {vi ? 'Kiểm tra' : 'Check'}
                </Button>
                <Button role="tab" aria-selected={tab === 'report'} variant={tab === 'report' ? 'default' : 'outline'} onClick={() => startReport(undefined)}>
                  <Flag className="w-4 h-4 mr-2" />
                  {vi ? 'Báo cáo lừa đảo' : 'Report a scam'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tab === 'check' ? (
                <div className="space-y-4">
                  <Label htmlFor="check-input" className="sr-only">
                    {vi ? 'Nội dung cần kiểm tra' : 'Content to check'}
                  </Label>
                  <Textarea
                    id="check-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runCheck();
                    }}
                    rows={4}
                    className="text-base"
                    placeholder={
                      vi
                        ? 'Dán tin nhắn, số điện thoại, link, email hoặc số tài khoản…'
                        : 'Paste a message, phone number, link, email or bank account…'
                    }
                  />
                  {digitsOnly && (
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-600">
                        {vi ? 'Nếu đây là số tài khoản, chọn ngân hàng (không bắt buộc)' : 'If this is a bank account, choose the bank (optional)'}
                      </Label>
                      <Select value={bankCode} onValueChange={setBankCode}>
                        <SelectTrigger className="sm:w-72">
                          <SelectValue placeholder={vi ? 'Ngân hàng' : 'Bank'} />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS.map((b) => (
                            <SelectItem key={b.code} value={b.code}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        pickScreenshot(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {vi ? 'Thêm ảnh chụp màn hình' : 'Add a screenshot'}
                    </Button>
                    {screenshot && (
                      <div className="relative">
                        <img src={screenshot.preview} alt={vi ? 'Ảnh chụp màn hình đã chọn' : 'Selected screenshot'} className="h-16 rounded border" />
                        <button
                          type="button"
                          aria-label={vi ? 'Bỏ ảnh' : 'Remove screenshot'}
                          className="absolute -top-2 -right-2 rounded-full bg-white border p-0.5"
                          onClick={() => setScreenshot(null)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      {vi
                        ? 'Ảnh được gửi lên máy chủ và mô hình AI để đọc chữ, không được lưu lại.'
                        : 'The image is sent to our server and an AI model to read the text; it is not stored.'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <Button onClick={() => runCheck()} disabled={(!input.trim() && !screenshot) || checking} size="lg">
                      {checking ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                      {vi ? 'Kiểm tra' : 'Check'}
                    </Button>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="text-gray-500 self-center">{vi ? 'Thử ví dụ:' : 'Try:'}</span>
                      {EXAMPLES.map((ex) => (
                        <Button
                          key={ex.en}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInput(ex.text);
                            runCheck(ex.text);
                          }}
                        >
                          {vi ? ex.vi : ex.en}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <p role="alert" className="text-sm text-danger-red">
                      {error}
                    </p>
                  )}
                  <div ref={resultRef}>{result && <CheckResult result={result} onReport={startReport} />}</div>
                </div>
              ) : (
                <ReportForm
                  key={reportPrefill ? `${reportPrefill.kind}:${reportPrefill.key}` : 'blank'}
                  initialKind={reportPrefill?.kind}
                  initialValue={reportPrefill ? (reportPrefill.kind === 'bank_account' ? reportPrefill.key : reportPrefill.raw) : ''}
                  initialBankCode={reportPrefill?.bankCode}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/tro-giup" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow border-danger-red/40">
              <CardContent className="p-5">
                <LifeBuoy className="w-7 h-7 text-danger-red mb-2" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900">{vi ? 'Đã lỡ bị lừa? Làm gì ngay' : 'Already scammed? Act now'}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {vi ? 'Các bước trong giờ đầu tiên và nơi trình báo chính thức.' : 'Steps for the first hour and official places to report.'}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/scam-rankings" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <BookOpen className="w-7 h-7 text-trust-blue mb-2" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900">{vi ? 'Thủ đoạn phổ biến' : 'Common scams'}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {vi ? 'Dấu hiệu nhận biết và cách phòng tránh, có dẫn nguồn.' : 'Warning signs and prevention, with sources.'}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/community-alerts" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <AlertTriangle className="w-7 h-7 text-trust-blue mb-2" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900">{vi ? 'Cảnh báo cộng đồng' : 'Community alerts'}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {vi ? 'Chỉ hiển thị cảnh báo đã được kiểm duyệt.' : 'Only moderator-reviewed alerts are shown.'}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <section className="px-4 py-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{vi ? 'Vệ Binh Mạng kết luận thế nào' : 'How Vệ Binh Mạng decides'}</h2>
          <p className="text-gray-600 mb-5 text-sm sm:text-base">
            {vi
              ? 'Có bốn mức. Không có mức "an toàn": khi chưa có dữ liệu, câu trả lời luôn là "chưa đủ thông tin".'
              : 'There are four answers. There is no "safe": without data, the answer is always "not enough information".'}
          </p>
          <ul className="space-y-3">
            {LEVEL_GUIDE.map((l) => (
              <li key={l.en} className="flex items-start gap-3">
                <span className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${l.dot}`} aria-hidden="true" />
                <div>
                  <div className="font-semibold text-gray-900">{vi ? l.vi : l.en}</div>
                  <div className="text-sm text-gray-600">{vi ? l.noteVi : l.noteEn}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-6">
            {vi
              ? 'Nội dung bạn dán được gửi tới máy chủ Vệ Binh Mạng để kiểm tra: tra báo cáo cộng đồng, danh sách link nguy hiểm của Google, tuổi tên miền, và khi được bật, một mô hình AI giải thích. Nội dung không được lưu lại. Nếu máy chủ không phản hồi, việc kiểm tra chạy ngay trên trình duyệt.'
              : 'What you paste is sent to the Vệ Binh Mạng server to check community reports, Google’s dangerous-link list, domain age and, when enabled, an AI explanation. It is not stored. If the server does not answer, the check runs in your browser.'}
          </p>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Share className="w-5 h-5 text-trust-blue" aria-hidden="true" />
            <h3 className="font-semibold text-gray-900">{vi ? 'Chia sẻ cho người thân' : 'Share with your family'}</h3>
          </div>
          <SocialShare
            title={vi ? 'Vệ Binh Mạng - Hỏi trước khi chuyển tiền' : 'Vệ Binh Mạng - Ask before you pay'}
            description={vi ? 'Kiểm tra tin nhắn, số điện thoại, link có dấu hiệu lừa đảo' : 'Check messages, numbers and links for scam signs'}
            hashtags={['VeBinhMang', 'ChongLuaDao']}
            className="justify-center"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
