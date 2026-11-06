import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/layout/ClientShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Love Heals · NARA - Compassionate Breast Cancer Accompaniment",
  description:
    "Comprehensive emotional, clinical, and practical support to guide you through diagnosis, active treatment, and breast cancer recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${playfair.variable} ${plusJakarta.variable} bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed`}
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
