import type { Metadata } from "next";
import { Archivo, Marcellus, Noto_Serif_Georgian } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

/* Serif display face — closest Google match to the TSOMI logotype lettering */
const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Serif_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TSOMI — ცომი · Made in Georgia",
    // Pages set clean titles ("Catalog"); the brand is appended once, here.
    template: "%s — TSOMI",
  },
  description:
    "TSOMI (ცომი) — dough, worn daily. Khachapuri shoppers and khinkali tees, made in Georgia.",
  applicationName: "TSOMI",
  openGraph: {
    type: "website",
    siteName: "TSOMI",
    title: "TSOMI — ცომი · Made in Georgia",
    description:
      "TSOMI (ცომი) — dough, worn daily. Khachapuri shoppers and khinkali tees, made in Georgia.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TSOMI — ცომი" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#f6efe1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${marcellus.variable} ${notoGeorgian.variable} bg-cream text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
