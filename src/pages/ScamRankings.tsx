import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { communityService, type ScamStatistic } from '@/services/communityService';
import { useLanguage } from '@/contexts/LanguageContext';
import SocialShare from '@/components/SocialShare';

const DANGER_TEXT: Record<string, { vi: string; en: string; variant: 'destructive' | 'secondary' | 'outline' }> = {
  critical: { vi: 'Rất nguy hiểm', en: 'Critical', variant: 'destructive' },
  high: { vi: 'Nguy hiểm', en: 'High', variant: 'destructive' },
  medium: { vi: 'Trung bình', en: 'Medium', variant: 'secondary' },
  low: { vi: 'Thấp', en: 'Low', variant: 'outline' },
};

const ScamRankings = () => {
  const [items, setItems] = useState<ScamStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const vi = language === 'vi';

  useEffect(() => {
    communityService
      .getScamStatistics()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{vi ? 'Thủ đoạn lừa đảo phổ biến' : 'Common scams'}</h1>
          <p className="text-gray-600 mt-2">
            {vi
              ? 'Thứ tự theo xếp hạng tổng kết năm 2025 của Hiệp hội An ninh mạng quốc gia (NCA) và các cảnh báo của công an. Nguồn ghi ở cuối mỗi mục.'
              : 'Ordered by the 2025 ranking of the National Cybersecurity Association (NCA) and police warnings. Sources are noted on each item.'}
          </p>
          <div className="mt-3">
            <SocialShare
              title={vi ? 'Thủ đoạn lừa đảo phổ biến - Vệ Binh Mạng' : 'Common scams - Vệ Binh Mạng'}
              description={vi ? 'Dấu hiệu nhận biết và cách phòng tránh' : 'Warning signs and how to avoid them'}
              hashtags={['VeBinhMang', 'ChongLuaDao']}
            />
          </div>
        </div>

        {loading && <p className="text-gray-600">{vi ? 'Đang tải…' : 'Loading…'}</p>}
        {!loading && items.length === 0 && (
          <p className="text-gray-600">{vi ? 'Chưa tải được danh sách. Vui lòng thử lại sau.' : 'The list could not be loaded. Please try again later.'}</p>
        )}

        {items.map((item, index) => {
          const danger = DANGER_TEXT[item.danger_level] ?? DANGER_TEXT.medium;
          return (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-trust-blue text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                      <Badge variant={danger.variant}>{vi ? danger.vi : danger.en}</Badge>
                      {item.recent_trend === 'increasing' && (
                        <Badge variant="outline" className="text-red-600 border-red-300">
                          <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                          {vi ? 'Đang tăng' : 'Rising'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{vi ? 'Dấu hiệu' : 'Warning signs'}</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {(item.warning_signs ?? []).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{vi ? 'Cách phòng tránh' : 'How to avoid it'}</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {(item.prevention_tips ?? []).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                {item.source_note && (
                  <p className="md:col-span-2 text-xs text-gray-500">
                    {vi ? 'Nguồn' : 'Source'}: {item.source_note}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ScamRankings;
