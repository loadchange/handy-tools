import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HandyTools - Developer Powerhouse",
  description: "A futuristic collection of high-performance tools designed for the modern developer. Encrypt, convert, and optimize with precision.",
  keywords: ["productivity", "converter", "website", "react", "tools", "frontend", "developer-tools", "crypto", "formatter", "handy-tools"],
  authors: [{ name: "HandyTools Team" }],
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-0253215019029303",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#7c3aed" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
