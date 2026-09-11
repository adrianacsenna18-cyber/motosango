import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro de Mototaxista | MotoSango - São Gotardo MG",
  description:
    "Cadastre-se como mototaxista no MotoSango em São Gotardo MG. Receba corridas reais através da Fila Inteligente e aumente sua renda trabalhando com mobilidade local.",
  alternates: { canonical: "/mototaxista/cadastro" },
};

export default function MototaxistaCadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
