import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Contato | MotoSango - Mototáxi em São Gotardo MG",
  description:
    "Fale com o MotoSango. Central de contato para passageiros e mototaxistas de São Gotardo e Guarda dos Ferreiros MG. Dúvidas, sugestões ou suporte para o aplicativo de mototáxi.",
  alternates: { canonical: "/contato" },
};
import {
  Mail,
  CircleHelp,
  FileText,
  ShieldCheck,
  Bike,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const usefulLinks = [
  {
    icon: <CircleHelp className="w-7 h-7" />,
    title: "Central de Ajuda",
    description: "Respostas para as perguntas mais frequentes.",
    href: "/ajuda",
    accent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    icon: <FileText className="w-7 h-7" />,
    title: "Termos de Uso",
    description: "Regras e condições para uso da plataforma.",
    href: "/termos",
    accent: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Política de Privacidade",
    description: "Como tratamos seus dados e informações.",
    href: "/privacidade",
    accent: "bg-green-500/10 border-green-500/20 text-green-400",
  },
  {
    icon: <Bike className="w-7 h-7" />,
    title: "Para Mototaxistas",
    description: "Informações e cadastro para mototaxistas.",
    href: "/mototaxistas",
    accent: "bg-[#FFC400]/10 border-[#FFC400]/20 text-[#FFC400]",
  },
];

const contactTips = [
  "Descreva seu problema ou dúvida com clareza.",
  "Informe se é passageiro ou mototaxista.",
  "Inclua detalhes relevantes (data, horário, etc.) se for o caso.",
];

export default function ContatoPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Ajuda" }, { label: "Contato" }]}
      kicker="Fale conosco"
      title="FALE COM O MOTOSANGO."
      subtitle="Entre em contato conosco. Estamos prontos para ajudar."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-20 lg:mb-28">
          <div className="relative rounded-3xl overflow-hidden border border-[#FFC400]/20 bg-gradient-to-br from-[#FFC400]/10 via-black to-[#FFC400]/5 p-8 sm:p-10 lg:p-16">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFC400] flex items-center justify-center mb-8 shadow-2xl shadow-[#FFC400]/30">
                <Mail className="w-12 h-12 sm:w-14 sm:h-14 text-black" />
              </div>

              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                E-mail de contato
              </h2>

              <Link
                href="mailto:motosangooficial@gmail.com"
                className="text-[#FFC400] text-xl sm:text-2xl lg:text-3xl font-black hover:text-[#FFD43B] transition-colors break-all mb-6"
              >
                motosangooficial@gmail.com
              </Link>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10">
                <CheckCircle className="w-5 h-5 text-[#FFC400]" />
                <span className="text-white/70 text-sm sm:text-base font-medium">
                  Responderemos em breve.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20 lg:mb-28">
          <SectionTitle
            kicker="Links úteis"
            title="Encontre o que precisa"
            subtitle="Acesse páginas importantes que podem ajudar com suas dúvidas."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {usefulLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-[#FFC400]/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${link.accent}`}>
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-white text-xl font-black">
                        {link.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[#FFC400] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400]">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-white text-2xl lg:text-3xl font-black">
                Dicas para contato
              </h2>
            </div>

            <ul className="space-y-4">
              {contactTips.map((tip, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5">
                    <span className="text-sm font-black">{i + 1}</span>
                  </div>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed pt-1">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
