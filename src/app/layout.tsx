import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetWebAPP - Aplikasi Manajemen Keuangan Pribadi",
  description: "Aplikasi budget management modern untuk melacak pendapatan dan pengeluaran dengan visualisasi yang menarik dan kontrol yang intuitif.",
  keywords: ["BudgetWebAPP", "budget", "keuangan", "manajemen keuangan", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "BudgetWebAPP Team" }],
  openGraph: {
    title: "BudgetWebAPP - Manajemen Keuangan Pribadi",
    description: "Kelola keuangan pribadi Anda dengan mudah menggunakan BudgetWebAPP",
    url: "http://localhost:3000",
    siteName: "BudgetWebAPP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BudgetWebAPP - Manajemen Keuangan Pribadi",
    description: "Kelola keuangan pribadi Anda dengan mudah",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
