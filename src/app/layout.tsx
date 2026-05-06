import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "AYEYE | The Art of Celebration",
    template: "%s | AYEYE",
  },
  description: "A curated ecosystem for distinguished Nigerian celebrations. Find verified photographers, caterers, decorators, DJs and more.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  openGraph: {
    siteName: "AYEYE",
    type: "website",
    locale: "en_NG",
    title: "AYEYE | The Art of Celebration",
    description: "A curated ecosystem for distinguished Nigerian celebrations. Find verified photographers, caterers, decorators, DJs and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AYEYE | The Art of Celebration",
    description: "A curated ecosystem for distinguished Nigerian celebrations.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
