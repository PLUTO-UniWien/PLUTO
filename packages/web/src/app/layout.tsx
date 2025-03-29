import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UmamiAnalytics from "@/modules/umami/component";
import { env } from "@/env";
import { Navigation } from "@/modules/navigation";
import Footer from "@/modules/footer/component";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static default metadata, to be overridden by page-specific metadata
export const metadata: Metadata = {
  title: "PLUTO - Public Value Assessment Tool",
  description: "A tool for assessing the benefits and risks of specific instances of data use",
  authors: [
    { name: "Seliem El-Sayed" },
    { name: "Barbara Prainsack" },
    { name: "Connor Hogan" },
    { name: "Torsten Möller" },
    { name: "Bernhard Jordan" },
    { name: "Laura Koesten" },
    { name: "Péter Ferenc Gyarmati", url: "https://peter.gy" },
  ],
  openGraph: {
    title: "PLUTO - Public Value Assessment Tool",
    description: "A tool for assessing the benefits and risks of specific instances of data use",
    images: {
      url: "https://minio.peter.gy/static/assets/pluto/pluto-og-image-generic.png",
      width: 1200,
      height: 630,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
            <div className="bg-primary-foreground rounded-lg shadow-sm p-6 sm:p-8">{children}</div>
          </main>
          <Footer />
        </div>
        <UmamiAnalytics
          scriptUrl={env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
          websiteId={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
        <Toaster position="top-right" expand={true} />
      </body>
    </html>
  );
}
