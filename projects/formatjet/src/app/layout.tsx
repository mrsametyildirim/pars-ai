import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  display:  "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FormatJet — PDF, Görsel, Video ve Ses Dönüştürücü",
    template: "%s | FormatJet",
  },
  description:
    "84+ araçla PDF birleştir, görsel sıkıştır, video dönüştür, arka plan kaldır. Ücretsiz, hızlı, tarayıcıda çalışır.",
  keywords: [
    "pdf birleştir", "pdf sıkıştır", "görsel sıkıştır", "arka plan kaldır",
    "video mp3", "heic jpg", "webp jpg", "word pdf",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://formatjet.com",
    siteName: "FormatJet",
    title: "FormatJet — PDF, Görsel, Video ve Ses Araçları",
    description: "84+ araçla dosya dönüştür, sıkıştır, düzenle. Tarayıcıda çalışır.",
    images: [{ url: "/logo.png" }],
  },
  metadataBase: new URL("https://formatjet.com"),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
