import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aduanas Chile - NewCooltura Informada",
  description: "Buscador de aduanas y pasos fronterizos, calculadora de aranceles de importacion, franquicias y tramites aduaneros en Chile",
  keywords: ["aduanas chile", "pasos fronterizos", "aranceles importacion", "franquicias aduaneras", "tramites aduaneros", "calculadora impuestos"],
  openGraph: {
    title: "Aduanas Chile - NewCooltura Informada",
    description: "Buscador de aduanas, calculadora de aranceles y tramites aduaneros",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
