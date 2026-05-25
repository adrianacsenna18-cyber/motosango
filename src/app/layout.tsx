import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotoSango - Mototáxi Regional",
  description: "Sistema completo de mototáxi para conectar clientes e mototaxistas de forma simples, rápida e segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50 text-gray-900">
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-lg relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
