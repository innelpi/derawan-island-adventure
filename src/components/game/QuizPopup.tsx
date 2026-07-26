import { useEffect, useState } from "react";
import { QuizQuestion } from "@/game/quiz";

interface QuizPopupProps {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
  timeLimit?: number; // seconds, default 10
}

export function QuizPopup({ question, onAnswered, timeLimit = 10 }: QuizPopupProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (reveal) return;
    if (timeLeft <= 0) {
      setReveal(true);
      setPicked(-1);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 0.1), 100);
    return () => clearTimeout(id);
  }, [timeLeft, reveal]);

  const choose = (i: number) => {
    if (reveal) return;
    setPicked(i);
    setReveal(true);
  };

  const isCorrect = picked === question.correctIndex;
  const pct = (timeLeft / timeLimit) * 100;

  const close = () => onAnswered(isCorrect);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-pop-in rounded-2xl border border-white/30 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden>{question.emoji}</span>
            <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase text-slate-900 shadow-sm">
              Kuis Kilat!
            </span>
          </div>
          {!reveal && (
            <span className="text-sm font-bold text-red-500">
              {Math.ceil(timeLeft)}s
            </span>
          )}
        </div>

        {/* Timer bar */}
        {!reveal && (
          <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all ${pct < 30 ? "bg-red-500 animate-flash" : "bg-amber-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <p className="mb-4 text-base font-semibold leading-relaxed text-slate-800 sm:text-lg">
          {question.question}
        </p>

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = i === question.correctIndex;
            let base = "w-full rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-all active:scale-[0.99] ";
            if (reveal) {
              if (isAnswer) base += "border-emerald-400 bg-emerald-50 text-emerald-800";
              else if (isPicked) base += "border-red-400 bg-red-50 text-red-800";
              else base += "border-slate-200 bg-slate-50 text-slate-400";
            } else {
              base += "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-sky-300";
            }
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => choose(i)}
                className={base}
              >
                <span className="mr-2 font-bold text-sky-600">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {reveal && (
          <div className="mt-4 space-y-3">
            <div
              className={`rounded-xl border-2 p-3 ${
                isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div className={`text-sm font-bold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? "✨ Benar! +1 Nyawa ❤️" : picked === -1 ? "⏰ Waktu Habis!" : "❌ Kurang Tepat"}
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {question.explanation}
              </p>
            </div>
            <button
              onClick={close}
              className="w-full rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:translate-y-1"
            >
              ▶ Lanjut Main
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
