import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "PB Rutinan Rabu";
const description = "Pengelolaan latihan dan keuangan klub badminton";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  applicationName: title,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
      { url: "/pwa-icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title,
    description,
    images: [
      {
        url: "/pb-rutinan-rabu-thumbnail.png",
        width: 2560,
        height: 1440,
        alt: "PB Rutinan Rabu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/pb-rutinan-rabu-thumbnail.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4169dc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-slate-100 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
