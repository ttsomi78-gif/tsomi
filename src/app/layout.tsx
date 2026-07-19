import type { Metadata } from "next";
import { Archivo, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export const metadata: Metadata = {
  title: "TSOMI — ცომი | Georgian Streetwear",
  description:
    "TSOMI (ცომი) — streetwear raised on khinkali and khachapuri. Georgian dough culture, worn daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${notoGeorgian.variable} bg-cream text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
