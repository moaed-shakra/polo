import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { PostHogProvider } from "./components/PosthogProvider";
import { MotionConfig } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ppNeue = localFont({
  src: "../fonts/PPNeueMontreal-Medium.otf",
  variable: "--font-pp-neue",
});

const ppSupply = localFont({
  src: "../fonts/PPSupplySans-Regular.otf",
  variable: "--font-pp-supply",
});

export const metadata: Metadata = {
  title: "Polo",
  description: "Watch AI browse the web, for free",
  openGraph: {
    images: ["/og.png"],
    title: "Polo",
    description: "Watch AI browse the web, for free",
    url: "https://polo.browserbase.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Fallback for browsers that don't support SVG favicons */}
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${ppNeue.variable} ${ppSupply.variable} font-sans antialiased bg-white text-gray-900 min-h-full flex flex-col`}
      >
        <MotionConfig
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <PostHogProvider>
            <Header />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
          </PostHogProvider>
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
