import "./globals.css";
import { env } from "@/env";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { getCanonicalUrl } from "@/modules/seo/utils";
import { Navigation } from "@/modules/navigation";
import { StructuredData } from "@/modules/seo/structured-data";
import { Toaster } from "@/components/ui/sonner";
import ClarityAnalytics from "@/modules/analytics/clarity/component";
import Footer from "@/modules/footer/component";
import UmamiAnalytics from "@/modules/analytics/umami/component";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Static default metadata, to be overridden by page-specific metadata
export const metadata: Metadata = {
  title: {
    default: "PLUTO - Public Value Assessment Tool",
    template: "%s | PLUTO",
  },
  description: "A tool for assessing the benefits and risks of specific instances of data use",
  keywords: ["data governance", "public value", "assessment tool", "data ethics", "privacy"],
  authors: [
    { name: "Seliem El-Sayed" },
    { name: "Barbara Prainsack" },
    { name: "Connor Hogan" },
    { name: "Torsten Möller" },
    { name: "Bernhard Jordan" },
    { name: "Laura Koesten" },
    { name: "Péter Ferenc Gyarmati", url: "https://peter.gy" },
  ],
  creator: "PLUTO Project Team",
  publisher: "University of Vienna",
  robots: {
    index: env.NEXT_PUBLIC_APP_FLAVOR === "prod",
    follow: env.NEXT_PUBLIC_APP_FLAVOR === "prod",
    googleBot: {
      index: env.NEXT_PUBLIC_APP_FLAVOR === "prod",
      follow: env.NEXT_PUBLIC_APP_FLAVOR === "prod",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "PLUTO - Public Value Assessment Tool",
    description: "A tool for assessing the benefits and risks of specific instances of data use",
    siteName: "PLUTO",
    images: {
      url: "https://raw.githubusercontent.com/PLUTO-UniWien/PLUTO/refs/heads/main/packages/web/public/pluto-og-image-generic.png",
      width: 1200,
      height: 630,
      alt: "PLUTO - Public Value Assessment Tool",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "PLUTO - Public Value Assessment Tool",
    description: "A tool for assessing the benefits and risks of specific instances of data use",
    images: [
      "https://raw.githubusercontent.com/PLUTO-UniWien/PLUTO/refs/heads/main/packages/web/public/pluto-og-image-generic.png",
    ],
  },
  ...(getCanonicalUrl() && {
    alternates: {
      canonical: getCanonicalUrl(),
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="bg-primary-foreground rounded-lg shadow-sm p-6 sm:p-8">{children}</div>
          </main>
          <Footer />
        </div>
        {env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <UmamiAnalytics
            strategy="beforeInteractive"
            scriptUrl={env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            websiteId={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        {env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <ClarityAnalytics
            strategy="afterInteractive"
            projectId={env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
          />
        )}
        <Toaster position="top-right" expand={true} />
      </body>
    </html>
  );
}
