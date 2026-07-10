import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Footer } from "@/components/Footer";
import { MobileFooter } from "@/components/MobileFooter";
import { Providers } from "@/components/Providers";
import { getSession } from "@/lib/auth";
import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/JsonLd";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a1628",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Printing Services in Vadodara`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.contactPerson }],
  creator: SITE.name,
  applicationName: SITE.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.name,
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Printing Services`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/kg-logo-main.jpeg",
    apple: "/icons/kg-logo-main.jpeg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-hidden font-sans touch-manipulation antialiased">
        <JsonLd />
        <Providers>
          <SplashScreen />
          <AppShell user={user}>{children}</AppShell>
          <MobileFooter />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
