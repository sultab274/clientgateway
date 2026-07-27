import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar/Navbar";
import { getUser } from "@/lib/dal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "ClientGateway — Control Cash Flow With Confidence",
  description:
    "ClientGateway helps businesses manage invoices, payments, and financial operations through one intelligent platform.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "ClientGateway — Control Cash Flow With Confidence",
    description:
      "ClientGateway helps businesses manage invoices, payments, and financial operations through one intelligent platform.",
    type: "website",
    siteName: "ClientGateway",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientGateway — Control Cash Flow With Confidence",
    description:
      "ClientGateway helps businesses manage invoices, payments, and financial operations through one intelligent platform.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-surface-primary text-text-primary">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
