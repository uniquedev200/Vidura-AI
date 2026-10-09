import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vidura-AI | Enterprise Moral Governance & Strategic Dissent",
  description:
    "Enterprise decision-support engine bridging 3,000-year-old game-theoretic statecraft (Vidura Nīti) with modern engineering compliance standards (ACM & IEEE Codes of Ethics).",
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
    <html lang="en" className={`${inter.variable} ${cinzel.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#08090C] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        {/* Layered Fixed Full-Screen Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Base Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 scale-100"
            style={{
              backgroundImage: "url('/assets/bg.webp'), url('/assets/bg.png')",
              filter: "brightness(0.92) contrast(1.12)",
            }}
          />
          {/* Subtle Atmospheric Cyber-Sabhā Overlays (maintains contrast while keeping sabhā pillars clearly visible) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#08090C]/60 to-[#08090C]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/15 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Dynamic Foreground App Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
