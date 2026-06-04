import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotoSango - Mototáxi Regional",
  description: "Sistema completo de mototáxi para conectar clientes e mototaxistas de forma simples, rápida e segura.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MotoSango",
  },
  themeColor: "#FFD000",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-black text-white">
        <main className="max-w-md mx-auto min-h-screen bg-black shadow-lg relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
