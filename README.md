# 💰 BudgetWebAPP

Aplikasi manajemen anggaran personal modern yang kaya fitur, membantu Anda melacak pemasukan dan pengeluaran dengan visualisasi yang indah dan kontrol intuitif. Dibangun dengan teknologi terkini untuk pengalaman pengguna yang optimal.

## ✨ Fitur Unggulan

### 📊 Dashboard Interaktif
- **Ringkasan Keuangan Real-time**: Tampilan status finansial Anda secara langsung
- **Grafik Kategori**: Visualisasi pengeluaran berdasarkan kategori dengan grafik batang
- **Diagram Pie Distribusi**: Pembagian pengeluaran yang jelas dan informatif
- **Statistik Cepat**: Informasi penting tentang transaksi tertinggi dan kategori aktif
- **Indikator Kesehatan Saldo**: Tooltip interaktif yang menunjukkan kondisi keuangan Anda

### 🤖 Wife Finance Assistant
- **AI-Powered Financial Advisor**: Asisten keuangan dengan Gemini 2.5 Flash dari Google
- **Konsultasi Keuangan**: Tanya jawab tentang investasi, tabungan, dan perencanaan finansial
- **Analisis Personal**: Saran berdasarkan data keuangan Anda secara real-time
- **Quick Actions**: Tombol cepat untuk topik keuangan populer (Investasi, Tabungan, Anggaran, Keuangan)
- **Interface Chat**: Chat interface yang intuitive dengan kategori pesan dan timestamp
- **Edukatif**: Memberikan saran edukatif dan praktis untuk keuangan sehari-hari
- **Ramah & Peduli**: Karakter seperti istri yang peduli dengan keuangan keluarga

### 💸 Manajemen Transaksi Lengkap
- **CRUD Lengkap**: Tambah, edit, hapus transaksi dengan mudah
- **Pencarian & Filter Canggih**: Cari transaksi berdasarkan tanggal, kategori, jumlah, atau deskripsi
- **Kategorisasi Otomatis**: Atur transaksi ke dalam kategori kustom dengan ikon dan warna
- **Dialog Popup**: Antarmuka yang user-friendly untuk semua interaksi
- **Data Persistence**: Data tersimpan otomatis dan tetap ada saat refresh halaman

### 📈 Laporan & Analitik
- **Tren Pengeluaran Bulanan**: Lacak pola finansial Anda sepanjang waktu
- **Perbandingan Kategori**: Bandingkan pengeluaran antar kategori berbeda
- **Tabel Statistik Detail**: Tabel data komprehensif dengan sorting dan filtering
- **Visualisasi Data**: Grafik interaktif dengan tooltip informatif

## 🎨 Desain & User Experience

### Desain Visual Modern
- **Skema Warna Gradien**: Transisi warna yang indah di seluruh antarmuka
- **Layout Berbasis Kartu**: Presentasi konten yang bersih dan terorganisir
- **Integrasi Ikon**: Ikon Lucide untuk navigasi dan aksi yang intuitif
- **Efek Glassmorphism**: Efek transparansi subtill untuk estetika modern

### Pengalaman Interaktif
- **Animasi Hover**: Transisi halus pada elemen interaktif
- **Loading States**: Indikator loading dan skeleton untuk pengalaman yang lebih baik
- **Transisi Halaman yang Mulus**: Navigasi fluid antar bagian
- **Feedback Responsif**: Konfirmasi visual untuk setiap aksi pengguna
- **Tooltip Informatif**: Penjelasan detail saat hover pada elemen penting

### Desain Responsif
- **Mobile-First**: Dioptimalkan untuk semua ukuran device
- **Hamburger Menu**: Navigasi yang dapat diciutkan untuk mobile
- **Desktop Sidebar**: Navigasi yang diperluas untuk layar lebih besar
- **Interface Touch-Friendly**: Dioptimalkan untuk interaksi mobile
- **Popup Responsif**: Dialog yang menyesuaikan dengan ukuran layar

## 🛠️ Teknologi Stack

### Core Framework
- **⚡ Next.js 15** - React framework dengan App Router untuk aplikasi web modern
- **📘 TypeScript 5** - Pengembangan JavaScript type-safe dengan strict type checking
- **🎨 Tailwind CSS 4** - CSS framework utility-first untuk styling cepat

### UI Components & Design
- **🧩 shadcn/ui** - Library komponen berkualitas tinggi dan accessible
- **🎯 Lucide React** - Library ikon yang indah untuk interface intuitif
- **📊 Recharts** - Library charting komposabel untuk visualisasi data
- **🔵 Radix UI** - Komponen UI yang accessible dan customizable

### State Management & Data
- **🐻 Zustand** - Solusi state management yang lightweight
- **🎣 React Hook Form** - Form handling yang performant dengan validation
- **✅ Zod** - Schema validation TypeScript-first
- **🤖 Google Generative AI** - Gemini 2.5 Flash untuk AI assistant
- **💾 localStorage** - Penyimpanan data lokal untuk persistence

### Development Tools
- **🔧 ESLint** - Pengecekan kualitas dan konsistensi kode
- **📦 npm** - Manajemen package dan build tools

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   ├── transactions/     # Transaction management
│   ├── reports/          # Reports components
│   └── Navigation.tsx    # Navigation component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── db.ts             # Database configuration
│   ├── utils.ts          # Helper functions
│   └── socket.ts         # WebSocket configuration
├── store/                # State management
│   └── budgetStore.ts    # Budget state store
└── types/                # TypeScript type definitions
    └── index.ts          # Type definitions
```

## 🎯 Fitur Inti

### Pelacakan Finansial
- **Manajemen Pemasukan & Pengeluaran**: Lacak semua transaksi finansial di satu tempat
- **Organisasi Kategori**: Atur transaksi berdasarkan kategori kustom dengan warna dan ikon
- **Pemantauan Anggaran**: Pantau batas anggaran dengan visualisasi yang jelas
- **Indikator Kesehatan Saldo**: Cek apakah saldo Anda sehat dengan logika cerdas

### Visualisasi Data
- **Grafik Interaktif**: Grafik batang, pie chart, dan visualisasi data dinamis
- **Update Real-time**: Data langsung update saat Anda menambahkan transaksi
- **Tooltip Informatif**: Penjelasan detail saat hover pada grafik dan statistik
- **Statistik Cepat**: Informasi penting tentang transaksi tertinggi dan kategori terbesar

### User Experience
- **Interface Intuitif**: Desain modern dan bersih dengan navigasi mudah
- **Performa Cepat**: Dioptimalkan untuk kecepatan dan responsivitas
- **Mobile Responsive**: Bekerja sempurna di semua device
- **Accessibility**: Desain WCAG-compliant untuk semua pengguna
- **Data Persistence**: Data otomatis tersimpan dan tersedia saat refresh

## 🔧 Fitur Terbaru

### ✅ Data Persistence
- Data transaksi otomatis tersimpan di localStorage
- Data tetap ada saat halaman di-refresh
- Tidak ada data loss saat browsing

### ✅ Smart Balance Health Indicator
- Logika cerdas untuk menentukan kesehatan saldo:
  - Saldo negatif = ❌ Perhatian
  - Saldo < 20% pemasukan = ⚠️ Perhatian
  - Saldo ≥ 20% pemasukan = ✅ Sehat
- Tooltip interaktif dengan persentase dan rekomendasi
- Visual feedback yang jelas dengan animasi

### ✅ Enhanced Mobile Navigation
- Single hamburger button di mobile (tidak ada duplikasi)
- Navigation yang clean dan intuitive
- Responsive design yang optimal

### ✅ Accurate Statistics
- Perhitungan statistik yang akurat:
  - Pengeluaran tertinggi berdasarkan transaksi individual
  - Kategori terbesar berdasarkan total pengeluaran
  - Jumlah kategori aktif

### ✅ Wife Finance AI Assistant
- **Powered by Gemini 2.5 Flash**: AI assistant canggih dari Google
- **Konsultasi Keuangan**: Tanya jawab tentang investasi, tabungan, dan perencanaan finansial
- **Analisis Personal**: Saran berdasarkan data keuangan Anda secara real-time
- **Quick Actions**: 4 tombol cepat untuk topik populer (Investasi, Tabungan, Anggaran, Keuangan)
- **Chat Interface**: Interface chat yang modern dengan kategori pesan dan timestamp
- **Karakter Ramah**: Seperti istri yang peduli dengan keuangan keluarga
- **Edukatif**: Memberikan saran praktis dan bisa langsung diterapkan

## 🎯 Cara Penggunaan

### 1. Menambah Transaksi
1. Klik tombol "Tambah" di halaman Transaksi
2. Isi form: deskripsi, jumlah, tanggal, kategori, dan tipe
3. Klik "Simpan"

### 2. Melihat Dashboard
- Dashboard menampilkan ringkasan keuangan secara real-time
- Grafik menunjukkan distribusi pengeluaran per kategori
- Statistik cepat menunjukkan informasi penting

### 3. Mengecek Kesehatan Saldo
- Hover pada badge "Sehat" atau "Perhatian" di card Saldo
- Tooltip akan menampilkan persentase saldo terhadap pemasukan
- Ikuti rekomendasi untuk keuangan yang lebih sehat

### 4. Menggunakan Wife Finance Assistant
- Klik menu "Wife Finance" di navigasi
- Gunakan "Aksi Cepat" untuk pertanyaan populer:
  - **Investasi**: Saran investasi untuk pemula
  - **Tabungan**: Cara mengatur keuangan untuk menabung
  - **Anggaran**: Analisa pengeluaran dan saran anggaran
  - **Keuangan**: Tips mengelola keuangan pribadi
- Ketik pertanyaan custom di chat input
- AI akan memberikan saran berdasarkan data keuangan Anda
- Hover pada badge kategori untuk melihat jenis pesan

### 5. Mengelola Transaksi
- Gunakan fitur pencarian dan filter untuk menemukan transaksi
- Edit atau hapus transaksi dengan mudah
- Data otomatis tersimpan

## 🔧 Development

### Kualitas Kode
- **TypeScript**: Strict type checking untuk kualitas kode yang lebih baik
- **ESLint**: Automated code linting dan formatting
- **Arsitektur Komponen**: Komponen modular dan reusable
- **Best Practices**: Mengikuti pola React dan Next.js modern

### State Management
Menggunakan Zustand untuk state management yang lightweight:

```typescript
// Contoh penggunaan store
const { transactions, addTransaction, deleteTransaction } = useBudgetStore();

// Menambah transaksi baru
addTransaction({
  description: 'Makan Siang',
  amount: 25000,
  date: '2024-01-01',
  category: foodCategory,
  type: 'expense'
});
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push kode ke repository GitHub
2. Hubungkan repository ke Vercel
3. Deploy secara otomatis

### Build Commands
```bash
# Build untuk production
npm run build

# Cek kode quality
npm run lint

# Start development server
npm run dev
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 License

Proyek ini open source dan tersedia di bawah MIT License.

## 🙏 Terima Kasih

- **Next.js Team** - Framework yang amazing
- **shadcn/ui** - Komponen UI yang berkualitas
- **Tailwind CSS** - Utility framework yang powerful
- **Zustand** - State management solution yang simple
- **Google AI Team** - Gemini AI yang powerful

---

**Dibuat dengan ❤️ untuk mengelola keuangan personal dengan lebih baik**