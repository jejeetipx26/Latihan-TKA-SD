'use client';

import React, { useState } from 'react';
import {
  BookOpen, Edit3, CheckCircle, ArrowRight, Home, RefreshCcw, Award,
  User, Calculator, Crown, Users, LogOut, Mail, CheckSquare, ListChecks,
  LayoutGrid, ChevronRight, PlayCircle, BarChart3, TrendingUp, Calendar,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 👇 1. IMPORT DARI ACTIONS (JANGAN LUPA UNCOMMENT DI PROJECT ASLI)
import { loginUser, submitScore, getScores } from './actions';

// --- DATA SOAL HARI 1 (TETAP SAMA) ---
const QUESTIONS_DAY1 = [
  // A. PG SEDERHANA (1-5)
  {
    id: 1, type: 'single',
    question: "Hasil dari 250 + 175 - 125 = ...",
    options: ["200", "250", "300", "325"],
    correctAnswer: "300",
    discussion: "250 + 175 = 425. Kemudian 425 - 125 = 300."
  },
  {
    id: 2, type: 'single',
    question: "Hasil dari 36 × 4 = ...",
    options: ["124", "144", "146", "164"],
    correctAnswer: "144",
    discussion: "36 dikali 4 sama dengan 144."
  },
  {
    id: 3, type: 'single',
    question: "Hasil dari 480 : 6 = ...",
    options: ["60", "70", "80", "90"],
    correctAnswer: "80",
    discussion: "48 dibagi 6 adalah 8, jadi 480 dibagi 6 adalah 80."
  },
  {
    id: 4, type: 'single',
    question: "Hasil dari 90 - 36 + 12 = ...",
    options: ["54", "66", "72", "78"],
    correctAnswer: "66",
    discussion: "Kerjakan dari kiri: 90 - 36 = 54. Lalu 54 + 12 = 66."
  },
  {
    id: 5, type: 'single',
    question: "Di sebuah toko terdapat 120 pensil. Pensil tersebut dibagikan sama banyak ke dalam 6 kotak. Jumlah pensil di setiap kotak adalah ...",
    options: ["15", "18", "20", "24"],
    correctAnswer: "20",
    discussion: "120 pensil dibagi 6 kotak = 20 pensil per kotak."
  },
  // B. PG KOMPLEKS (6-10)
  {
    id: 6, type: 'multiple',
    question: "Manakah hasil yang benar dari operasi berikut? (Pilih semua yang benar)",
    options: ["45 + 25 = 70", "64 : 8 = 8", "9 × 6 = 56", "100 - 45 = 55"],
    correctAnswer: ["45 + 25 = 70", "64 : 8 = 8", "100 - 45 = 55"],
    discussion: "9 × 6 seharusnya 54, bukan 56. Pilihan lainnya benar."
  },
  {
    id: 7, type: 'multiple',
    question: "Perhatikan pernyataan berikut, pilih operasi yang BENAR!",
    options: ["72 : 9 = 8", "15 × 4 = 60", "90 - 35 = 65", "48 + 22 = 80"],
    correctAnswer: ["72 : 9 = 8", "15 × 4 = 60", "90 - 35 = 65"],
    discussion: "48 + 22 seharusnya 70, bukan 80."
  },
  {
    id: 8, type: 'multiple',
    question: "Pilih operasi hitung yang hasilnya lebih dari 50!",
    options: ["6 × 9", "80 - 25", "100 : 5", "42 + 8"],
    correctAnswer: ["6 × 9", "80 - 25", "42 + 8"],
    discussion: "6x9=54 (>50), 80-25=55 (>50), 42+8=50 (Termasuk/Pas). 100:5=20 (Kurang dari 50)."
  },
  {
    id: 9, type: 'multiple',
    question: "Pilih semua operasi yang hasilnya 30!",
    options: ["5 × 6", "60 : 2", "25 + 5", "40 - 10"],
    correctAnswer: ["5 × 6", "60 : 2", "25 + 5", "40 - 10"],
    discussion: "Semua operasi di atas menghasilkan angka 30."
  },
  {
    id: 10, type: 'multiple',
    question: "Ibu membeli 4 kotak kue. Setiap kotak berisi 12 kue. Manakah pernyataan yang benar?",
    options: ["Jumlah kue seluruhnya adalah 48", "Operasi yang digunakan adalah perkalian", "Operasi yang digunakan adalah pembagian", "Jumlah kue kurang dari 40"],
    correctAnswer: ["Jumlah kue seluruhnya adalah 48", "Operasi yang digunakan adalah perkalian"],
    discussion: "4 x 12 = 48 kue. Menggunakan perkalian. Jumlahnya lebih dari 40."
  },
  // C. KATEGORI (11-15)
  {
    id: 11, type: 'bs_complex',
    question: "Kelompokkan operasi berikut ke kategori yang tepat!",
    subQuestions: [
      { text: "6 × 7", options: ["Penjumlahan", "Perkalian"], correct: "Perkalian" },
      { text: "56 : 8", options: ["Pembagian", "Pengurangan"], correct: "Pembagian" },
      { text: "40 + 25", options: ["Penjumlahan", "Perkalian"], correct: "Penjumlahan" }
    ],
    discussion: "Simbol (×) adalah perkalian, (:) adalah pembagian, (+) adalah penjumlahan."
  },
  {
    id: 12, type: 'bs_complex',
    question: "Tentukan hasil operasi berikut!",
    subQuestions: [
      { text: "9 × 5", options: ["< 40", "= 45", "> 50"], correct: "= 45" },
      { text: "64 : 8", options: ["6", "8", "10"], correct: "8" }
    ],
    discussion: "9 x 5 = 45. 64 : 8 = 8."
  },
  {
    id: 13, type: 'bs_complex',
    question: "Kelompokkan pernyataan berikut berdasarkan tandanya!",
    subQuestions: [
      { text: "Menggunakan tanda '×'", options: ["Perkalian", "Pembagian"], correct: "Perkalian" },
      { text: "Menggunakan tanda ':'", options: ["Pembagian", "Pengurangan"], correct: "Pembagian" }
    ],
    discussion: "Tanda silang untuk kali, titik dua untuk bagi."
  },
  {
    id: 14, type: 'bs_complex',
    question: "Ani memiliki 36 permen dan membaginya sama rata kepada 9 teman.",
    subQuestions: [
      { text: "Operasi yang digunakan", options: ["Pembagian", "Perkalian"], correct: "Pembagian" },
      { text: "Jumlah permen tiap anak", options: ["3", "4", "5"], correct: "4" }
    ],
    discussion: "Membagi sama rata berarti pembagian. 36 : 9 = 4 permen."
  },
  {
    id: 15, type: 'bs_complex',
    question: "Kelompokkan operasi berikut berdasarkan jenisnya!",
    subQuestions: [
      { text: "50 - 18", options: ["Pengurangan", "Penjumlahan"], correct: "Pengurangan" },
      { text: "7 × 8", options: ["Perkalian", "Pembagian"], correct: "Perkalian" }
    ],
    discussion: "Tanda (-) adalah pengurangan. Tanda (×) adalah perkalian."
  }
];

// --- DATA SOAL HARI 2 (TETAP SAMA) ---
const QUESTIONS_DAY2 = [
  // A. Pilihan Ganda Sederhana (1-7)
  {
    id: 1, type: 'single',
    question: "Faktor dari bilangan 10 adalah …",
    options: ["1, 2, 5, 10", "1, 3, 5, 10", "2, 4, 6, 8", "5, 10, 15"],
    correctAnswer: "1, 2, 5, 10",
    discussion: "Faktor 10 adalah 1, 2, 5, 10."
  },
  {
    id: 2, type: 'single',
    question: "Kelipatan dari bilangan 6 yang benar adalah …",
    options: ["6, 12, 18", "6, 10, 14", "1, 2, 3", "5, 10, 15"],
    correctAnswer: "6, 12, 18",
    discussion: "Kelipatan 6: 6, 12, 18, 24, ..."
  },
  {
    id: 3, type: 'single',
    question: "KPK dari 4 dan 6 adalah …",
    options: ["8", "10", "12", "24"],
    correctAnswer: "12",
    discussion: "Kelipatan 4: 4, 8, 12. Kelipatan 6: 6, 12. KPK = 12."
  },
  {
    id: 4, type: 'single',
    question: "FPB dari 12 dan 16 adalah …",
    options: ["2", "4", "6", "8"],
    correctAnswer: "4",
    discussion: "Faktor 12: 1,2,3,4,6,12. Faktor 16: 1,2,4,8,16. FPB = 4."
  },
  {
    id: 5, type: 'single',
    question: "Kelipatan persekutuan terkecil dari 3 dan 5 adalah …",
    options: ["10", "15", "20", "30"],
    correctAnswer: "15",
    discussion: "Kelipatan 3: 3,6,9,12,15. Kelipatan 5: 5,10,15. KPK = 15."
  },
  {
    id: 6, type: 'single',
    question: "Faktor persekutuan terbesar dari 18 dan 24 adalah …",
    options: ["3", "6", "12", "18"],
    correctAnswer: "6",
    discussion: "Faktor 18: ...6,9,18. Faktor 24: ...6,8,12,24. FPB = 6."
  },
  {
    id: 7, type: 'single',
    question: "Dua lampu menyala setiap 6 menit dan 8 menit. Lampu akan menyala bersama kembali setelah … menit.",
    options: ["12", "16", "24", "48"],
    correctAnswer: "24",
    discussion: "Cari KPK 6 dan 8. KPK = 24."
  },

  // B. Pilihan Ganda Kompleks (8-11)
  {
    id: 8, type: 'multiple',
    question: "Pilih SEMUA faktor dari bilangan 12!",
    options: ["1", "2", "5", "6"],
    correctAnswer: ["1", "2", "6"],
    discussion: "Faktor 12: 1, 2, 3, 4, 6, 12. (5 bukan faktor)."
  },
  {
    id: 9, type: 'multiple',
    question: "Pilih SEMUA kelipatan dari bilangan 5!",
    options: ["10", "15", "18", "20"],
    correctAnswer: ["10", "15", "20"],
    discussion: "Kelipatan 5 selalu berakhiran 0 atau 5."
  },
  {
    id: 10, type: 'multiple',
    question: "Berikut ini yang merupakan kelipatan persekutuan dari 4 dan 8 adalah …",
    options: ["8", "12", "16", "20"],
    correctAnswer: ["8", "16"],
    discussion: "Kelipatan 4 & 8: 8, 16, 24. (12 dan 20 bukan kelipatan 8)."
  },
  {
    id: 11, type: 'multiple',
    question: "Faktor persekutuan dari 12 dan 18 adalah …",
    options: ["1", "2", "3", "6"],
    correctAnswer: ["1", "3", "6"],
    discussion: "Faktor yang sama dari 12 dan 18."
  },

  // C. KATEGORI / Soal Cerita (12-15)
  // Menggunakan type 'single' karena pilihannya hanya KPK atau FPB
  {
    id: 12, type: 'single',
    question: "Ibu memiliki 20 apel dan 30 jeruk. Buah akan dibagikan sama banyak tanpa sisa. Soal ini menggunakan …",
    options: ["KPK", "FPB"],
    correctAnswer: "FPB",
    discussion: "Kata kunci: 'dibagi sama banyak', 'tanpa sisa' = FPB."
  },
  {
    id: 13, type: 'single',
    question: "Dua anak berlatih renang. Ani setiap 4 hari, Budi setiap 6 hari. Mereka akan berlatih bersama lagi. Soal ini menggunakan …",
    options: ["KPK", "FPB"],
    correctAnswer: "KPK",
    discussion: "Kata kunci: 'bersama lagi', 'setiap...hari' = KPK."
  },
  {
    id: 14, type: 'single',
    question: "Terdapat 24 pensil dan 36 buku. Akan dibagi sama banyak ke beberapa anak. Soal ini termasuk …",
    options: ["KPK", "FPB"],
    correctAnswer: "FPB",
    discussion: "Membagi barang sama rata = FPB."
  },
  {
    id: 15, type: 'single',
    question: "Bel sekolah berbunyi setiap 10 menit dan bel kantin setiap 15 menit. Kapan kedua bel berbunyi bersama? Soal ini menggunakan …",
    options: ["KPK", "FPB"],
    correctAnswer: "KPK",
    discussion: "Kejadian berulang waktu = KPK."
  }
];

// --- DATA SOAL HARI 3 (TETAP SAMA) ---
const QUESTIONS_DAY3 = [
  // A. Pilihan Ganda Sederhana (1-7)
  {
    id: 1, type: 'single',
    question: "Pecahan yang senilai dengan 1/2 adalah …",
    options: ["2/3", "2/4", "3/5", "3/4"],
    correctAnswer: "2/4",
    discussion: "1/2 jika dikalikan 2 (atas dan bawah) menjadi 2/4."
  },
  {
    id: 2, type: 'single',
    question: "Pecahan senilai dari 2/3 adalah …",
    options: ["3/4", "4/6", "6/5", "3/6"],
    correctAnswer: "4/6",
    discussion: "2/3 jika dikalikan 2 menjadi 4/6."
  },
  {
    id: 3, type: 'single',
    question: "Bentuk paling sederhana dari 6/8 adalah …",
    options: ["2/4", "3/4", "4/6", "1/2"],
    correctAnswer: "3/4",
    discussion: "6 dan 8 sama-sama dibagi 2 hasilnya 3/4."
  },
  {
    id: 4, type: 'single',
    question: "Bentuk paling sederhana dari 10/20 adalah …",
    options: ["2/4", "1/4", "1/2", "2/5"],
    correctAnswer: "1/2",
    discussion: "10 dan 20 sama-sama dibagi 10 hasilnya 1/2."
  },
  {
    id: 5, type: 'single',
    question: "Jika pembilang dan penyebut dikalikan dengan bilangan yang sama, maka pecahan tersebut akan menjadi …",
    options: ["Pecahan lebih besar", "Pecahan lebih kecil", "Pecahan senilai", "Pecahan tidak berubah"],
    correctAnswer: "Pecahan senilai",
    discussion: "Definisi pecahan senilai adalah mengalikan/membagi dengan angka sama."
  },
  {
    id: 6, type: 'single',
    question: "Pecahan 3/6 jika disederhanakan menjadi …",
    options: ["3/6", "2/3", "1/2", "1/3"],
    correctAnswer: "1/2",
    discussion: "3 dan 6 sama-sama dibagi 3 hasilnya 1/2."
  },
  {
    id: 7, type: 'single',
    question: "Andi memakan 4 dari 12 potong kue. Pecahan paling sederhana dari kue yang dimakan Andi adalah …",
    options: ["4/12", "3/6", "2/6", "1/3"],
    correctAnswer: "1/3",
    discussion: "4/12 disederhanakan (bagi 4) menjadi 1/3."
  },

  // B. Pilihan Ganda Kompleks (8-11)
  {
    id: 8, type: 'multiple',
    question: "Pilih SEMUA pecahan yang senilai dengan 1/2!",
    options: ["2/4", "3/6", "2/3", "4/8"],
    correctAnswer: ["2/4", "3/6", "4/8"],
    discussion: "2/4, 3/6, dan 4/8 semuanya bernilai setengah."
  },
  {
    id: 9, type: 'multiple',
    question: "Pecahan berikut yang dapat disederhanakan adalah …",
    options: ["6/9", "3/5", "8/12", "4/4"],
    correctAnswer: ["6/9", "8/12", "4/4"],
    discussion: "3/5 sudah paling sederhana. Sisanya bisa disederhanakan."
  },
  {
    id: 10, type: 'multiple',
    question: "Hasil penyederhanaan yang benar adalah …",
    options: ["6/8 = 3/4", "10/20 = 1/2", "9/12 = 3/5", "4/6 = 2/3"],
    correctAnswer: ["6/8 = 3/4", "10/20 = 1/2", "4/6 = 2/3"],
    discussion: "9/12 seharusnya 3/4 (bukan 3/5)."
  },
  {
    id: 11, type: 'multiple',
    question: "Berikut ini yang merupakan pecahan senilai adalah …",
    options: ["2/3 dan 4/6", "1/4 dan 2/8", "3/5 dan 6/10", "2/5 dan 4/9"],
    correctAnswer: ["2/3 dan 4/6", "1/4 dan 2/8", "3/5 dan 6/10"],
    discussion: "2/5 tidak senilai dengan 4/9."
  },

  // C. Kategori (12-15)
  {
    id: 12, type: 'single',
    question: "Mengubah 6/8 menjadi 3/4 termasuk …",
    options: ["Pecahan senilai", "Menyederhanakan pecahan"],
    correctAnswer: "Menyederhanakan pecahan",
    discussion: "Karena angkanya menjadi lebih kecil."
  },
  {
    id: 13, type: 'single',
    question: "Mengubah 2/3 menjadi 4/6 termasuk …",
    options: ["Pecahan senilai", "Menyederhanakan pecahan"],
    correctAnswer: "Pecahan senilai",
    discussion: "Karena angkanya menjadi lebih besar (dikali)."
  },
  {
    id: 14, type: 'single',
    question: "Mengubah 10/20 menjadi 1/2 termasuk …",
    options: ["Pecahan senilai", "Menyederhanakan pecahan"],
    correctAnswer: "Menyederhanakan pecahan",
    discussion: "Dibagi FPB, jadi sederhana."
  },
  {
    id: 15, type: 'single',
    question: "Mengubah 3/5 menjadi 6/10 termasuk …",
    options: ["Pecahan senilai", "Menyederhanakan pecahan"],
    correctAnswer: "Pecahan senilai",
    discussion: "Dikali 2, jadi pecahan senilai."
  }
];

// --- DATA SOAL HARI 4 (TETAP SAMA) ---
const QUESTIONS_DAY4 = [
  // A. Pilihan Ganda Sederhana (1-7)
  {
    id: 1, type: 'single',
    question: "Tanda yang tepat untuk membandingkan pecahan 3/8 dan 5/8 adalah …",
    options: ["3/8 > 5/8", "3/8 < 5/8", "3/8 = 5/8", "5/8 < 3/8"],
    correctAnswer: "3/8 < 5/8",
    discussion: "Jika penyebut sama, bandingkan pembilang. 3 < 5, jadi 3/8 < 5/8."
  },
  {
    id: 2, type: 'single',
    question: "Pecahan yang lebih besar antara 1/2 dan 1/3 adalah …",
    options: ["1/2", "1/3", "Sama besar", "Tidak bisa dibandingkan"],
    correctAnswer: "1/2",
    discussion: "Samakan penyebut: 1/2 = 3/6, 1/3 = 2/6. 3/6 > 2/6, jadi 1/2 > 1/3."
  },
  {
    id: 2, type: 'single',
    question: "Urutan pecahan dari terkecil ke terbesar: 1/4, 1/2, 3/4 adalah …",
    options: ["1/2, 1/4, 3/4", "3/4, 1/2, 1/4", "1/4, 1/2, 3/4", "1/4, 3/4, 1/2"],
    correctAnswer: "1/4, 1/2, 3/4",
    discussion: "Samakan penyebut (KPK 4): 1/4 = 1/4, 1/2 = 2/4, 3/4 = 3/4. Urutan: 1/4, 2/4, 3/4."
  },
  {
    id: 4, type: 'single',
    question: "Pecahan mana yang lebih kecil: 2/3 atau 3/4?",
    options: ["2/3", "3/4", "Sama besar", "Tidak bisa dibandingkan"],
    correctAnswer: "2/3",
    discussion: "Perkalian silang: 2×4=8, 3×3=9. Karena 8 < 9, maka 2/3 < 3/4."
  },
  {
    id: 5, type: 'single',
    question: "Jika penyebut dua pecahan sama, maka perbandingan didasarkan pada …",
    options: ["Pembilang", "Penyebut", "KPK", "FPB"],
    correctAnswer: "Pembilang",
    discussion: "Penyebut sama berarti satuan sama, tinggal bandingkan pembilang."
  },
  {
    id: 6, type: 'single',
    question: "Untuk membandingkan 2/5 dan 3/7, langkah pertama adalah …",
    options: ["Samakan penyebut", "Samakan pembilang", "Kalikan silang", "Cari FPB"],
    correctAnswer: "Samakan penyebut",
    discussion: "Cara paling umum adalah menyamakan penyebut dengan KPK."
  },
  {
    id: 7, type: 'single',
    question: "Urutan dari terbesar ke terkecil: 2/3, 1/6, 5/6 adalah …",
    options: ["5/6, 2/3, 1/6", "1/6, 2/3, 5/6", "2/3, 5/6, 1/6", "5/6, 1/6, 2/3"],
    correctAnswer: "5/6, 2/3, 1/6",
    discussion: "Samakan penyebut (KPK 6): 2/3=4/6, 1/6=1/6, 5/6=5/6. Urutan terbesar: 5/6, 4/6, 1/6."
  },

  // B. Pilihan Ganda Kompleks (8-11)
  {
    id: 8, type: 'multiple',
    question: "Pilih SEMUA pernyataan yang BENAR tentang membandingkan pecahan!",
    options: ["Penyebut sama → bandingkan pembilang", "Pembilang sama → bandingkan penyebut", "Penyebut besar → pecahan besar", "Untuk membandingkan harus menyamakan penyebut"],
    correctAnswer: ["Penyebut sama → bandingkan pembilang", "Pembilang sama → bandingkan penyebut", "Untuk membandingkan harus menyamakan penyebut"],
    discussion: "Penyebut besar belum tentu pecahan besar (misal 1/10 < 1/4)."
  },
  {
    id: 9, type: 'multiple',
    question: "Pilih SEMUA pecahan yang lebih kecil dari 1/2!",
    options: ["1/3", "2/5", "3/4", "1/4"],
    correctAnswer: ["1/3", "2/5", "1/4"],
    discussion: "1/2 = 0,5. 1/3≈0,33, 2/5=0,4, 1/4=0,25 (semua < 0,5). 3/4=0,75 (>0,5)."
  },
  {
    id: 10, type: 'multiple',
    question: "Manakah pasangan pecahan yang benar urutannya dari terkecil ke terbesar?",
    options: ["1/4, 1/2, 3/4", "1/3, 2/3, 1/6", "2/5, 3/5, 4/5", "3/8, 5/8, 1/8"],
    correctAnswer: ["1/4, 1/2, 3/4", "2/5, 3/5, 4/5"],
    discussion: "Pilihan B seharusnya 1/6, 1/3, 2/3. Pilihan D seharusnya 1/8, 3/8, 5/8."
  },
  {
    id: 11, type: 'multiple',
    question: "Pilih SEMUA cara yang benar untuk membandingkan 3/4 dan 4/5!",
    options: ["Samakan penyebut jadi 20", "Perkalian silang: 3×5 dan 4×4", "Ubah ke desimal", "Cari FPB"],
    correctAnswer: ["Samakan penyebut jadi 20", "Perkalian silang: 3×5 dan 4×4", "Ubah ke desimal"],
    discussion: "FPB digunakan untuk menyederhanakan, bukan membandingkan."
  },

  // C. Kategori (12-15)
  {
    id: 12, type: 'single',
    question: "Membandingkan 2/3 dan 3/4 dengan menyamakan penyebut termasuk cara …",
    options: ["Langkah sistematis", "Cara cepat", "Perkalian silang", "Tidak direkomendasikan"],
    correctAnswer: "Langkah sistematis",
    discussion: "Menyamakan penyebut adalah langkah sistematis yang diajarkan."
  },
  {
    id: 13, type: 'single',
    question: "Ketika penyebut sama, kita membandingkan …",
    options: ["Pembilang", "Penyebut", "Kedua-duanya", "Tidak perlu membandingkan"],
    correctAnswer: "Pembilang",
    discussion: "Penyebut sama berarti satuan sama, cukup bandingkan pembilang."
  },
  {
    id: 14, type: 'single',
    question: "Untuk mengurutkan 1/2, 1/3, 1/4 dari terkecil, langkah pertama adalah …",
    options: ["Samakan penyebut", "Samakan pembilang", "Kalikan semua", "Lihat pembilang saja"],
    correctAnswer: "Samakan penyebut",
    discussion: "Penyebut berbeda, harus disamakan dulu untuk membandingkan."
  },
  {
    id: 15, type: 'single',
    question: "Pecahan 1/10 dan 1/4, manakah yang lebih besar?",
    options: ["1/4", "1/10", "Sama besar", "Tidak bisa dibandingkan"],
    correctAnswer: "1/4",
    discussion: "Pembilang sama (1), penyebut lebih kecil (4) berarti pecahan lebih besar. 1/4 > 1/10."
  }
];

// --- DATA SOAL HARI 4 BARU (DITAMBAHKAN) ---
const QUESTIONS_DAY4_NEW = [
  // A. Pilihan Ganda Sederhana (1-7)
  {
    id: 1, type: 'single',
    question: "Pecahan yang lebih besar adalah 3/4 dan 2/4 ...",
    options: ["2/4", "3/4", "Sama besar", "Tidak bisa dibandingkan"],
    correctAnswer: "3/4",
    discussion: "Penyebut sama (4), bandingkan pembilang: 3 > 2, jadi 3/4 > 2/4."
  },
  {
    id: 2, type: 'single',
    question: "Pecahan yang lebih kecil adalah 1/5 dan 1/3 ...",
    options: ["1/5", "1/3", "Sama besar", "Tidak bisa dibandingkan"],
    correctAnswer: "1/5",
    discussion: "Pembilang sama (1), bandingkan penyebut: 5 > 3, jadi 1/5 < 1/3."
  },
  {
    id: 3, type: 'single',
    question: "Tanda yang tepat untuk perbandingan berikut adalah: 4/6 □ 2/6",
    options: [">", "<", "=", "÷"],
    correctAnswer: ">",
    discussion: "Penyebut sama (6), bandingkan pembilang: 4 > 2, jadi 4/6 > 2/6."
  },
  {
    id: 4, type: 'single',
    question: "Manakah yang lebih besar? 2/3 dan 3/5",
    options: ["2/3", "3/5", "Sama besar", "Tidak bisa ditentukan"],
    correctAnswer: "2/3",
    discussion: "Samakan penyebut (KPK 15): 2/3 = 10/15, 3/5 = 9/15. 10/15 > 9/15, jadi 2/3 > 3/5."
  },
  {
    id: 5, type: 'single',
    question: "Urutan yang benar dari terkecil ke terbesar adalah: 1/4, 3/4, 2/4",
    options: [
      "3/4, 2/4, 1/4",
      "1/4, 2/4, 3/4",
      "2/4, 1/4, 3/4",
      "2/4, 3/4, 1/4"
    ],
    correctAnswer: "1/4, 2/4, 3/4",
    discussion: "Penyebut sama (4), urutkan pembilang dari kecil ke besar: 1/4, 2/4, 3/4."
  },
  {
    id: 6, type: 'single',
    question: "Pecahan terbesar dari kumpulan berikut adalah: 1/2, 1/3, 1/4",
    options: ["1/4", "1/3", "1/2", "Sama besar"],
    correctAnswer: "1/2",
    discussion: "Pembilang sama (1), bandingkan penyebut: penyebut terkecil (2) berarti pecahan terbesar, jadi 1/2."
  },
  {
    id: 7, type: 'single',
    question: "Urutan yang benar dari terbesar ke terkecil adalah: 3/5, 1/5, 4/5",
    options: [
      "1/5, 3/5, 4/5",
      "4/5, 3/5, 1/5",
      "3/5, 4/5, 1/5",
      "4/5, 1/5, 3/5"
    ],
    correctAnswer: "4/5, 3/5, 1/5",
    discussion: "Penyebut sama (5), urutkan pembilang dari besar ke kecil: 4/5, 3/5, 1/5."
  },

  // B. Pilihan Ganda Kompleks (8-11)
  {
    id: 8, type: 'multiple',
    question: "Pilih SEMUA perbandingan yang benar!",
    options: [
      "1/2 > 1/3",
      "2/4 = 1/2",
      "3/5 < 1/5",
      "4/6 > 3/6"
    ],
    correctAnswer: ["1/2 > 1/3", "2/4 = 1/2", "4/6 > 3/6"],
    discussion: "1/2 > 1/3 (benar), 2/4 = 1/2 (benar, karena 2/4 disederhanakan jadi 1/2), 3/5 < 1/5 (salah, 3/5 > 1/5), 4/6 > 3/6 (benar)."
  },
  {
    id: 9, type: 'multiple',
    question: "Pecahan berikut jika diurutkan dari terkecil ke terbesar yang benar adalah ...",
    options: [
      "1/6, 3/6, 5/6",
      "5/6, 3/6, 1/6",
      "3/6, 1/6, 5/6",
      "1/6, 5/6, 3/6"
    ],
    correctAnswer: ["1/6, 3/6, 5/6"],
    discussion: "Penyebut sama (6), urutkan pembilang: 1/6, 3/6, 5/6."
  },
  {
    id: 10, type: 'multiple',
    question: "Manakah pasangan pecahan yang NILAINYA sama?",
    options: [
      "1/2 dan 2/4",
      "2/3 dan 3/4",
      "3/6 dan 1/2",
      "4/5 dan 2/5"
    ],
    correctAnswer: ["1/2 dan 2/4", "3/6 dan 1/2"],
    discussion: "1/2 = 2/4 (benar), 2/3 ≠ 3/4 (salah), 3/6 = 1/2 (benar), 4/5 ≠ 2/5 (salah)."
  },
  {
    id: 11, type: 'multiple',
    question: "Pecahan yang lebih kecil dari 1/2 adalah ...",
    options: ["1/3", "2/3", "1/4", "3/4"],
    correctAnswer: ["1/3", "1/4"],
    discussion: "1/2 = 0.5. 1/3 ≈ 0.33 (<0.5), 2/3 ≈ 0.67 (>0.5), 1/4 = 0.25 (<0.5), 3/4 = 0.75 (>0.5)."
  },

  // C. Pilihan Ganda Kompleks Kategori (12-15)
  {
    id: 12, type: 'single',
    question: "Menentukan tanda > atau < antara dua pecahan termasuk ...",
    options: ["Membandingkan pecahan", "Mengurutkan pecahan"],
    correctAnswer: "Membandingkan pecahan",
    discussion: "Menentukan tanda > atau < adalah kegiatan membandingkan dua pecahan."
  },
  {
    id: 13, type: 'single',
    question: "Menyusun beberapa pecahan dari terkecil ke terbesar termasuk ...",
    options: ["Membandingkan pecahan", "Mengurutkan pecahan"],
    correctAnswer: "Mengurutkan pecahan",
    discussion: "Menyusun beberapa pecahan dari terkecil ke terbesar adalah kegiatan mengurutkan pecahan."
  },
  {
    id: 14, type: 'single',
    question: "Menentukan pecahan mana yang lebih besar dari dua pecahan termasuk ...",
    options: ["Membandingkan pecahan", "Mengurutkan pecahan"],
    correctAnswer: "Membandingkan pecahan",
    discussion: "Menentukan pecahan mana yang lebih besar adalah kegiatan membandingkan dua pecahan."
  },
  {
    id: 15, type: 'single',
    question: "Menyusun 1/4, 3/4, 2/4 dari terbesar ke terkecil termasuk ...",
    options: ["Membandingkan pecahan", "Mengurutkan pecahan"],
    correctAnswer: "Mengurutkan pecahan",
    discussion: "Menyusun beberapa pecahan dari terbesar ke terkecil adalah kegiatan mengurutkan pecahan."
  }
];

export default function App() {
  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [studentGrade, setStudentGrade] = useState('4');

  // STATE NAVIGATION
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [contentType, setContentType] = useState<'material' | 'quiz' | null>(null);

  // STATE QUIZ
  const [activeQuestions, setActiveQuestions] = useState<any[]>(QUESTIONS_DAY1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);

  // --- LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail) return alert("Mohon isi nama dan email!");
    setIsSubmitting(true);
    const result = await loginUser(inputName, inputEmail);
    setIsSubmitting(false);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      if (result.user.role === 'GURU') {
        fetchTeacherData();
        setScreen('teacher_dashboard');
      } else {
        const allData = await getScores();
        const myHistory = allData.filter((d: any) => d.email === inputEmail);
        setStudentHistory(myHistory);
        setScreen('student_dashboard');
      }
    }
  };

  const handleSelectDayForQuiz = (day: number) => {
    if (day === 1) setActiveQuestions(QUESTIONS_DAY1);
    else if (day === 2) setActiveQuestions(QUESTIONS_DAY2);
    else if (day === 3) setActiveQuestions(QUESTIONS_DAY3);
    else if (day === 4) setActiveQuestions(QUESTIONS_DAY4_NEW); // Menggunakan soal baru hari 4

    setSelectedDay(day);
    startQuiz();
  };

  const startQuiz = () => {
    setScreen('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
  };

  const handleAnswer = (qId: number, value: any, subIndex: number | null = null) => {
    const qType = activeQuestions.find(q => q.id === qId)?.type;
    if (qType === 'multiple') {
      const current = userAnswers[qId] || [];
      if (current.includes(value)) setUserAnswers({ ...userAnswers, [qId]: current.filter((v: any) => v !== value) });
      else setUserAnswers({ ...userAnswers, [qId]: [...current, value] });
    } else if (qType === 'bs_complex') {
      const current = userAnswers[qId] || {};
      setUserAnswers({ ...userAnswers, [qId]: { ...current, [subIndex as number]: value } });
    } else {
      setUserAnswers({ ...userAnswers, [qId]: value });
    }
  };

  const finishQuiz = async () => {
    let correctCount = 0;
    activeQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (!ans) return;
      if (q.type === 'single' && ans === q.correctAnswer) correctCount++;
      else if (q.type === 'multiple' && Array.isArray(q.correctAnswer) && q.correctAnswer.every((a:any) => ans.includes(a)) && ans.length === q.correctAnswer.length) correctCount++;
      else if (q.type === 'bs_complex') {
        let allSubCorrect = true;
        const subCount = q.subQuestions?.length || 0;
        for(let i=0; i<subCount; i++) {
          if (ans[i] !== q.subQuestions![i].correct) allSubCorrect = false;
        }
        if (allSubCorrect) correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);
    setScore(finalScore);
    setIsSubmitting(true);
    await submitScore({ name: currentUser.name, email: currentUser.email, grade: studentGrade, subject: `Matematika - Hari ${selectedDay}`, score: finalScore });

    const allData = await getScores();
    const myHistory = allData.filter((d: any) => d.email === currentUser.email);
    setStudentHistory(myHistory);

    setIsSubmitting(false);
    setScreen('result');
  };

  const fetchTeacherData = async () => {
    setIsLoadingData(true);
    const data = await getScores();
    setTeacherData(data);
    setIsLoadingData(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setInputName('');
    setInputEmail('');
    setScreen('login');
  };

  // --- RENDERERS ---

  const renderLogin = () => (
      <div className="min-h-screen bg-[#FFF8DE] flex items-center justify-center p-6 font-sans overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#0F2854]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0F2854]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-[24px] shadow-[0_20px_50px_rgba(15,40,84,0.15)] w-full max-w-lg border border-white/50 relative z-10 transform transition-all duration-500 hover:shadow-[0_25px_60px_rgba(15,40,84,0.2)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0F2854] to-[#1a3b75] rounded-[16px] flex items-center justify-center mb-6 shadow-xl shadow-[#0F2854]/30 transform rotate-3 hover:rotate-6 transition-transform duration-500">
              <Crown className="w-8 h-8 text-[#FFF8DE]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F2854] tracking-tight uppercase">Portal Ujian</h1>
            <p className="text-[#0F2854]/60 mt-2 text-sm font-medium tracking-wide">Masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group">
              <label className="text-xs font-bold text-[#0F2854]/70 mb-2 block uppercase tracking-widest pl-1">Nama Lengkap</label>
              <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.02]">
                <User className="absolute left-5 top-4 text-[#0F2854]/40 w-5 h-5 group-focus-within:text-[#0F2854] transition-colors" />
                <input required type="text" className="w-full pl-14 p-4 bg-white border-2 border-[#0F2854]/10 rounded-2xl outline-none focus:border-[#0F2854] focus:ring-4 focus:ring-[#0F2854]/10 transition-all text-[#0F2854] placeholder-[#0F2854]/30 font-medium shadow-sm" placeholder="Ketik nama Anda" value={inputName} onChange={e => setInputName(e.target.value)} />
              </div>
            </div>
            <div className="group">
              <label className="text-xs font-bold text-[#0F2854]/70 mb-2 block uppercase tracking-widest pl-1">Email</label>
              <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.02]">
                <Mail className="absolute left-5 top-4 text-[#0F2854]/40 w-5 h-5 group-focus-within:text-[#0F2854] transition-colors" />
                <input required type="email" className="w-full pl-14 p-4 bg-white border-2 border-[#0F2854]/10 rounded-2xl outline-none focus:border-[#0F2854] focus:ring-4 focus:ring-[#0F2854]/10 transition-all text-[#0F2854] placeholder-[#0F2854]/30 font-medium shadow-sm" placeholder="email@sekolah.id" value={inputEmail} onChange={e => setInputEmail(e.target.value)} />
              </div>
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-[#0F2854] to-[#163a75] text-[#FFF8DE] py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-[#0F2854]/40 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 mt-4 relative overflow-hidden group">
              <span className="relative z-10">{isSubmitting ? 'Memproses...' : 'MASUK SEKARANG'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>
        </div>
      </div>
  );

  const renderStudentDashboard = () => {
    const chartData = studentHistory
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((item, index) => ({
          name: `Latihan ${index + 1}`,
          nilai: item.score
        }));

    return (
        <div className="min-h-screen bg-[#FFF8DE] font-sans pb-20">
          <div className="bg-gradient-to-b from-[#0F2854] to-[#0A1E40] px-8 pt-10 pb-20 rounded-b-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFF8DE]/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

            <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
              <div className="text-[#FFF8DE]">
                <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-widest">Selamat Datang</p>
                <h2 className="text-3xl font-black tracking-tight">{currentUser?.name}</h2>
              </div>
              <button onClick={handleLogout} className="bg-white/10 text-[#FFF8DE] p-3 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 shadow-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">

            {/* GRID TOP MENU */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 bg-white/90 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_15px_40px_-10px_rgba(15,40,84,0.1)] border border-white flex items-center justify-between transform hover:scale-[1.01] transition-all duration-500">
                <div>
                  <h3 className="text-[#0F2854] font-bold text-lg mb-1">Siap Ujian?</h3>
                  <p className="text-[#0F2854]/60 font-medium text-xs">Selesaikan materi & raih nilai terbaik.</p>
                </div>
                <div className="bg-gradient-to-br from-[#0F2854] to-[#1a3b75] p-3 rounded-[16px] shadow-lg shadow-[#0F2854]/20 animate-pulse">
                  <Award className="w-6 h-6 text-[#FFF8DE]" />
                </div>
              </div>

              <button
                  onClick={() => setScreen('track_record')}
                  className="relative overflow-hidden bg-gradient-to-br from-[#FFF8DE] to-white border border-white p-6 rounded-[24px] shadow-[0_15px_40px_-10px_rgba(15,40,84,0.1)] flex items-center justify-between gap-4 hover:shadow-[0_20px_50px_rgba(15,40,84,0.2)] hover:-translate-y-1 transition-all duration-500 group"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#0F2854]/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-[#0F2854]/10 p-3.5 rounded-xl group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE] transition-colors duration-500">
                    <BarChart3 className="w-6 h-6 text-[#0F2854] group-hover:text-[#FFF8DE] transition-colors duration-500" />
                  </div>
                  <div className="text-left">
                    <span className="block font-extrabold text-[#0F2854] text-sm">Lihat Nilai</span>
                    <span className="text-[10px] font-medium text-[#0F2854]/50">Track Record</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#0F2854]/30 group-hover:text-[#0F2854] group-hover:translate-x-1 transition-all duration-300 relative z-10" />
              </button>
            </div>

            <h3 className="text-sm font-bold text-[#0F2854] mb-4 flex items-center gap-2 uppercase tracking-wide opacity-80">
              Mata Pelajaran
            </h3>

            {/* GRID MATA PELAJARAN (BOX MATEMATIKA YANG TIDAK DIUBAH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button onClick={() => { setSelectedSubject('MATEMATIKA'); setScreen('subject_menu'); }} className="bg-white p-5 rounded-[24px] shadow-sm hover:shadow-[0_15px_40px_rgba(15,40,84,0.1)] hover:-translate-y-1 transition-all duration-300 group border border-[#0F2854]/5 relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8DE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="bg-[#FFF8DE] w-14 h-14 rounded-[18px] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border-4 border-white shadow-inner">
                    <Calculator className="w-6 h-6 text-[#0F2854]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-[#0F2854] mb-0.5 group-hover:text-[#1a3b75] transition-colors">Matematika</h4>
                    <p className="text-[#0F2854]/50 font-medium text-xs">Materi & Latihan Soal</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#0F2854]/10 flex items-center justify-center group-hover:bg-[#0F2854] group-hover:border-[#0F2854] transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-[#0F2854]/30 group-hover:text-[#FFF8DE] transition-colors" />
                  </div>
                </div>
              </button>

              <button disabled className="bg-white/50 p-5 rounded-[24px] border border-[#0F2854]/5 cursor-not-allowed text-left relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px]"></div>
                <div className="flex items-center gap-4 relative z-10 opacity-40">
                  <div className="bg-gray-100 w-14 h-14 rounded-[18px] flex items-center justify-center border-4 border-white">
                    <BookOpen className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-gray-800 mb-0.5">Bhs. Indonesia</h4>
                    <p className="text-gray-500 font-medium text-xs">Segera Hadir</p>
                  </div>
                </div>
              </button>
            </div>

            {/* GRAFIK */}
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#0F2854]/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#0F2854] flex items-center gap-2 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4 text-[#0F2854]" />
                  Grafik Perkembangan
                </h3>
              </div>
              {chartData.length > 0 ? (
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0F2854" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0F2854" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} domain={[0, 100]} />
                        <Tooltip contentStyle={{backgroundColor: '#0F2854', color: '#FFF8DE', borderRadius: '12px', border: 'none', fontSize: '12px'}} itemStyle={{color: '#FFF8DE'}} cursor={{stroke: '#0F2854', strokeWidth: 1, strokeDasharray: '5 5'}} />
                        <Area type="monotone" dataKey="nilai" stroke="#0F2854" strokeWidth={3} fillOpacity={1} fill="url(#colorNilai)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400 bg-[#FFF8DE]/50 rounded-2xl border-2 border-dashed border-[#0F2854]/10">
                    <BarChart3 className="w-8 h-8 mb-2 opacity-30 text-[#0F2854]" />
                    <p className="text-xs font-medium text-[#0F2854]/50">Belum ada data nilai.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
    );
  };

  // --- HALAMAN PILIH HARI (BARU) ---
  const renderDaySelection = () => (
      <div className="min-h-screen bg-[#FFF8DE] font-sans pb-20">
        <div className="bg-white/80 backdrop-blur-md px-8 py-6 shadow-sm sticky top-0 z-30 flex items-center gap-6 border-b border-[#0F2854]/5">
          <button onClick={() => setScreen('subject_menu')} className="w-10 h-10 bg-[#0F2854]/5 rounded-xl flex items-center justify-center hover:bg-[#0F2854] hover:text-[#FFF8DE] transition-all duration-300">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <p className="text-[#0F2854]/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              {contentType === 'material' ? 'Pilih Materi' : 'Pilih Latihan Soal'}
            </p>
            <h2 className="text-xl font-black text-[#0F2854]">Daftar Hari</h2>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-8 space-y-4">
          {/* Tombol Hari 1 */}
          <button
              onClick={() => {
                if (contentType === 'material') { setSelectedDay(1); setScreen('material'); }
                else { handleSelectDayForQuiz(1); }
              }}
              className="w-full text-left p-6 rounded-[24px] bg-white border border-[#0F2854]/5 shadow-sm hover:shadow-lg hover:border-[#0F2854]/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-6 group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-[#FFF8DE] text-[#0F2854] group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE] transition-colors">1</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0F2854] mb-1">Hari 1: Operasi Bilangan Cacah</h3>
              <p className="text-xs opacity-60 font-medium text-[#0F2854]">Penjumlahan, Pengurangan, Perkalian, Pembagian</p>
            </div>
            <ArrowRight className="text-[#0F2854]/30 group-hover:text-[#0F2854] transition-colors" />
          </button>

          {/* Tombol Hari 2 */}
          <button
              onClick={() => {
                if (contentType === 'material') { setSelectedDay(2); setScreen('material'); }
                else { handleSelectDayForQuiz(2); }
              }}
              className="w-full text-left p-6 rounded-[24px] bg-white border border-[#0F2854]/5 shadow-sm hover:shadow-lg hover:border-[#0F2854]/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-6 group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-[#FFF8DE] text-[#0F2854] group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE] transition-colors">2</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0F2854] mb-1">Hari 2: KPK dan FPB</h3>
              <p className="text-xs opacity-60 font-medium text-[#0F2854]">Faktor, Kelipatan, Soal Cerita</p>
            </div>
            <ArrowRight className="text-[#0F2854]/30 group-hover:text-[#0F2854] transition-colors" />
          </button>

          {/* Tombol Hari 3 */}
          <button
              onClick={() => {
                if (contentType === 'material') { setSelectedDay(3); setScreen('material'); }
                else { handleSelectDayForQuiz(3); }
              }}
              className="w-full text-left p-6 rounded-[24px] bg-white border border-[#0F2854]/5 shadow-sm transition-all duration-300 flex items-center gap-6 group hover:shadow-lg hover:border-[#0F2854]/30 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors bg-[#FFF8DE] text-[#0F2854] group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE]">3</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-[#0F2854]">Hari 3: Konsep Dasar Pecahan</h3>
              <p className="text-xs opacity-60 font-medium text-[#0F2854]">
                Pengertian, Senilai, Sederhana, Soal Cerita
              </p>
            </div>
            <ArrowRight className="text-[#0F2854]/30 group-hover:text-[#0F2854] transition-colors" />
          </button>

          {/* Tombol Hari 4 */}
          <button
              onClick={() => {
                if (contentType === 'material') { setSelectedDay(4); setScreen('material'); }
                else { handleSelectDayForQuiz(4); }
              }}
              className="w-full text-left p-6 rounded-[24px] bg-white border border-[#0F2854]/5 shadow-sm transition-all duration-300 flex items-center gap-6 group hover:shadow-lg hover:border-[#0F2854]/30 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors bg-[#FFF8DE] text-[#0F2854] group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE]">4</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 text-[#0F2854]">Hari 4: Membandingkan & Mengurutkan Pecahan</h3>
              <p className="text-xs opacity-60 font-medium text-[#0F2854]">
                Perbandingan, Penyebut Sama/Beda, Urutan, Soal Cerita
              </p>
            </div>
            <ArrowRight className="text-[#0F2854]/30 group-hover:text-[#0F2854] transition-colors" />
          </button>
        </div>
      </div>
  );

  const renderSubjectMenu = () => (
      <div className="min-h-screen bg-[#FFF8DE] font-sans pb-20">
        <div className="bg-white/80 backdrop-blur-md px-8 py-6 shadow-sm sticky top-0 z-30 flex items-center gap-6 border-b border-[#0F2854]/5">
          <button onClick={() => setScreen('student_dashboard')} className="w-10 h-10 bg-[#0F2854]/5 rounded-xl flex items-center justify-center hover:bg-[#0F2854] hover:text-[#FFF8DE] transition-all duration-300">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <p className="text-[#0F2854]/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Mata Pelajaran</p>
            <h2 className="text-xl font-black text-[#0F2854]">{selectedSubject}</h2>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-8 grid gap-6 md:grid-cols-2">
          {/* CARD MATERI */}
          <div onClick={() => { setContentType('material'); setScreen('day_selection'); }} className="cursor-pointer bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,40,84,0.05)] border border-[#0F2854]/5 flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(15,40,84,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-125 transition duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0F2854] to-[#25467a] rounded-[18px] flex items-center justify-center text-[#FFF8DE] shadow-xl shadow-[#0F2854]/20 mb-4 group-hover:rotate-3 transition-transform duration-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2854] mb-1">Pelajari Materi</h3>
              <p className="text-[#0F2854]/60 font-medium text-xs mb-6">Konsep Operasi Bilangan, KPK, FPB</p>
              <button className="bg-[#FFF8DE] text-[#0F2854] border border-[#0F2854]/10 px-6 py-3 rounded-xl font-bold text-xs group-hover:bg-[#0F2854] group-hover:text-[#FFF8DE] transition-all duration-300 w-full shadow-sm">
                Buka Materi
              </button>
            </div>
          </div>

          {/* CARD QUIZ */}
          <div onClick={() => { setContentType('quiz'); setScreen('day_selection'); }} className="cursor-pointer bg-[#0F2854] rounded-[24px] p-6 shadow-2xl shadow-[#0F2854]/30 flex flex-col justify-between transform hover:scale-[1.01] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#FFF8DE] rounded-[18px] flex items-center justify-center text-[#0F2854] shadow-xl shadow-black/20 mb-4">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FFF8DE] mb-1">Latihan Soal</h3>
              <p className="text-[#FFF8DE]/70 font-medium text-xs mb-6">Uji kemampuanmu per hari</p>
              <button className="bg-[#FFF8DE] text-[#0F2854] px-6 py-3 rounded-xl font-bold text-xs hover:bg-white hover:scale-105 hover:shadow-lg transition-all duration-300 w-full shadow-xl relative z-10">
                Mulai Kuis
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  // --- KONTEN HARI 1 (TETAP SAMA) ---
  const renderMaterialDay1 = () => (
      <>
        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">1. Apa itu Bilangan Cacah?</h3>
          <p className="text-[#0F2854]/80 text-base leading-relaxed">
            Bilangan cacah adalah bilangan <strong>0, 1, 2, 3, 4, 5, ...</strong> dan seterusnya.<br/><br/>
            Bilangan ini sering kita gunakan untuk menghitung benda di sekitar kita.
          </p>
          <div className="bg-[#FFF8DE] p-4 rounded-xl mt-4 border border-[#0F2854]/10 text-center">
            <p className="font-bold text-[#0F2854] mb-2">Contoh bilangan cacah:</p>
            <p className="font-mono text-xl text-[#0F2854] font-bold tracking-widest">{`👉 0, 5, 12, 25, 100`}</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">2. Operasi Hitung Bilangan Cacah</h3>
          <p className="text-[#0F2854]/80 mb-4 text-base">Ada 4 operasi hitung bilangan cacah:</p>
          <div className="overflow-hidden rounded-xl border border-[#0F2854]/10 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#0F2854] text-[#FFF8DE]">
              <tr>
                <th className="p-3">Operasi</th>
                <th className="p-3 text-center">Tanda</th>
                <th className="p-3 text-right">Contoh</th>
              </tr>
              </thead>
              <tbody className="bg-white text-[#0F2854]">
              <tr className="border-b border-[#0F2854]/5"><td className="p-3 font-medium">Penjumlahan</td><td className="p-3 text-center font-bold">+</td><td className="p-3 text-right font-mono">5 + 3</td></tr>
              <tr className="border-b border-[#0F2854]/5"><td className="p-3 font-medium">Pengurangan</td><td className="p-3 text-center font-bold">−</td><td className="p-3 text-right font-mono">8 − 2</td></tr>
              <tr className="border-b border-[#0F2854]/5"><td className="p-3 font-medium">Perkalian</td><td className="p-3 text-center font-bold">×</td><td className="p-3 text-right font-mono">4 × 3</td></tr>
              <tr><td className="p-3 font-medium">Pembagian</td><td className="p-3 text-center font-bold">÷</td><td className="p-3 text-right font-mono">12 ÷ 3</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">3. Aturan Operasi Hitung Campuran</h3>
          <p className="text-[#0F2854]/80 mb-4 text-base">Jika dalam satu soal ada lebih dari satu operasi, maka kita kerjakan dengan urutan berikut:</p>
          <div className="grid gap-3">
            <div className="flex items-center gap-4 bg-white border border-[#0F2854]/10 p-4 rounded-xl shadow-sm">
              <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">1</span>
              <span className="font-bold text-[#0F2854]">Perkalian dan pembagian terlebih dahulu</span>
            </div>
            <div className="flex items-center gap-4 bg-white border border-[#0F2854]/10 p-4 rounded-xl shadow-sm">
              <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">2</span>
              <span className="font-bold text-[#0F2854]">Penjumlahan dan pengurangan dikerjakan setelahnya</span>
            </div>
            <div className="flex items-center gap-4 bg-white border border-[#0F2854]/10 p-4 rounded-xl shadow-sm">
              <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">3</span>
              <span className="font-bold text-[#0F2854]">Dikerjakan dari kiri ke kanan</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-6 flex items-center gap-2">
            <Edit3 className="w-6 h-6" /> CONTOH SOAL & PENYELESAIAN
          </h3>
          <div className="space-y-6">
            {/* Contoh 1 */}
            <div className="bg-[#FFF8DE]/50 p-6 rounded-2xl border border-[#0F2854]/10">
              <h4 className="font-bold text-[#0F2854] mb-2">🟦 Contoh 1 (Operasi Hitung Campuran)</h4>
              <p className="text-sm text-[#0F2854]/70 mb-4"><strong>Soal:</strong> Hitunglah nilai dari: <strong>8 + 4 × 5</strong></p>
              <div className="bg-white p-4 rounded-xl border border-[#0F2854]/5 text-sm space-y-2">
                <p className="font-bold text-[#0F2854]">🔍 Langkah Penyelesaian:</p>
                <ul className="list-disc list-inside text-[#0F2854]/80 ml-2">
                  <li>Kerjakan perkalian terlebih dahulu: <strong>4 × 5 = 20</strong></li>
                  <li>Lalu kerjakan penjumlahan: <strong>8 + 20 = 28</strong></li>
                </ul>
                <p className="mt-2 font-bold text-green-600 bg-green-50 inline-block px-3 py-1 rounded">✅ Jawaban: 28</p>
              </div>
            </div>
            {/* Contoh 2 */}
            <div className="bg-[#FFF8DE]/50 p-6 rounded-2xl border border-[#0F2854]/10">
              <h4 className="font-bold text-[#0F2854] mb-2">🟦 Contoh 2 (Soal Cerita – Stok Barang)</h4>
              <p className="text-sm text-[#0F2854]/70 mb-4"><strong>Soal:</strong> Di sebuah toko terdapat 6 kotak pensil. Setiap kotak berisi 10 pensil. Hari ini terjual 15 pensil. Berapa sisa pensil di toko?</p>
              <div className="bg-white p-4 rounded-xl border border-[#0F2854]/5 text-sm space-y-2">
                <p className="font-bold text-[#0F2854]">🔍 Langkah Penyelesaian:</p>
                <ul className="list-disc list-inside text-[#0F2854]/80 ml-2">
                  <li>Hitung jumlah pensil seluruhnya: <strong>6 × 10 = 60 pensil</strong></li>
                  <li>Kurangi dengan pensil yang terjual: <strong>60 − 15 = 45 pensil</strong></li>
                </ul>
                <p className="mt-2 font-bold text-green-600 bg-green-50 inline-block px-3 py-1 rounded">✅ Jawaban: Sisa pensil adalah 45 buah.</p>
              </div>
            </div>
            {/* Contoh 3 */}
            <div className="bg-[#FFF8DE]/50 p-6 rounded-2xl border border-[#0F2854]/10">
              <h4 className="font-bold text-[#0F2854] mb-2">🟦 Contoh 3 (Soal Cerita – Jual Beli)</h4>
              <p className="text-sm text-[#0F2854]/70 mb-4"><strong>Soal:</strong> Ibu membeli 3 bungkus roti. Setiap bungkus berisi 8 roti. Roti tersebut dibagikan kepada 4 anak sama banyak. Berapa roti yang diterima setiap anak?</p>
              <div className="bg-white p-4 rounded-xl border border-[#0F2854]/5 text-sm space-y-2">
                <p className="font-bold text-[#0F2854]">🔍 Langkah Penyelesaian:</p>
                <ul className="list-disc list-inside text-[#0F2854]/80 ml-2">
                  <li>Hitung jumlah roti seluruhnya: <strong>3 × 8 = 24 roti</strong></li>
                  <li>Bagi roti tersebut kepada 4 anak: <strong>24 ÷ 4 = 6 roti</strong></li>
                </ul>
                <p className="mt-2 font-bold text-green-600 bg-green-50 inline-block px-3 py-1 rounded">✅ Jawaban: Setiap anak mendapat 6 roti.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0F2854] text-[#FFF8DE] p-6 rounded-2xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🧠 Kesimpulan</h3>
          <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
            <li>Operasi bilangan cacah terdiri dari tambah, kurang, kali, dan bagi.</li>
            <li>Untuk operasi campuran: 👉 <strong>kali & bagi dulu</strong>, baru tambah & kurang.</li>
            <li>Soal cerita membantu kita memahami penggunaan matematika dalam kehidupan sehari-hari.</li>
          </ul>
        </section>
      </>
  );

  // --- KONTEN HARI 2 (TETAP SAMA) ---
  const renderMaterialDay2 = () => (
      <>
        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">1. Faktor dan Kelipatan Bilangan</h3>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854] mb-2 text-lg">🔹 Faktor Bilangan</h4>
              <p className="text-[#0F2854]/80 text-sm mb-3">Faktor adalah bilangan yang bisa membagi suatu bilangan tanpa sisa.</p>
              <div className="bg-[#FFF8DE] p-3 rounded-lg border-l-4 border-[#0F2854]">
                <p className="font-bold text-sm text-[#0F2854] mb-1">📌 Contoh: Faktor dari 12</p>
                <ul className="list-disc list-inside text-sm text-[#0F2854]/80 font-mono">
                  <li>1 (12 ÷ 1 = 12)</li>
                  <li>2 (12 ÷ 2 = 6)</li>
                  <li>3 (12 ÷ 3 = 4)</li>
                  <li>4 (12 ÷ 4 = 3)</li>
                  <li>6 (12 ÷ 6 = 2)</li>
                  <li>12 (12 ÷ 12 = 1)</li>
                </ul>
                <p className="mt-2 font-bold text-[#0F2854]">➡️ Faktor 12 = 1, 2, 3, 4, 6, 12</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854] mb-2 text-lg">🔹 Kelipatan Bilangan</h4>
              <p className="text-[#0F2854]/80 text-sm mb-3">Kelipatan adalah hasil perkalian suatu bilangan dengan bilangan asli (1, 2, 3, 4, …).</p>
              <div className="bg-[#FFF8DE] p-3 rounded-lg border-l-4 border-[#0F2854]">
                <p className="font-bold text-sm text-[#0F2854] mb-1">📌 Contoh: Kelipatan 4</p>
                <ul className="list-disc list-inside text-sm text-[#0F2854]/80 font-mono">
                  <li>4 × 1 = 4</li>
                  <li>4 × 2 = 8</li>
                  <li>4 × 3 = 12</li>
                  <li>4 × 4 = 16</li>
                </ul>
                <p className="mt-2 font-bold text-[#0F2854]">➡️ Kelipatan 4 = 4, 8, 12, 16, 20, …</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">2. Pengertian KPK dan FPB</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#0F2854] text-[#FFF8DE] p-5 rounded-xl shadow-lg">
              <h4 className="font-bold text-lg mb-2">🔹 KPK (Kelipatan Persekutuan Terkecil)</h4>
              <p className="text-sm opacity-90 mb-4">KPK adalah kelipatan yang sama dan paling kecil dari dua bilangan atau lebih.</p>
              <div className="bg-white/10 p-3 rounded-lg text-sm">
                <p className="font-bold text-[#FFF8DE] mb-1">📌 Biasanya digunakan untuk:</p>
                <ul className="list-disc list-inside opacity-80">
                  <li>Soal kejadian berulang</li>
                  <li>Jadwal</li>
                  <li>Bertemu kembali</li>
                  <li>Bersamaan</li>
                </ul>
              </div>
            </div>
            <div className="bg-white text-[#0F2854] p-5 rounded-xl shadow-sm border border-[#0F2854]/10">
              <h4 className="font-bold text-lg mb-2">🔹 FPB (Faktor Persekutuan Terbesar)</h4>
              <p className="text-sm opacity-90 mb-4">FPB adalah faktor yang sama dan paling besar dari dua bilangan atau lebih.</p>
              <div className="bg-[#FFF8DE] p-3 rounded-lg text-sm border border-[#0F2854]/10">
                <p className="font-bold text-[#0F2854] mb-1">📌 Biasanya digunakan untuk:</p>
                <ul className="list-disc list-inside opacity-80">
                  <li>Membagi sesuatu sama banyak</li>
                  <li>Membuat kelompok</li>
                  <li>Membagi tanpa sisa</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">3. Cara Menentukan KPK dan FPB</h3>
          <div className="space-y-4">
            {/* Cara KPK */}
            <div className="bg-[#FFF8DE]/50 p-5 rounded-xl border border-[#0F2854]/10">
              <h4 className="font-bold text-[#0F2854] mb-2">✏️ Cara Menentukan KPK (Dengan Kelipatan)</h4>
              <p className="text-sm mb-2 font-bold text-[#0F2854]">📌 Contoh: Tentukan KPK dari 6 dan 8</p>
              <div className="bg-white p-3 rounded-lg text-sm text-[#0F2854] space-y-1">
                <p>Kelipatan 6: 6, 12, 18, 24, 30, …</p>
                <p>Kelipatan 8: 8, 16, 24, 32, …</p>
                <p className="font-bold mt-2">➡️ Kelipatan yang sama paling kecil adalah 24</p>
                <p className="font-bold text-green-700 bg-green-50 inline-block px-2 py-1 rounded">✅ KPK = 24</p>
              </div>
            </div>

            {/* Cara FPB */}
            <div className="bg-[#FFF8DE]/50 p-5 rounded-xl border border-[#0F2854]/10">
              <h4 className="font-bold text-[#0F2854] mb-2">✏️ Cara Menentukan FPB (Dengan Faktor)</h4>
              <p className="text-sm mb-2 font-bold text-[#0F2854]">📌 Contoh: Tentukan FPB dari 12 dan 18</p>
              <div className="bg-white p-3 rounded-lg text-sm text-[#0F2854] space-y-1">
                <p>Faktor 12: 1, 2, 3, 4, 6, 12</p>
                <p>Faktor 18: 1, 2, 3, 6, 9, 18</p>
                <p className="font-bold mt-2">➡️ Faktor yang sama: 1, 2, 3, 6</p>
                <p className="font-bold">➡️ Yang paling besar adalah 6</p>
                <p className="font-bold text-green-700 bg-green-50 inline-block px-2 py-1 rounded">✅ FPB = 6</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">4. Membedakan Soal Cerita KPK dan FPB</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-[#0F2854]/20 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-[#0F2854] mb-2 bg-[#FFF8DE] px-2 py-1 inline-block rounded">🔍 Ciri-ciri Soal KPK</h4>
              <ul className="text-sm text-[#0F2854]/80 list-disc list-inside mb-3">
                <li>Ada kata: setiap, bersamaan, berulang</li>
                <li>Menanyakan: kapan bertemu lagi?</li>
              </ul>
              <div className="bg-gray-50 p-3 rounded text-xs text-[#0F2854]">
                <strong>📌 Contoh:</strong> Ani olahraga setiap 4 hari, Budi setiap 6 hari. Kapan bersama lagi?
                <br/><span className="text-green-600 font-bold">➡️ Ini soal KPK</span>
              </div>
            </div>
            <div className="border border-[#0F2854]/20 rounded-xl p-4 bg-white">
              <h4 className="font-bold text-[#0F2854] mb-2 bg-[#FFF8DE] px-2 py-1 inline-block rounded">🔍 Ciri-ciri Soal FPB</h4>
              <ul className="text-sm text-[#0F2854]/80 list-disc list-inside mb-3">
                <li>Ada kata: dibagi sama banyak, tanpa sisa</li>
                <li>Menanyakan: berapa kelompok/banyaknya isi?</li>
              </ul>
              <div className="bg-gray-50 p-3 rounded text-xs text-[#0F2854]">
                <strong>📌 Contoh:</strong> 12 apel dan 18 jeruk dibagikan sama banyak. Berapa anak?
                <br/><span className="text-green-600 font-bold">➡️ Ini soal FPB</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">5. Contoh Soal dan Pembahasan</h3>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 1 (KPK)</h4>
              <p className="text-sm text-[#0F2854]/80 italic mb-2">Lampu A menyala setiap 5 menit, Lampu B setiap 10 menit. Kapan menyala bersamaan lagi?</p>
              <div className="bg-[#FFF8DE] p-3 rounded text-sm text-[#0F2854]">
                Kelipatan 5: 5, 10, 15, 20<br/>
                Kelipatan 10: 10, 20<br/>
                ➡️ KPK = 10<br/>
                ✅ Jawaban: 10 menit lagi
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 2 (FPB)</h4>
              <p className="text-sm text-[#0F2854]/80 italic mb-2">20 permen dan 30 cokelat dibagikan sama banyak.</p>
              <div className="bg-[#FFF8DE] p-3 rounded text-sm text-[#0F2854]">
                Faktor 20: 1, 2, 4, 5, 10, 20<br/>
                Faktor 30: 1, 2, 3, 5, 6, 10, 15, 30<br/>
                ➡️ FPB = 10<br/>
                ✅ Jawaban: 10 anak
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 3 (Membedakan)</h4>
              <p className="text-sm text-[#0F2854]/80 italic mb-2">16 buku dan 24 pensil dibagi sama banyak tanpa sisa.</p>
              <div className="bg-[#FFF8DE] p-3 rounded text-sm text-[#0F2854]">
                ➡️ Ini FPB, karena membagi sama banyak<br/>
                FPB dari 16 dan 24 = 8<br/>
                ✅ Jawaban: 8 anak
              </div>
            </div>
          </div>
        </section>
      </>
  );

  // --- KONTEN HARI 3 (TETAP SAMA) ---
  const renderMaterialDay3 = () => (
      <>
        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">1. Pengertian Pecahan</h3>
          <p className="text-[#0F2854]/80 text-base leading-relaxed mb-4">
            Pecahan adalah bilangan yang menyatakan bagian dari keseluruhan.
          </p>
          <div className="bg-white p-6 rounded-xl border border-[#0F2854]/10 text-center">
            <p className="text-sm text-[#0F2854]/70 mb-2">Contoh: 1 buah kue dibagi menjadi 4 bagian sama besar. Jika diambil 1 bagian, ditulis:</p>
            <div className="inline-block bg-[#FFF8DE] px-8 py-4 rounded-lg border border-[#0F2854]/20">
              <span className="text-3xl font-bold text-[#0F2854]">1/4</span>
            </div>
            <div className="mt-4 text-left grid gap-2 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F2854]">📌 Pembilang</span>
                <span className="text-sm text-[#0F2854]/70">→ angka atas (menunjukkan bagian yang diambil)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F2854]">📌 Penyebut</span>
                <span className="text-sm text-[#0F2854]/70">→ angka bawah (menunjukkan jumlah bagian seluruhnya)</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">2. Pecahan Senilai</h3>

          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm mb-6">
            <h4 className="font-bold text-[#0F2854] mb-2">🔹 Apa itu Pecahan Senilai?</h4>
            <p className="text-[#0F2854]/80 text-sm mb-3">
              Pecahan senilai adalah pecahan yang nilainya sama, walaupun angka pembilang dan penyebutnya berbeda.
            </p>
            <div className="bg-[#FFF8DE] p-4 rounded-lg text-center font-bold text-[#0F2854] text-lg">
              1/2 = 2/4 = 3/6
            </div>
            <p className="text-xs text-center mt-2 text-[#0F2854]/60">Walaupun bentuknya berbeda, nilainya tetap sama.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
            <h4 className="font-bold text-[#0F2854] mb-2">🔹 Cara Menentukan Pecahan Senilai</h4>
            <p className="text-sm text-[#0F2854]/80 mb-4">Caranya dengan mengalikan pembilang dan penyebut dengan bilangan yang sama.</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#FFF8DE]/50 p-4 rounded-lg border border-[#0F2854]/5">
                <p className="font-bold text-[#0F2854] mb-2">Contoh 1:</p>
                <div className="text-sm text-[#0F2854]">
                  1/2 dikali 2 <br/>
                  (1 × 2) / (2 × 2) = <strong>2/4</strong>
                </div>
              </div>
              <div className="bg-[#FFF8DE]/50 p-4 rounded-lg border border-[#0F2854]/5">
                <p className="font-bold text-[#0F2854] mb-2">Contoh 2:</p>
                <div className="text-sm text-[#0F2854]">
                  1/2 dikali 3 <br/>
                  (1 × 3) / (2 × 3) = <strong>3/6</strong>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-1 rounded">📌 Ingat: Yang dikalikan harus sama (atas dan bawah).</p>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">3. Menyederhanakan Pecahan</h3>
          <div className="bg-[#0F2854] text-[#FFF8DE] p-6 rounded-xl shadow-lg mb-6">
            <h4 className="font-bold text-lg mb-2">🔹 Konsep Penyederhanaan</h4>
            <p className="text-sm opacity-90">
              Menyederhanakan pecahan artinya mengubah pecahan menjadi bentuk paling kecil, tetapi nilainya tetap sama.
              <br/><br/>
              <strong>Caranya:</strong><br/>
              1. Cari FPB (Faktor Persekutuan Terbesar) dari pembilang dan penyebut<br/>
              2. Bagi pembilang dan penyebut dengan FPB tersebut
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 1: Sederhanakan 6/8</h4>
              <div className="bg-[#FFF8DE] p-3 rounded-lg mt-2 text-sm text-[#0F2854] space-y-1">
                <p>Faktor 6 = 1, 2, 3, 6</p>
                <p>Faktor 8 = 1, 2, 4, 8</p>
                <p className="font-bold">FPB = 2</p>
                <div className="my-2 border-t border-[#0F2854]/10 pt-2">
                  6 ÷ 2 = 3<br/>
                  8 ÷ 2 = 4
                </div>
                <p className="font-bold text-green-700">✅ Bentuk sederhana = 3/4</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 2: Sederhanakan 10/20</h4>
              <div className="bg-[#FFF8DE] p-3 rounded-lg mt-2 text-sm text-[#0F2854] space-y-1">
                <p className="font-bold">FPB dari 10 dan 20 adalah 10</p>
                <div className="my-2 border-t border-[#0F2854]/10 pt-2">
                  10 ÷ 10 = 1<br/>
                  20 ÷ 10 = 2
                </div>
                <p className="font-bold text-green-700">✅ Bentuk sederhana = 1/2</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">4. Hubungan Pecahan Senilai dan Penyederhanaan</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#0F2854]/10 shadow-sm text-center">
              <span className="block text-3xl mb-2">✖️</span>
              <h4 className="font-bold text-[#0F2854]">Pecahan Senilai</h4>
              <p className="text-xs text-[#0F2854]/60">Diperoleh dengan mengalikan</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#0F2854]/10 shadow-sm text-center">
              <span className="block text-3xl mb-2">➗</span>
              <h4 className="font-bold text-[#0F2854]">Penyederhanaan</h4>
              <p className="text-xs text-[#0F2854]/60">Dilakukan dengan membagi</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">5. Contoh Soal Cerita</h3>
          <div className="bg-[#FFF8DE]/50 p-6 rounded-2xl border border-[#0F2854]/10">
            <p className="text-sm text-[#0F2854]/70 mb-4 font-style-italic">
              Satu pizza dipotong menjadi 8 bagian sama besar. Andi memakan 4 potong pizza.
            </p>
            <div className="bg-white p-4 rounded-xl border border-[#0F2854]/5 text-sm space-y-2">
              <p className="font-bold text-[#0F2854]">Penyelesaian:</p>
              <ul className="list-disc list-inside text-[#0F2854]/80 ml-2">
                <li>Pecahan pizza yang dimakan: <strong>4/8</strong></li>
                <li>Disederhanakan (dibagi 4): <strong>1/2</strong></li>
              </ul>
              <p className="mt-2 font-bold text-green-600 bg-green-50 inline-block px-3 py-1 rounded">✅ Kesimpulan: Andi memakan setengah pizza.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#0F2854] text-[#FFF8DE] p-6 rounded-2xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🧠 Ringkasan Materi</h3>
          <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
            <li>Pecahan adalah bagian dari keseluruhan.</li>
            <li><strong>Pecahan senilai</strong> memiliki nilai yang sama (didapat dengan mengalikan).</li>
            <li><strong>Penyederhanaan</strong> pecahan dilakukan dengan membagi menggunakan FPB.</li>
            <li>Bentuk paling kecil disebut pecahan sederhana.</li>
          </ul>
        </section>
      </>
  );

  // --- KONTEN HARI 4 (TETAP SAMA) ---
  const renderMaterialDay4 = () => (
      <>
        <section>
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">1. Membandingkan Dua Pecahan</h3>
          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm mb-6">
            <h4 className="font-bold text-[#0F2854] mb-2 text-lg">🔹 Apa itu Membandingkan Pecahan?</h4>
            <p className="text-[#0F2854]/80 text-sm mb-3">
              Membandingkan pecahan artinya menentukan pecahan mana yang lebih besar, lebih kecil, atau sama besar.
            </p>
            <div className="bg-[#FFF8DE] p-4 rounded-lg text-center">
              <p className="font-bold text-[#0F2854] mb-2">Tanda yang digunakan:</p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F2854] mb-1"></div>
                  <div className="text-xs text-[#0F2854]/70">lebih besar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F2854] mb-1">&lt;</div>
                  <div className="text-xs text-[#0F2854]/70">lebih kecil</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F2854] mb-1">=</div>
                  <div className="text-xs text-[#0F2854]/70">sama dengan</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">2. Membandingkan Pecahan dengan Penyebut Sama</h3>
          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
            <h4 className="font-bold text-[#0F2854] mb-2">📌 Aturan Utama:</h4>
            <p className="text-[#0F2854]/80 text-sm mb-4">
              Jika penyebutnya sama, maka <strong>bandingkan pembilangnya saja</strong>.
            </p>
            <div className="bg-[#FFF8DE] p-4 rounded-lg border-l-4 border-[#0F2854]">
              <p className="font-bold text-sm text-[#0F2854] mb-2">Contoh: Bandingkan 3/8 dan 5/8</p>
              <div className="text-sm text-[#0F2854] space-y-2">
                <p>• Penyebut sama: 8</p>
                <p>• Pembilang: 3 dan 5</p>
                <p>• Karena 5 &gt; 3, maka:</p>
                <div className="text-center text-xl font-bold text-[#0F2854] bg-white p-3 rounded-lg mt-2">
                  5/8 &gt; 3/8
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">3. Membandingkan Pecahan dengan Penyebut Berbeda</h3>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854] mb-2">🔹 Cara 1: Menyamakan Penyebut</h4>
              <p className="text-[#0F2854]/80 text-sm mb-3">Samakan penyebut dengan mencari KPK, lalu bandingkan pembilang.</p>
              <div className="bg-[#FFF8DE] p-4 rounded-lg">
                <p className="font-bold text-sm text-[#0F2854] mb-2">Contoh: Bandingkan 1/2 dan 1/3</p>
                <div className="text-sm text-[#0F2854] space-y-2">
                  <p>1. KPK dari 2 dan 3 adalah 6</p>
                  <p>2. Ubah pecahan:</p>
                  <p className="ml-4">• 1/2 = 3/6 (atas bawah dikali 3)</p>
                  <p className="ml-4">• 1/3 = 2/6 (atas bawah dikali 2)</p>
                  <p>3. Bandingkan: 3/6 vs 2/6</p>
                  <p>4. Karena 3 &gt; 2, maka:</p>
                  <div className="text-center text-xl font-bold text-[#0F2854] bg-white p-3 rounded-lg mt-2">
                    1/2 &gt; 1/3
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854] mb-2">🔹 Cara 2: Perkalian Silang (Cara Cepat)</h4>
              <p className="text-[#0F2854]/80 text-sm mb-3">Kalikan pembilang dengan penyebut lawan, lalu bandingkan hasilnya.</p>
              <div className="bg-[#FFF8DE] p-4 rounded-lg">
                <p className="font-bold text-sm text-[#0F2854] mb-2">Contoh: Bandingkan 2/3 dan 3/4</p>
                <div className="text-sm text-[#0F2854] space-y-2">
                  <p>1. Perkalian silang:</p>
                  <p className="ml-4">• 2 × 4 = 8</p>
                  <p className="ml-4">• 3 × 3 = 9</p>
                  <p>2. Bandingkan hasil: 9 &gt; 8</p>
                  <p>3. Karena 9 &gt; 8, maka:</p>
                  <div className="text-center text-xl font-bold text-[#0F2854] bg-white p-3 rounded-lg mt-2">
                    3/4 &gt; 2/3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">4. Mengurutkan Pecahan</h3>

          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm mb-6">
            <h4 className="font-bold text-[#0F2854] mb-2">🔹 Langkah-langkah Mengurutkan Pecahan</h4>
            <div className="grid gap-3 mt-4">
              <div className="flex items-center gap-4 bg-[#FFF8DE]/50 p-3 rounded-lg">
                <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">1</span>
                <span className="font-bold text-[#0F2854]">Samakan penyebut semua pecahan (cari KPK)</span>
              </div>
              <div className="flex items-center gap-4 bg-[#FFF8DE]/50 p-3 rounded-lg">
                <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">2</span>
                <span className="font-bold text-[#0F2854]">Bandingkan pembilangnya</span>
              </div>
              <div className="flex items-center gap-4 bg-[#FFF8DE]/50 p-3 rounded-lg">
                <span className="w-8 h-8 rounded-full bg-[#0F2854] text-[#FFF8DE] flex items-center justify-center font-bold text-sm">3</span>
                <span className="font-bold text-[#0F2854]">Urutkan sesuai perintah (terkecil ke terbesar atau sebaliknya)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
            <h4 className="font-bold text-[#0F2854] mb-2">📌 Contoh: Urutkan dari terkecil ke terbesar: 1/2, 1/4, 3/4</h4>
            <div className="bg-[#FFF8DE] p-4 rounded-lg mt-3">
              <div className="text-sm text-[#0F2854] space-y-2">
                <p>1. Samakan penyebut (KPK dari 2, 4, 4 = 4):</p>
                <p className="ml-4">• 1/2 = 2/4</p>
                <p className="ml-4">• 1/4 = 1/4</p>
                <p className="ml-4">• 3/4 = 3/4</p>
                <p>2. Bandingkan pembilang: 1, 2, 3</p>
                <p>3. Urutan terkecil ke terbesar:</p>
                <div className="text-center text-xl font-bold text-[#0F2854] bg-white p-3 rounded-lg mt-2">
                  1/4, 1/2, 3/4
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">5. Contoh Soal Cerita</h3>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 1 (Perbandingan)</h4>
              <p className="text-sm text-[#0F2854]/80 italic mb-2">Ani minum 1/2 gelas susu. Budi minum 3/4 gelas susu. Siapa yang minum lebih banyak?</p>
              <div className="bg-[#FFF8DE] p-3 rounded text-sm text-[#0F2854]">
                <p className="font-bold mb-2">Penyelesaian:</p>
                <p>Samakan penyebut: 1/2 = 2/4, 3/4 = 3/4</p>
                <p>Bandingkan: 3/4 &gt; 2/4</p>
                <p className="font-bold text-green-700 mt-2">✅ Jadi, Budi minum lebih banyak.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#0F2854]/10 shadow-sm">
              <h4 className="font-bold text-[#0F2854]">📝 Contoh 2 (Mengurutkan)</h4>
              <p className="text-sm text-[#0F2854]/80 italic mb-2">Urutkan pecahan berikut dari terkecil ke terbesar: 2/3, 1/3, 3/3</p>
              <div className="bg-[#FFF8DE] p-3 rounded text-sm text-[#0F2854]">
                <p className="font-bold mb-2">Penyelesaian:</p>
                <p>Penyebut sudah sama (3), bandingkan pembilang: 1, 2, 3</p>
                <p>Urutan terkecil: 1/3, 2/3, 3/3</p>
                <p className="font-bold text-green-700 mt-2">✅ Jawaban: 1/3, 2/3, 3/3</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-[#0F2854] mb-4 border-l-4 border-[#0F2854] pl-4">6. Kesalahan yang Sering Terjadi</h3>

          <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
            <h4 className="font-bold text-red-700 mb-2">❌ Kesalahan Umum:</h4>
            <p className="text-sm text-red-600 mb-3">
              Mengira penyebut besar berarti pecahan besar.
            </p>
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <p className="font-bold text-[#0F2854] mb-2">📌 Contoh perbandingan yang salah:</p>
              <p className="text-sm text-[#0F2854]">"10 lebih besar dari 4, jadi 1/10 lebih besar dari 1/4" → <strong>SALAH</strong></p>
              <div className="mt-3 p-3 bg-[#FFF8DE] rounded-lg">
                <p className="font-bold text-[#0F2854]">✅ Yang benar:</p>
                <p className="text-sm text-[#0F2854]">Pembilang sama (1), penyebut lebih kecil (4) berarti pecahan lebih besar.</p>
                <div className="text-center text-lg font-bold text-green-700 mt-2">
                  1/4 &gt; 1/10
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0F2854] text-[#FFF8DE] p-6 rounded-2xl shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🧠 Ringkasan Materi</h3>
          <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
            <li>Penyebut sama → bandingkan pembilang</li>
            <li>Penyebut berbeda → samakan penyebut atau gunakan perkalian silang</li>
            <li>Untuk mengurutkan: samakan penyebut dulu, lalu urutkan pembilang</li>
            <li>Pecahan dengan penyebut lebih kecil (pembilang sama) nilainya lebih besar</li>
          </ul>
        </section>
      </>
  );

  const renderMaterial = () => (
      <div className="min-h-screen bg-white font-sans">
        <div className="bg-[#0F2854] px-6 py-4 text-[#FFF8DE] flex items-center gap-4 sticky top-0 z-20 shadow-md">
          <button onClick={() => setScreen('day_selection')} className="p-2 bg-[#FFF8DE]/10 rounded-full hover:bg-[#FFF8DE]/20 transition">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-lg font-bold tracking-wide">
            MATERI HARI KE-{selectedDay}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto p-8 pb-24 space-y-10">
          {selectedDay === 1 && renderMaterialDay1()}
          {selectedDay === 2 && renderMaterialDay2()}
          {selectedDay === 3 && renderMaterialDay3()}
          {selectedDay === 4 && renderMaterialDay4()}
        </div>
        <div className="fixed bottom-0 w-full bg-white border-t border-[#0F2854]/10 p-4 z-20">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => handleSelectDayForQuiz(selectedDay)} className="w-full bg-[#0F2854] text-[#FFF8DE] py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg">LANJUT KE LATIHAN SOAL HARI {selectedDay}</button>
          </div>
        </div>
      </div>
  );

  const renderQuiz = () => {
    const q = activeQuestions[currentQuestionIndex];
    if (!q) return <div>Data Error</div>;
    const isLast = currentQuestionIndex === activeQuestions.length - 1;
    let typeText = q.type === 'single' ? "Pilihan Ganda" : q.type === 'multiple' ? "Pilih Banyak" : "Kategori";

    return (
        <div className="min-h-screen bg-[#FFF8DE] flex flex-col font-sans">
          <div className="bg-white px-6 py-6 shadow-sm sticky top-0 z-20 border-b border-[#0F2854]/5">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-[#0F2854] text-sm tracking-wider">HARI {selectedDay} - SOAL {currentQuestionIndex + 1} <span className="opacity-50">/ {activeQuestions.length}</span></span>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#0F2854] text-[#FFF8DE] uppercase tracking-widest">{typeText}</span>
              </div>
              <div className="w-full bg-[#0F2854]/10 h-2 rounded-full overflow-hidden"><div className="bg-[#0F2854] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_#0F2854]" style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}></div></div>
            </div>
          </div>
          <div className="flex-1 max-w-3xl w-full mx-auto p-6 pb-32">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-[#0F2854]/5">
              <h2 className="text-xl font-bold text-[#0F2854] mb-6 leading-relaxed">{q.question}</h2>
              <div className="space-y-3">
                {q.options && q.type === 'single' && q.options.map((opt:any, idx:number) => (
                    <button key={idx} onClick={() => handleAnswer(q.id, opt)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${userAnswers[q.id] === opt ? 'border-[#0F2854] bg-[#0F2854] text-[#FFF8DE]' : 'border-[#0F2854]/10 bg-white text-[#0F2854] hover:bg-[#FFF8DE]'}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${userAnswers[q.id] === opt ? 'bg-[#FFF8DE] text-[#0F2854]' : 'bg-[#0F2854]/10 text-[#0F2854]'}`}>{String.fromCharCode(65 + idx)}</div><span className="font-medium text-sm">{opt}</span></button>
                ))}
                {q.options && q.type === 'multiple' && q.options.map((opt:any, idx:number) => {
                  const isSel = userAnswers[q.id]?.includes(opt);
                  return (<button key={idx} onClick={() => handleAnswer(q.id, opt)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${isSel ? 'border-[#0F2854] bg-[#0F2854] text-[#FFF8DE]' : 'border-[#0F2854]/10 bg-white text-[#0F2854] hover:bg-[#FFF8DE]'}`}><span className="font-medium text-sm">{opt}</span><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSel ? 'border-[#FFF8DE] bg-transparent' : 'border-[#0F2854]/20'}`}>{isSel && <div className="w-3 h-3 bg-[#FFF8DE] rounded-full"></div>}</div></button>)
                })}
                {q.type === 'bs_complex' && (q.subQuestions || []).map((item:any, idx:number) => (
                    <div key={idx} className="bg-[#FFF8DE]/50 p-4 rounded-xl border border-[#0F2854]/10 mb-2"><p className="font-bold text-[#0F2854] mb-3 text-sm">{item.text}</p><div className="flex gap-2">{item.options.map((opt:any) => (<button key={opt} onClick={() => handleAnswer(q.id, opt, idx)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${userAnswers[q.id]?.[idx] === opt ? 'bg-[#0F2854] text-[#FFF8DE] border-[#0F2854]' : 'bg-white text-[#0F2854] border-[#0F2854]/20'}`}>{opt}</button>))}</div></div>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 w-full bg-white border-t border-[#0F2854]/10 p-4 z-20">
            <div className="max-w-3xl mx-auto flex justify-between gap-4">
              <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="px-4 py-3 rounded-xl font-bold text-[#0F2854] border border-[#0F2854]/20 disabled:opacity-30 hover:bg-[#FFF8DE] text-sm">Kembali</button>
              {isLast ? (
                  <button onClick={finishQuiz} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-[#0F2854] text-[#FFF8DE] rounded-xl font-bold hover:opacity-90 flex justify-center items-center gap-2 text-sm">{isSubmitting ? 'Menyimpan...' : 'SELESAI'}</button>
              ) : (
                  <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="flex-1 px-4 py-3 bg-[#0F2854] text-[#FFF8DE] rounded-xl font-bold hover:opacity-90 flex justify-center items-center gap-2 text-sm">LANJUT</button>
              )}
            </div>
          </div>
        </div>
    );
  };

  const renderResult = () => (
      <div className="min-h-screen bg-white font-sans">
        <div className="bg-[#0F2854] text-[#FFF8DE] p-10 text-center rounded-b-[40px] shadow-xl mb-8"><div className="inline-block p-4 bg-[#FFF8DE]/10 rounded-full mb-4"><Award className="w-10 h-10" /></div><h2 className="text-2xl font-bold mb-2">Hasil Latihan</h2><p className="opacity-80">Nilai kamu sudah tersimpan.</p><div className="mt-6 bg-[#FFF8DE] text-[#0F2854] w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl font-extrabold shadow-2xl">{score}</div></div>
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => { setScreen('student_dashboard'); setSelectedSubject(null); }} className="flex flex-col items-center gap-2 p-4 bg-[#FFF8DE] rounded-xl font-bold text-[#0F2854] border border-[#0F2854]/10 hover:border-[#0F2854] transition"><Home size={20}/> Dashboard</button>
            <button onClick={startQuiz} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl font-bold text-[#0F2854] border border-[#0F2854]/10 hover:border-[#0F2854] transition shadow-sm"><RefreshCcw size={20} /> Ulangi Lagi</button>
          </div>
          <div className="flex items-center gap-3 mb-6 px-2 border-b border-[#0F2854]/10 pb-4"><ListChecks className="w-5 h-5 text-[#0F2854]" /><h3 className="text-lg font-bold text-[#0F2854]">Pembahasan Soal</h3></div>
          <div className="space-y-6">{activeQuestions.map((q, idx) => (<div key={idx} className="border border-[#0F2854]/10 rounded-xl p-6 bg-white shadow-sm"><div className="flex gap-5"><div className="flex-shrink-0 w-8 h-8 bg-[#0F2854] text-[#FFF8DE] rounded-full flex items-center justify-center font-bold text-sm">{idx+1}</div><div className="w-full"><p className="font-bold text-[#0F2854] text-base mb-4">{q.question}</p><div className="p-4 bg-[#FFF8DE] rounded-lg text-[#0F2854] text-sm border-l-4 border-[#0F2854]"><span className="font-bold block mb-1 uppercase text-xs tracking-wider">Penjelasan:</span><p>{q.discussion}</p></div></div></div></div>))}</div>
        </div>
      </div>
  );

  const renderTrackRecord = () => (
      <div className="min-h-screen bg-[#FFF8DE] font-sans pb-20">
        <div className="bg-[#0F2854] px-8 py-6 text-[#FFF8DE] flex items-center gap-6 sticky top-0 z-30 shadow-xl">
          <button onClick={() => setScreen('student_dashboard')} className="w-10 h-10 bg-[#FFF8DE]/10 rounded-xl flex items-center justify-center hover:bg-[#FFF8DE]/20 transition backdrop-blur-sm">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <p className="text-[#FFF8DE]/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Riwayat Belajar</p>
            <h2 className="text-xl font-bold tracking-wide">Track Record Nilai</h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-8">
          {studentHistory.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <BarChart3 className="w-20 h-20 mx-auto mb-4 text-[#0F2854]" />
                <h3 className="text-xl font-bold text-[#0F2854]">Belum Ada Data</h3>
                <p className="text-[#0F2854] text-sm">Yuk kerjakan latihan soal dulu!</p>
              </div>
          ) : (
              <div className="grid gap-4">
                {studentHistory.map((h: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-[20px] shadow-sm border border-[#0F2854]/5 flex items-center justify-between hover:shadow-lg transition-all duration-300 group hover:-translate-x-1">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${h.score >= 80 ? 'bg-emerald-100 text-emerald-700' : h.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {h.score}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[#0F2854] mb-0.5">{h.subject}</h4>
                          <p className="text-[#0F2854]/50 text-xs flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            {new Date(h.createdAt).toLocaleDateString()} • {new Date(h.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );

  const renderTeacherDashboard = () => (
      <div className="min-h-screen bg-[#FFF8DE] p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[#0F2854]/5">
            <div className="flex items-center gap-4"><div className="bg-[#0F2854] p-3 rounded-xl text-[#FFF8DE]"><Crown className="w-6 h-6" /></div><div><h1 className="text-2xl font-bold text-[#0F2854]">Dashboard Guru</h1><p className="text-sm text-[#0F2854]/60">Admin: {currentUser?.name}</p></div></div>
            <button onClick={fetchTeacherData} className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFF8DE] text-[#0F2854] border border-[#0F2854]/20 hover:bg-[#0F2854] hover:text-[#FFF8DE] transition active:scale-95"><RefreshCcw className={`w-5 h-5 ${isLoadingData ? "animate-spin" : ""}`} /></button>
            <button onClick={handleLogout} className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 transition active:scale-95"><LogOut className="w-6 h-6" /></button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#0F2854]/10">
            <div className="p-6 border-b border-[#0F2854]/10 flex justify-between items-center bg-[#0F2854]/5"><h2 className="font-bold text-lg text-[#0F2854] flex items-center gap-3"><Users size={20}/> Rekap Nilai Siswa</h2><span className="bg-[#0F2854] text-[#FFF8DE] px-4 py-1 rounded-full text-xs font-bold">Total: {teacherData.length}</span></div>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-[#FFF8DE] text-[#0F2854] text-xs uppercase tracking-wider"><tr><th className="p-5 font-bold">Waktu</th><th className="p-5 font-bold">Nama</th><th className="p-5 font-bold">Email</th><th className="p-5 font-bold">Kelas</th><th className="p-5 font-bold text-center">Nilai</th></tr></thead><tbody className="divide-y divide-[#0F2854]/5">{teacherData.map((d: any) => (<tr key={d.id} className="hover:bg-[#FFF8DE]/30 transition"><td className="p-5 text-sm text-[#0F2854]/70">{new Date(d.createdAt).toLocaleDateString()}</td><td className="p-5 font-bold text-[#0F2854]">{d.name}</td><td className="p-5 text-sm text-[#0F2854]/70">{d.email}</td><td className="p-5 text-[#0F2854]">{d.grade}</td><td className="p-5 text-center"><span className={`px-4 py-1 rounded-full font-bold text-xs ${d.score >= 80 ? 'bg-green-100 text-green-700' : d.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{d.score}</span></td></tr>))}</tbody></table></div>
          </div>
        </div>
      </div>
  );

  switch(screen) {
    case 'login': return renderLogin();
    case 'student_dashboard': return renderStudentDashboard();
    case 'track_record': return renderTrackRecord();
    case 'teacher_dashboard': return renderTeacherDashboard();

      // --- NAVIGASI BARU ---
    case 'subject_menu': return renderSubjectMenu();
    case 'day_selection': return renderDaySelection();

    case 'material': return renderMaterial();
    case 'quiz': return renderQuiz();
    case 'result': return renderResult();
    default: return null;
  }
}