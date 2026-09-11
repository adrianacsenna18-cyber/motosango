import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central de Ajuda | MotoSango - Mototáxi São Gotardo MG",
  description:
    "Central de Ajuda MotoSango: perguntas frequentes para passageiros e mototaxistas de São Gotardo e Guarda dos Ferreiros. Tire suas dúvidas sobre corridas, pagamentos, cadastro e o aplicativo de mototáxi.",
  alternates: { canonical: "/ajuda" },
};

export default function AjudaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
