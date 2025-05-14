import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/app/context/formContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Celebrate the K-Wave with Your #AsliKoreanAvatar | Burger King India",
  description:
    "K-pop fans and Korean spice lovers, it's your moment! Upload your pic, get your #AsliKoreanAvatar, and share it to win exclusive Korean Burgers. Join the Korean Spicy Fest at Burger King and taste the real K-flavour!",
  icons: {
    icon: "https://www.bkmanhwaverse.com/favicon.png", // Optional: your site favicon
  },
  openGraph: {
    title: "Celebrate the K-Wave with Your #AsliKoreanAvatar",
    description:
      "Join the Korean Spicy Fest at Burger King and taste the real K-flavour!",
    url: "https://www.bkmanhwaverse.com/og-image.jpg", // ✅ Root URL of your site
    siteName: "Burger King India",
    images: [
      {
        url: "https://www.bkmanhwaverse.com/og-image.jpg", // ✅ ABSOLUTE URL
        width: 1200,
        height: 630,
        alt: "Burger King Korean Avatar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Celebrate the K-Wave with Your #AsliKoreanAvatar",
    description:
      "Join the Korean Spicy Fest at Burger King and taste the real K-flavour!",
    images: ["https://www.bkmanhwaverse.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S4J7YMR26E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S4J7YMR26E');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FormProvider>{children}</FormProvider>
      </body>
    </html>
  );
}
