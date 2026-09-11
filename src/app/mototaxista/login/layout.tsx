import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | MotoSango - Acesso Mototaxista São Gotardo MG",
  description:
    "Acesso do mototaxista ao MotoSango. Faça login e comece a receber corridas em São Gotardo e Guarda dos Ferreiros MG. Aumente sua renda com a Fila Inteligente.",
  alternates: { canonical: "/mototaxista/login" },
};

export default function MototaxistaLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
