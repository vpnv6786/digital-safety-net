import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SocialShare from '@/components/SocialShare';
import { QUIZ, QUIZ_ROUND, type QuizItem } from '@/data/quiz';

function pickRound(): QuizItem[] {
  const items = [...QUIZ];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, QUIZ_ROUND);
}

// The practice items are written in Vietnamese only: they reproduce Vietnamese scam scripts.
const Practice = () => {
  const [items, setItems] = useState<QuizItem[]>(pickRound);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const item = items[index];
  const done = index >= items.length;

  const choose = (saysScam: boolean) => {
    if (answer !== null) return;
    setAnswer(saysScam);
    if (saysScam === item.scam) setScore((s) => s + 1);
  };

  const next = () => {
    setAnswer(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setItems(pickRound());
    setIndex(0);
    setScore(0);
    setAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Luyện tập: thật hay lừa đảo?</h1>
        <p className="text-gray-700">
          {QUIZ_ROUND} tin nhắn, cuộc gọi dựa trên các vụ lừa đảo thật được công an, ngân hàng cảnh báo. Mỗi câu chỉ ra một dấu hiệu để bạn tự nhận ra lần sau. Nên làm lại mỗi vài tuần.
        </p>

        {!done ? (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Câu {index + 1}/{items.length}
                </span>
                <Badge variant="outline">{item.channel}</Badge>
              </div>
              <blockquote className="rounded-lg border bg-white p-4 text-gray-900 text-base leading-relaxed">{item.message}</blockquote>

              {answer === null ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button size="lg" variant="destructive" onClick={() => choose(true)}>
                    Lừa đảo
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => choose(false)}>
                    Bình thường
                  </Button>
                </div>
              ) : (
                <div className="space-y-3" role="status">
                  <div className={`flex items-center gap-2 font-semibold ${answer === item.scam ? 'text-green-700' : 'text-danger-red'}`}>
                    {answer === item.scam ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {answer === item.scam ? 'Đúng.' : 'Chưa đúng.'} Đây là {item.scam ? 'lừa đảo' : 'tin bình thường'}.
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dấu hiệu</div>
                    <p className="font-medium text-gray-900">{item.sign}</p>
                  </div>
                  <p className="text-gray-700">{item.explanation}</p>
                  <Button onClick={next}>{index + 1 < items.length ? 'Câu tiếp theo' : 'Xem kết quả'}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="text-3xl font-bold text-gray-900">
                {score}/{items.length} câu đúng
              </div>
              <p className="text-gray-700">
                {score === items.length
                  ? 'Rất tốt. Hãy rủ người thân, nhất là ông bà, cha mẹ, cùng luyện tập.'
                  : 'Kẻ lừa đảo dựa vào sự vội vàng. Khi gặp tin nhắn lạ, dừng lại và kiểm tra trên Vệ Binh Mạng trước khi làm theo.'}
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Không cài ứng dụng theo link hay hướng dẫn qua điện thoại.</li>
                <li>Không đọc mã OTP, mật khẩu cho bất kỳ ai.</li>
                <li>Không chuyển tiền để "xác minh" hay vào "tài khoản an toàn".</li>
                <li>Nghi ngờ thì cúp máy, tự gọi lại số chính thức hoặc người thân.</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button onClick={restart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Làm lượt khác
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Kiểm tra một tin nhắn</Link>
                </Button>
              </div>
              <SocialShare
                title={`Tôi trả lời đúng ${score}/${items.length} câu "thật hay lừa đảo" trên Vệ Binh Mạng`}
                description="Luyện nhận biết lừa đảo trong 2 phút"
                hashtags={['VeBinhMang', 'ChongLuaDao']}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Practice;
