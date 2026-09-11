import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Segurança | MotoSango - Mototáxi em São Gotardo MG",
  description:
    "Segurança em primeiro lugar no MotoSango. Mototaxistas verificados, dados compartilhados e suporte durante toda a corrida de mototáxi em São Gotardo e Guarda dos Ferreiros.",
  alternates: { canonical: "/seguranca" },
};
import {
  UserCheck,
  MapPin,
  FileText,
  Users,
  Bike,
  BookOpen,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  Lock,
  HardHat,
  UserCircle,
  Route,
  AlertTriangle,
  Phone,
  Mail,
  CircleDot,
} from "lucide-react";
import Link from "next/link";

const securityCards = [
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: "Cadastro de mototaxistas",
    description:
      "Todos os mototaxistas passam por processo de cadastro, com apresentação de documentos e dados para identificação.",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Uso da localização",
    description:
      "A localização é utilizada para conectar passageiros e mototaxistas mais próximos, organizar a Fila Inteligente e organizar cada solicitação.",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Informações da solicitação",
    description:
      "Ao solicitar uma corrida, os dados de origem, destino e forma de pagamento ficam registrados para ambas as partes.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Atendimento organizado pela Fila",
    description:
      "O sistema de fila organiza as corridas de forma transparente, definindo a ordem de atendimento dos mototaxistas cadastrados.",
  },
  {
    icon: <Bike className="w-8 h-8" />,
    title: "Informações claras de corrida",
    description:
      "Antes de iniciar, passageiro e mototaxista visualizam os dados um do outro, incluindo nome e informações do veículo.",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Orientações para ambos",
    description:
      "Disponibilizamos orientações para passageiros e mototaxistas sobre boas práticas e comportamento durante o atendimento.",
  },
];

const passengerTips = [
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Confira informações da corrida",
    description:
      "Antes de embarcar, verifique se os dados do mototaxista e do veículo correspondem às informações exibidas no aplicativo.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Comunique-se claramente",
    description:
      "Informe corretamente o ponto de embarque, destino e quaisquer detalhes importantes para o trajeto antes de iniciar a corrida.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verifique o mototaxista",
    description:
      "Confira a identificação do mototaxista e, em caso de dúvidas, cancele a corrida e procure ajuda.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Mantenha objetos pessoais seguros",
    description:
      "Cuide de seus pertences durante toda a corrida e confira se não deixou nada para trás ao desembarcar.",
  },
];

const riderTips = [
  {
    icon: <HardHat className="w-5 h-5" />,
    title: "Mantenha capacete e equipamentos",
    description:
      "Utilize sempre capacete e equipamentos de proteção, tanto para você quanto para o passageiro. Verifique as condições da moto antes de cada corrida.",
  },
  {
    icon: <UserCircle className="w-5 h-5" />,
    title: "Confira dados do passageiro",
    description:
      "Ao chegar ao ponto de embarque, confirme a identidade do passageiro e os dados da corrida antes de iniciar o trajeto.",
  },
  {
    icon: <Route className="w-5 h-5" />,
    title: "Informe claramente o trajeto",
    description:
      "Comunique ao passageiro qual rota será seguida. Se houver alterações no caminho, explique o motivo antes de mudar.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Dirija com segurança e responsabilidade",
    description:
      "Respeite as leis de trânsito, mantenha velocidade adequada e evite manobras perigosas. O bem-estar do passageiro é prioridade.",
  },
];

export default function SegurancaPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Segurança" }]}
      kicker="Sua tranquilidade"
      title="SEGURANÇA EM PRIMEIRO LUGAR."
      subtitle="Conheça as medidas do MotoSango para um atendimento seguro para passageiros e mototaxistas."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-20 lg:mb-28">
          <SectionTitle
            kicker="Medidas da plataforma"
            title="Como trabalhamos para um atendimento mais seguro"
            subtitle="Conheça os recursos e processos do MotoSango que ajudam na organização e transparência das corridas."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {securityCards.map((card, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-[#FFC400]/30 hover:bg-white/[0.05] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] mb-5">
                  {card.icon}
                </div>
                <h3 className="text-white text-xl font-black mb-3">
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 lg:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <UserCircle className="w-6 h-6" />
                </div>
                <h2 className="text-white text-2xl lg:text-3xl font-black">
                  Orientações para Passageiros
                </h2>
              </div>

              <ul className="space-y-5">
                {passengerTips.map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400]">
                  <Bike className="w-6 h-6" />
                </div>
                <h2 className="text-white text-2xl lg:text-3xl font-black">
                  Orientações para Mototaxistas
                </h2>
              </div>

              <ul className="space-y-5">
                {riderTips.map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        {tip.title}
                      </h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-20 lg:mb-28">
          <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-yellow-500/10 via-red-500/5 to-red-500/10 p-8 lg:p-12">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                  Aviso importante
                </h2>
                <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-4">
                  <strong className="text-yellow-400">
                    Não prometemos 100% de segurança.
                  </strong>{" "}
                  O MotoSango é uma plataforma que conecta passageiros e
                  mototaxistas, oferecendo estrutura e organização para as
                  corridas, mas{" "}
                  <strong className="text-white">
                    a segurança é responsabilidade de cada um agir com cuidado,
                    atenção e respeito mútuo.
                  </strong>
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Em caso de situações de risco, emergência ou irregularidades,
                  contate as autoridades competentes imediatamente e utilize
                  nossos canais de atendimento para relatar o ocorrido.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 p-8 lg:p-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>

          <div className="relative max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-[#FFC400]" />
            </div>

            <SectionTitle
              kicker="Fale conosco"
              title="Precisa de ajuda ou quer relatar algo?"
              subtitle="Nossa equipe está disponível para ouvir suas dúvidas, sugestões ou relatos. Entre em contato através dos nossos canais."
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton
                href="/contato"
                icon={<Mail className="w-4 h-4" />}
              >
                Ir para Contato
              </CTAButton>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                <CircleDot className="w-4 h-4" />
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
