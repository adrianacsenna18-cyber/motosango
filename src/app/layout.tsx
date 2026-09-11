import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotoSango | Mototáxi em São Gotardo MG",
  description:
    "MotoSango é o aplicativo de mototáxi de São Gotardo MG. Solicite sua corrida de forma rápida e prática pelo celular.",
  metadataBase: new URL("https://motosango.com.br"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MotoSango",
  },
  keywords: [
    "MotoSango",
    "mototáxi",
    "moto táxi",
    "mototaxi",
    "São Gotardo",
    "São Gotardo MG",
    "Guarda dos Ferreiros",
    "mototáxi em São Gotardo",
    "moto táxi em São Gotardo",
    "mototáxi São Gotardo MG",
    "aplicativo de mototáxi",
    "app de mototáxi",
    "chamar mototáxi",
    "pedir mototáxi",
    "solicitar mototáxi",
    "corrida de mototáxi",
    "corrida de moto",
    "mototaxista",
    "Fila Inteligente",
    "transporte",
  ],
  openGraph: {
    title: "MotoSango | Mototáxi em São Gotardo MG",
    description:
      "MotoSango é o aplicativo de mototáxi de São Gotardo MG. Solicite sua corrida de forma rápida e prática pelo celular.",
    type: "website",
    locale: "pt_BR",
    siteName: "MotoSango",
    url: "https://motosango.com.br",
    images: [
      {
        url: "/hero-mototaxista.jpg",
        width: 1920,
        height: 1080,
        alt: "MotoSango - Mototáxi em São Gotardo MG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MotoSango | Mototáxi em São Gotardo MG",
    description:
      "MotoSango é o aplicativo de mototáxi de São Gotardo MG. Solicite sua corrida de forma rápida e prática pelo celular.",
    images: ["/hero-mototaxista.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

const schemaOrgJsonLdTaxiService = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "@id": "https://motosango.com.br#organization",
  name: "MotoSango",
  description:
    "MotoSango é o aplicativo de mototáxi de São Gotardo MG. Solicite sua corrida de forma rápida e prática pelo celular.",
  url: "https://motosango.com.br",
  areaServed: [
    "São Gotardo, MG",
    "Guarda dos Ferreiros, MG",
    "Região de São Gotardo MG",
  ],
  image: "https://motosango.com.br/hero-mototaxista.jpg",
  provider: {
    "@type": "Organization",
    name: "MotoSango",
    url: "https://motosango.com.br",
    logo: "https://motosango.com.br/logo.png",
  },
  inLanguage: "pt-BR",
};

export const viewport: Viewport = {
  themeColor: "#FFC400",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrgJsonLdTaxiService),
          }}
        />
      </head>
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
