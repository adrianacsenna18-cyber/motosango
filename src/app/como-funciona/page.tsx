import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como Funciona | MotoSango - Mototáxi em São Gotardo",
  description:
    "Entenda como usar o MotoSango: do pedido ao embarque. Passo a passo simples para solicitar corrida de mototáxi em São Gotardo MG de forma rápida e segura.",
  alternates: { canonical: "/como-funciona" },
};
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";
import {
  UserPlus,
  MapPin,
  Sparkles,
  BellRing,
  CheckCircle2,
  Route,
  Flag,
  QrCode,
  Banknote,
  Zap,
  CircleHelp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "SOLICITE",
    description:
      "Informe o local de embarque e o destino.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "O MOTOSANGO PROCURA",
    description:
      "O sistema identifica mototaxistas disponíveis próximos ao local.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "A FILA INTELIGENTE ORGANIZA",
    description:
      "As chamadas começam pelos mototaxistas mais próximos.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "O MOTOTAXISTA RECEBE",
    description:
      "A solicitação chega ao celular do mototaxista.",
    icon: BellRing,
  },
  {
    number: "05",
    title: "A CORRIDA É CONFIRMADA",
    description:
      "Quando um mototaxista aceita, a corrida é confirmada.",
    icon: CheckCircle2,
  },
  {
    number: "06",
    title: "ELE VAI ATÉ VOCÊ",
    description:
      "O mototaxista se dirige ao local de embarque.",
    icon: Route,
  },
  {
    number: "07",
    title: "VOCÊ CHEGA AO DESTINO",
    description:
      "A corrida é realizada normalmente.",
    icon: Flag,
  },
];

export default function ComoFuncionaPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Como Funciona" }]}
      kicker="Passo a passo"
      title="COMO FUNCIONA O MOTOSANGO."
      subtitle="Entenda todo o processo de solicitação de corrida, do início ao fim."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        <section>
          <SectionTitle
            kicker="Para Passageiros"
            title="7 PASSOS SIMPLES PARA SUA CORRIDA"
            subtitle="Do momento da solicitação até a chegada ao destino, todo o processo é pensado para ser rápido, seguro e sem complicações."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-[#080B0B] border border-white/5 rounded-2xl p-7 transition-all hover:border-[#FFC400]/30 group"
                >
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center shrink-0 group-hover:bg-[#FFC400] group-hover:border-[#FFC400] transition-all">
                      <Icon className="w-6 h-6 text-[#FFC400] group-hover:text-black transition-all" />
                    </div>
                    <span className="text-white/15 text-5xl font-black leading-none">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-black mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Pagamento"
            title="FORMAS DE PAGAMENTO"
            subtitle="Pagamento simples, seguro e transparente. Você escolhe a forma que preferir."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#080B0B] border border-green-500/15 rounded-3xl p-8 hover:border-green-500/30 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white text-2xl font-black mb-3">PIX</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Se você escolher pagar por Pix, primeiro precisa fazer o pagamento. A solicitação fica aguardando a confirmação. Depois que o Pix for confirmado, a solicitação é liberada para os mototaxistas.
              </p>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                <p className="text-amber-300/90 text-sm leading-relaxed">
                  ⚠️ Se o Pix ainda não estiver confirmado, a solicitação não é liberada.
                </p>
              </div>
            </div>

            <div className="bg-[#080B0B] border border-[#FFC400]/20 rounded-3xl p-8 hover:border-[#FFC400]/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center mb-6">
                <Banknote className="w-8 h-8 text-[#FFC400]" />
              </div>
              <h3 className="text-white text-2xl font-black mb-3">DINHEIRO</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Se você escolher pagar em dinheiro, não precisa pagar antes. A solicitação segue normalmente e o pagamento é feito ao mototaxista conforme o valor da corrida.
              </p>
              <div className="p-4 rounded-2xl bg-[#FFC400]/5 border border-[#FFC400]/15">
                <p className="text-[#FFC400]/90 text-sm leading-relaxed">
                  💵 Sem pagamento antecipado. Apenas pague ao final da corrida diretamente ao mototaxista.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Outra opção para você"
            title="CHAMADA ESPECIAL"
            subtitle="Precisa ir para um local específico? Na Chamada Especial, você informa de onde vai sair e para onde deseja ir e negocia o valor diretamente."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                A solicitação é enviada ao mototaxista, que informa o valor da corrida. Você recebe a proposta e decide se aceita. Simples assim.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Você informa a origem e o destino desejado",
                  "Envia a solicitação pela Chamada Especial",
                  "O mototaxista recebe e informa o valor da corrida",
                  "Você recebe a proposta de valor",
                  "Decide se aceita ou não",
                  "Se aceitar, a corrida é confirmada e o mototaxista vai até você",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FFC400]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#FFC400] font-bold text-sm">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-white/75 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/15">
                  <p className="text-green-300 text-xs font-bold uppercase tracking-wider mb-2">
                    Pagamento por Pix
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    O pagamento precisa ser confirmado antes de a corrida ser liberada.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FFC400]/5 border border-[#FFC400]/15">
                  <p className="text-[#FFC400] text-xs font-bold uppercase tracking-wider mb-2">
                    Pagamento em Dinheiro
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Não existe pagamento antecipado. Pague diretamente ao mototaxista.
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-5 flex items-center gap-2">
                <CircleHelp className="w-4 h-4 text-[#FFC400]" />
                Não aceitou o valor? Você pode fazer uma nova consulta quando quiser.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/5]">
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=person%20talking%20with%20mototaxi%20driver%20about%20destination%20negotiating%20price%20on%20urban%20street%20afternoon%2C%20yellow%20black%20motorbike%20photorealistic&image_size=portrait_4_3"
                  alt="Chamada Especial MotoSango - Negocie o valor da corrida com o passageiro"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080B0B] to-black border border-white/5 p-10 sm:p-14 lg:p-16">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20 mb-8">
                <Zap className="w-3.5 h-3.5 text-[#FFC400]" />
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  Pronto para começar?
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
                Solicite sua primeira corrida agora mesmo.
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                Rápido, seguro e com os melhores mototaxistas da região.
                Chegue ao seu destino com conforto e economia.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton href="/cliente/login" variant="primary">
                  Solicitar Corrida
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
