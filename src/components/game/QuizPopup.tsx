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
  const pct = Math.max(0, (timeLeft / timeLimit) * 100);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-auto flex max-h-full w-full max-w-md animate-pop-in flex-col overflow-hidden rounded-3xl border border-white/40 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-amber-300 to-amber-200 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden>{question.emoji}</span>
            <span className="truncate text-xs font-extrabold uppercase tracking-wide text-amber-900">
              Kuis Kilat!
            </span>
          </div>
          {!reveal && (
            <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold tabular-nums text-red-600">
              {Math.ceil(timeLeft)}s
            </span>
          )}
        </div>

        {/* Timer bar */}
        <div className="h-1.5 w-full shrink-0 bg-slate-200">
          {!reveal && (
            <div
              className={`h-full transition-[width] duration-100 ease-linear ${pct < 30 ? "bg-red-500" : "bg-amber-400"}`}
              style={{ width: `${pct}%` }}
            />
          )}
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          <p className="mb-3 text-[15px] font-bold leading-snug text-slate-800 sm:text-base">
            {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isPicked = picked === i;
              const isAnswer = i === question.correctIndex;
              let cls =
                "flex w-full items-start gap-2 rounded-2xl border-2 px-3 py-2.5 text-left text-sm font-medium leading-snug transition-all ";
              if (reveal) {
                if (isAnswer) cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                else if (isPicked) cls += "border-red-400 bg-red-50 text-red-800";
                else cls += "border-slate-200 bg-slate-50 text-slate-400";
              } else {
                cls +=
                  "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 active:scale-[0.99]";
              }
              return (
                <button key={i} disabled={reveal} onClick={() => choose(i)} className={cls}>
                  <span className="shrink-0 font-extrabold text-sky-600">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="min-w-0 break-words">{opt}</span>
                </button>
              );
            })}
          </div>

          {reveal && (
            <div
              className={`mt-3 rounded-2xl border-2 p-3 ${
                isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div className={`text-sm font-extrabold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? "✨ Benar! +1 Nyawa ❤️" : picked === -1 ? "⏰ Waktu Habis!" : "❌ Kurang Tepat"}
              </div>
              <p className="mt-1 text-[13px] leading-snug text-slate-700">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        {reveal && (
          <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
            <button
              onClick={() => onAnswered(isCorrect)}
              className="w-full rounded-2xl bg-gradient-to-b from-sky-500 to-sky-700 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition-all hover:brightness-105 active:translate-y-0.5"
            >
              ▶ Lanjut Main
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
