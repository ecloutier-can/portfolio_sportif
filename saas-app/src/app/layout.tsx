import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

export const metadata: Metadata = {
  title: "ProAthlete Portfolio | Créez votre vitrine sportive",
  description: "La plateforme de référence pour les athlètes de haut niveau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${lexend.variable}`}>
      <body className="bg-black text-white font-sans">{children}</body>
    </html>
  );
}
