import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Seja Mototaxista | MotoSango - São Gotardo MG",
  description:
    "Seja mototaxista do MotoSango em São Gotardo MG. Faça parte de uma equipe com fila inteligente, corridas reais e ganhos justos. Cadastre-se agora e aumente sua renda.",
  alternates: { canonical: "/mototaxistas" },
};
import {
  UserPlus,
  Wifi,
  PhoneCall,
  Search,
  BellRing,
  CheckCircle2,
  ArrowRightCircle,
  ListOrdered,
  MapPin,
  Smartphone,
  Wallet,
  History,
  FileCheck,
  Users,
  Navigation,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "CADASTRE-SE",
    description:
      "Faça seu cadastro de forma rápida e simples. Basta preencher seus dados e documentos.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "FIQUE DISPONÍVEL",
    description:
      "Ative o modo disponível no aplicativo sempre que quiser receber corridas.",
    icon: Wifi,
  },
  {
    number: "03",
    title: "PASSAGEIRO SOLICITA",
    description:
      "O passageiro abre o app e solicita uma moto para o seu destino.",
    icon: PhoneCall,
  },
  {
    number: "04",
    title: "PROCURA MAIS PRÓXIMOS",
    description:
      "O sistema localiza todos os mototaxistas disponíveis mais próximos do passageiro.",
    icon: Search,
  },
  {
    number: "05",
    title: "VOCÊ RECEBE A SOLICITAÇÃO",
    description:
      "Uma notificação chega no seu celular com os dados da corrida e valor.",
    icon: BellRing,
  },
  {
    number: "06",
    title: "VOCÊ ACEITA",
    description:
      "Ao aceitar, você recebe as informações completas e segue para encontrar o passageiro.",
    icon: CheckCircle2,
  },
  {
    number: "07",
    title: "NÃO ACEITOU? PRÓXIMO.",
    description:
      "Se não puder ou não quiser aceitar, a solicitação passa automaticamente para o próximo da fila.",
    icon: ArrowRightCircle,
  },
];

const benefits = [
  {
    title: "Organização da Fila Inteligente",
    description:
      "Sistema de fila justo que organiza as solicitações por proximidade e tempo de espera.",
    icon: ListOrdered,
  },
  {
    title: "Chamadas por proximidade",
    description:
      "Receba solicitações de passageiros que estão mais próximos de você, otimizando seu tempo.",
    icon: MapPin,
  },
  {
    title: "Simplicidade no app",
    description:
      "Interface intuitiva e fácil de usar, sem complicações no dia a dia.",
    icon: Smartphone,
  },
  {
    title: "Área financeira",
    description:
      "Controle completo dos seus ganhos, extratos detalhados e relatórios.",
    icon: Wallet,
  },
  {
    title: "Histórico de corridas",
    description:
      "Acesse todo o histórico das suas corridas, com valores, datas e informações completas.",
    icon: History,
  },
  {
    title: "Cadastro simples",
    description:
      "Cadastre-se rapidamente, com poucos passos e documentação simplificada.",
    icon: FileCheck,
  },
];

const howItFinds = [
  {
    title: "Passageiro solicita",
    description:
      "O passageiro abre o aplicativo e informa o local de embarque e destino desejado.",
    icon: PhoneCall,
  },
  {
    title: "Identifica disponíveis próximos",
    description:
      "O sistema identifica automaticamente todos os mototaxistas que estão disponíveis nas proximidades.",
    icon: Users,
  },
  {
    title: "Fila organiza",
    description:
      "A Fila Inteligente organiza e distribui as solicitações de forma justa e eficiente.",
    icon: ListOrdered,
  },
  {
    title: "Você pode estar em qualquer local",
    description:
      "Quando disponível, o MotoSango poderá encontrar você em qualquer local da cidade.",
    icon: Navigation,
  },
];

export default function MototaxistasPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Para Mototaxistas" }]}
      kicker="Profissionais de moto"
      title="VOCÊ É MOTOTAXISTA? FAÇA PARTE DO MOTOSANGO."
      subtitle="Receba solicitações de passageiros em seu celular e trabalhe de forma organizada com a Fila Inteligente."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <section>
          <SectionTitle
            kicker="Entenda"
            title="COMO O MOTOSANGO ENCONTRA VOCÊ"
            subtitle="Saiba como o sistema localiza os mototaxistas disponíveis e distribui as corridas de forma inteligente."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItFinds.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#FFC400]/30 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-[#FFC400]" />
                </div>
                <div className="text-[#FFC400] font-black text-sm mb-2">
                  PASSO {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Passo a passo"
            title="7 PASSOS PARA VOCÊ COMEÇAR"
            subtitle="Siga os passos abaixo e comece a receber corridas com o MotoSango hoje mesmo."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-[#FFC400]/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#FFC400] text-black flex items-center justify-center font-black text-lg">
                    {step.number}
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#FFC400]/10 group-hover:border-[#FFC400]/30 transition-all">
                    <step.icon className="w-5 h-5 text-white/70 group-hover:text-[#FFC400] transition-colors" />
                  </div>
                </div>
                <h3 className="text-white font-black text-base mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Vantagens"
            title="BENEFÍCIOS PARA MOTOTAXISTAS"
            subtitle="Tudo que você precisa para trabalhar com organização, segurança e mais ganhos."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] hover:border-[#FFC400]/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC400]/20 to-[#FFC400]/5 border border-[#FFC400]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-[#FFC400]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFC400]/5 via-transparent to-[#FFC400]/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC400]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC400]/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20">
                <UserCheck className="w-4 h-4 text-[#FFC400]" />
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  Comece agora
                </span>
              </div>

              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] mb-5">
                PRONTO PARA TRABALHAR COM{" "}
                <span className="text-[#FFC400]">ORGANIZAÇÃO?</span>
              </h2>

              <p className="text-white/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                Milhares de mototaxistas já estão usando o MotoSango para
                receber corridas de forma organizada. Venha fazer parte você
                também!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton href="/mototaxista/cadastro" variant="primary">
                  QUERO SER MOTOTAXISTA
                </CTAButton>
                <CTAButton href="/mototaxista/login" variant="secondary">
                  JÁ SOU CADASTRADO
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
