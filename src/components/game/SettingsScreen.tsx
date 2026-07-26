import { useState } from "react";
import { HowToPlay } from "@/components/game/HowToPlay";
import { SFX, setMuted, setSfxVolume } from "@/game/audio";
import { setMusicMuted, setMusicVolume } from "@/game/music";
import { loadSettings, saveSettings } from "@/game/settings";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const initial = loadSettings();
  const [name, setName] = useState(initial.playerName);
  const [music, setMusic] = useState(initial.musicVolume);
  const [sfx, setSfx] = useState(initial.sfxVolume);
  const [muted, setMutedLocal] = useState(initial.muted);
  const [showHelp, setShowHelp] = useState(false);

  const updateSfx = (v: number) => {
    setSfx(v);
    setSfxVolume(v);
    saveSettings({ sfxVolume: v });
    SFX.click();
  };
  const updateMusic = (v: number) => {
    setMusic(v);
    setMusicVolume(v);
    saveSettings({ musicVolume: v });
  };
  const toggleMute = () => {
    const next = !muted;
    setMutedLocal(next);
    setMuted(next);
    setMusicMuted(next);
    saveSettings({ muted: next });
  };

  const save = () => {
    saveSettings({ playerName: name.trim() || "Pahlawan" });
    SFX.click();
    onBack();
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-y-auto bg-gradient-to-b from-sky-200 to-teal-100 p-4 sm:p-8">
      <div className="w-full max-w-md animate-pop-in rounded-2xl border border-white/40 bg-white/90 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">⚙ Pengaturan</h2>
          <button
            onClick={() => {
              SFX.click();
              onBack();
            }}
            aria-label="Tutup pengaturan"
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Player name */}
        <div className="mb-5 space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500">👤 Nama Pemain</label>
          <input
            type="text"
            value={name}
            maxLength={14}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pahlawan"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-400"
          />
          <p className="text-xs text-slate-500">
            Maksimal 14 karakter. Nama kamu akan dipakai di dialog & layar kemenangan!
          </p>
        </div>

        {/* Mute */}
        <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-xs font-bold uppercase text-slate-600">{muted ? "🔇" : "🔊"} Suara</span>
          <button
            onClick={toggleMute}
            className={`rounded-full px-4 py-1 text-xs font-bold text-white transition ${
              muted ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            {muted ? "OFF" : "ON"}
          </button>
        </div>

        {/* SFX volume */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-500">🎮 Volume SFX</label>
            <span className="text-xs font-bold text-slate-600">{Math.round(sfx * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={sfx}
            onChange={(e) => updateSfx(parseFloat(e.target.value))}
            disabled={muted}
            className="w-full accent-sky-500"
          />
        </div>

        {/* Music volume */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-500">🎵 Volume Musik</label>
            <span className="text-xs font-bold text-slate-600">{Math.round(music * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={music}
            onChange={(e) => updateMusic(parseFloat(e.target.value))}
            disabled={muted}
            className="w-full accent-sky-500"
          />
          <p className="text-[10px] text-slate-500">
            🎵 Musik santai untuk menemanimu menjelajah Derawan.
          </p>
        </div>

        {/* Tutorial button */}
        <button
          onClick={() => {
            SFX.click();
            setShowHelp(true);
          }}
          className="mb-4 w-full rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:scale-[1.02] active:translate-y-1"
        >
          📖 Lihat Cara Bermain
        </button>

        {/* Controls info */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h3 className="mb-2 text-xs font-bold uppercase text-slate-500">🎯 Cara Main Singkat</h3>
          <ul className="space-y-1 text-xs text-slate-700">
            <li>💻 <strong>Desktop:</strong> WASD gerak · SPASI serang · E clean wave</li>
            <li>📱 <strong>HP:</strong> Joystick kiri · Tombol kanan untuk serang</li>
            <li>❤️ Jawab <strong>kuis kilat</strong> dengan benar untuk dapat +1 nyawa!</li>
          </ul>
        </div>

        <button
          onClick={save}
          className="w-full rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:translate-y-1"
        >
          ✅ Simpan & Kembali
        </button>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          Derawan Island · Game Edukasi Anak SD
        </p>
      </div>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} showDontShowAgain={false} />}
    </div>
  );
}
