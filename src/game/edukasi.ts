// Fakta edukatif untuk anak SD — muncul di sela permainan
export interface EduFact {
  emoji: string;
  title: string;
  text: string;
}

export const EDU_FACTS: EduFact[] = [
  {
    emoji: "🐢",
    title: "Tahukah Kamu?",
    text: "Penyu hijau suka bertelur di Pulau Derawan! Kalau ada sampah plastik, mereka bisa kira itu ubur-ubur dan memakannya. 😢",
  },
  {
    emoji: "🥤",
    title: "Sampah Plastik",
    text: "Botol plastik butuh 450 tahun untuk hancur di laut! Lebih baik bawa botol minum sendiri yang bisa dipakai berulang.",
  },
  {
    emoji: "🐠",
    title: "Terumbu Karang",
    text: "Perairan Derawan punya 460+ jenis karang. Sampah dan minyak bisa membuat karang sakit lalu memutih (bleaching).",
  },
  {
    emoji: "♻️",
    title: "Pilah Sampah",
    text: "Pisahkan sampah organik (daun, sisa makanan) dan anorganik (plastik, kaleng). Yang anorganik bisa didaur ulang!",
  },
  {
    emoji: "🌊",
    title: "Ombak Pembawa Sampah",
    text: "Sampah yang dibuang di darat sering terbawa sungai sampai ke laut. Buang sampah di tempatnya, ya!",
  },
  {
    emoji: "🐡",
    title: "Pulau Derawan",
    text: "Pulau Derawan ada di Kalimantan Timur. Tempat ini surga buat penyelam karena lautnya jernih dan biotanya banyak!",
  },
];

export const BOSS_INTRO_FACT: EduFact = {
  emoji: "👑",
  title: "AWAS! Litter King!",
  text: "Ini Raja Sampah! Dia muncul karena banyak sekali sampah dibuang ke laut. Kalahkan dia dengan terus menyerang & gunakan CLEAN WAVE saat penuh!",
};
