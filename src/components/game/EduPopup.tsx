import { EduFact } from "@/game/edukasi";

interface EduPopupProps {
  fact: EduFact;
  onClose: () => void;
}

export function EduPopup({ fact, onClose }: EduPopupProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-pop-in rounded-2xl border border-white/30 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-3xl" aria-hidden>{fact.emoji}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase text-emerald-800">
            {fact.title}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
          {fact.text}
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:translate-y-1"
        >
          ▶ Lanjut Main
        </button>
      </div>
    </div>
  );
}
