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

  // Countdown
  useEffect(() => {
    if (reveal) return;
    if (timeLeft <= 0) {
      setReveal(true);
      setPicked(-1); // timeout = wrong
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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-pop-in rounded-md border-4 border-foreground bg-card p-5 shadow-pixel-lg">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden>{question.emoji}</span>
            <span className="rounded border-2 border-foreground bg-secondary px-2 py-0.5 font-pixel text-[9px] uppercase text-secondary-foreground sm:text-[10px]">
              KUIS KILAT!
            </span>
          </div>
          {!reveal && (
            <span className="font-pixel text-xs text-destructive">
              {Math.ceil(timeLeft)}s
            </span>
          )}
        </div>

        {/* Timer bar */}
        {!reveal && (
          <div className="mb-3 h-2 w-full overflow-hidden rounded-sm border-2 border-foreground bg-foreground/30">
            <div
              className={`h-full transition-all ${pct < 30 ? "bg-destructive animate-flash" : "bg-warning"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        <p className="mb-4 font-body text-sm font-semibold leading-relaxed text-card-foreground sm:text-base">
          {question.question}
        </p>

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = i === question.correctIndex;
            let cls =
              "w-full rounded border-4 border-foreground bg-background px-3 py-2 text-left font-body text-sm transition-all hover:bg-muted active:translate-y-0.5";
            if (reveal) {
              if (isAnswer) cls += " bg-success text-white border-foreground";
              else if (isPicked) cls += " bg-destructive text-white";
              else cls += " opacity-60";
            }
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => choose(i)}
                className={cls}
              >
                <span className="mr-2 font-pixel text-[10px]">
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
              className={`rounded border-4 border-foreground p-3 ${
                isCorrect ? "bg-success/20" : "bg-destructive/20"
              }`}
            >
              <div className="font-pixel text-xs">
                {isCorrect ? "✨ BENAR! +1 NYAWA ❤️" : picked === -1 ? "⏰ WAKTU HABIS!" : "❌ KURANG TEPAT"}
              </div>
              <p className="mt-1 font-body text-xs text-card-foreground sm:text-sm">
                {question.explanation}
              </p>
            </div>
            <button
              onClick={close}
              className="pixel-btn w-full rounded border-4 border-foreground bg-primary px-4 py-3 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
            >
              ▶ LANJUT MAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
