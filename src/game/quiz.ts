// Kuis edukatif jawab cepat — anak SD friendly
export interface QuizQuestion {
  emoji: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_BANK: QuizQuestion[] = [
  {
    emoji: "🐢",
    question: "Penyu sering tertukar makan plastik karena dikira apa?",
    options: ["Ubur-ubur", "Pasir", "Karang"],
    correctIndex: 0,
    explanation: "Plastik bening melayang mirip ubur-ubur, makanan favorit penyu!",
  },
  {
    emoji: "🥤",
    question: "Berapa lama botol plastik hancur di laut?",
    options: ["1 tahun", "10 tahun", "450 tahun"],
    correctIndex: 2,
    explanation: "Butuh ratusan tahun! Makanya bawa botol minum sendiri ya.",
  },
  {
    emoji: "🪸",
    question: "Apa yang membuat terumbu karang memutih (bleaching)?",
    options: ["Air bersih", "Polusi & panas", "Ikan kecil"],
    correctIndex: 1,
    explanation: "Polusi & suhu air yang panas bikin karang stres lalu memutih.",
  },
  {
    emoji: "♻️",
    question: "Sampah mana yang bisa didaur ulang?",
    options: ["Sisa makanan", "Kaleng & botol", "Daun kering"],
    correctIndex: 1,
    explanation: "Sampah anorganik seperti kaleng, botol, dan kertas bisa didaur ulang!",
  },
  {
    emoji: "🌊",
    question: "Kalau buang sampah di sungai, sampahnya akan ke mana?",
    options: ["Hilang sendiri", "Jadi tanah", "Sampai ke laut"],
    correctIndex: 2,
    explanation: "Sungai mengalir ke laut, jadi sampah ikut terbawa sampai ke samudera!",
  },
  {
    emoji: "🐠",
    question: "Pulau Derawan ada di provinsi mana?",
    options: ["Bali", "Kalimantan Timur", "Papua"],
    correctIndex: 1,
    explanation: "Pulau Derawan terletak di Kalimantan Timur, terkenal dengan biota lautnya!",
  },
  {
    emoji: "🦈",
    question: "Hewan langka apa yang sering muncul di Derawan?",
    options: ["Hiu paus", "Pinguin", "Beruang kutub"],
    correctIndex: 0,
    explanation: "Hiu paus (whale shark) suka berenang di perairan Derawan & Maratua!",
  },
  {
    emoji: "🎣",
    question: "Apa bahaya 'jaring hantu' (ghost net) di laut?",
    options: ["Ikan terjebak", "Membuat ombak", "Bikin laut bersih"],
    correctIndex: 0,
    explanation: "Jaring nelayan yang terbuang menjebak ikan, penyu, & lumba-lumba.",
  },
  {
    emoji: "🛢️",
    question: "Tumpahan oli di laut menyebabkan apa?",
    options: ["Air jadi manis", "Hewan laut keracunan", "Karang tumbuh cepat"],
    correctIndex: 1,
    explanation: "Oli menutupi permukaan air, ikan & burung laut bisa keracunan.",
  },
  {
    emoji: "🌱",
    question: "Bagaimana cara terbaik mengurangi sampah plastik?",
    options: ["Dibuang ke laut", "Pakai berulang kali", "Dibakar di rumah"],
    correctIndex: 1,
    explanation: "Pakai botol & tas yang bisa dipakai berulang kali (reusable)!",
  },
];

// Shuffle helper — returns a new shuffled copy
export function shuffleQuiz(): QuizQuestion[] {
  const arr = [...QUIZ_BANK];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
