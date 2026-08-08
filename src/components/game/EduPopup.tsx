import { EduFact } from "@/game/edukasi";

interface EduPopupProps {
  fact: EduFact;
  onClose: () => void;
}

export function EduPopup({ fact, onClose }: EduPopupProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-auto flex max-h-full w-full max-w-md animate-pop-in flex-col overflow-hidden rounded-3xl border border-white/40 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
        <div className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-emerald-300 to-emerald-200 px-4 py-2.5">
          <span className="text-2xl leading-none" aria-hidden>{fact.emoji}</span>
          <span className="truncate text-xs font-extrabold uppercase tracking-wide text-emerald-900">
            {fact.title}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{fact.text}</p>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-5">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:brightness-105 active:translate-y-0.5"
          >
            ▶ Lanjut Main
          </button>
        </div>
      </div>
    </div>
  );
}
