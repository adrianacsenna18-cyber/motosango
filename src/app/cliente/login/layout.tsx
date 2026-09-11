import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | MotoSango - Acesso Passageiro São Gotardo MG",
  description:
    "Acesse sua conta no MotoSango para pedir corrida de mototáxi em São Gotardo MG. Login rápido para passageiros usando o aplicativo de mobilidade local.",
  alternates: { canonical: "/cliente/login" },
};

export default function ClienteLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
