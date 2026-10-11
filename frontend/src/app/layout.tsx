import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vidura-AI | Archival Statecraft & Engineering Ethics Governance",
  description:
    "Decision-support engine grounding engineering compliance dilemmas in the BORI Critical Edition of Vidura Nīti (Udyoga Parva, Chapters 33-40) and ACM/IEEE Codes of Ethics.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${cinzel.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#08090C] text-[#F3F4F6] selection:bg-amber-500/30 selection:text-amber-100">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/bg.webp'), url('/assets/bg.png')",
              filter: "brightness(0.85) contrast(1.08)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090C]/70 via-[#08090C]/78 to-[#08090C]/92" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
