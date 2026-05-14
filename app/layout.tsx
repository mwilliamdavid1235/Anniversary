import type { Metadata } from "next";
import { Lora, Inter, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Among the Stars — 28 Years",
  description: "A private anniversary itinerary. Twenty-eight years.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${dmMono.variable} h-full`}
      suppressHydrationWarning
    >
      {/* Anti-flash: sets data-theme before React hydrates */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var o=localStorage.getItem('theme_override');var h=new Date().getHours();var a=(h>=20||h<7)?'night':'day';document.documentElement.setAttribute('data-theme',o||a);}catch(e){}})();` }} />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
