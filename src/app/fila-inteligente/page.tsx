import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Fila Inteligente | MotoSango - Mototáxi em São Gotardo",
  description:
    "Conheça a Fila Inteligente do MotoSango: distribuição justa de corridas entre mototaxistas de São Gotardo MG. Atendimento mais rápido para você e mais ganhos para o profissional.",
  alternates: { canonical: "/fila-inteligente" },
};
import {
  UserPlus,
  MapPin,
  Sparkles,
  Users,
  ThumbsUp,
  CheckCircle2,
  Hand,
  ChevronRight,
  Clock,
  Phone,
  Zap,
  Shield,
  Target,
  Scale,
  Timer,
  Layers,
  Gauge,
} from "lucide-react";
import Link from "next/link";

export default function FilaInteligentePage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Fila Inteligente" }]}
      kicker="Diferencial MotoSango"
      title="MENOS ESPERA. MAIS AGILIDADE."
      subtitle="Conheça como a Fila Inteligente organiza cada solicitação para conectar passageiro e mototaxista com rapidez."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 lg:space-y-32">
        {/* DIAGRAMA VISUAL */}
        <section>
          <SectionTitle
            kicker="Fluxo principal"
            title="COMO FUNCIONA O FLUXO."
            subtitle="Veja cada etapa da Fila Inteligente, desde a solicitação até a corrida confirmada."
          />

          <div className="bg-gradient-to-br from-[#FFC400]/5 via-transparent to-[#FFC400]/5 rounded-3xl border border-[#FFC400]/10 p-6 sm:p-10 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: "PASSAGEIRO", icon: UserPlus, highlight: true },
                { label: "LOCALIZAÇÃO", icon: MapPin },
                { label: "FILA INTELIGENTE", icon: Sparkles, highlight: true },
                { label: "MAIS PRÓXIMO", icon: Users },
                { label: "ACEITOU", icon: ThumbsUp, highlight: true },
                { label: "CONFIRMADA", icon: CheckCircle2 },
              ].map((step, i) => (
                <div key={step.label} className="relative">
                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      step.highlight
                        ? "bg-[#FFC400]/10 border-[#FFC400]/30"
                        : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        step.highlight ? "bg-[#FFC400]" : "bg-white/5"
                      }`}
                    >
                      <step.icon
                        className={`w-5 h-5 ${
                          step.highlight ? "text-black" : "text-white/60"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-center ${
                        step.highlight ? "text-[#FFC400]" : "text-white/70"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < 5 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 max-w-md mx-auto">
              <Hand className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm font-semibold text-center">
                NÃO ACEITOU → A CHAMADA PASSA PARA O PRÓXIMO
              </p>
            </div>
          </div>
        </section>

        {/* 9 PASSOS DETALHADOS */}
        <section>
          <SectionTitle
            kicker="Passo a passo"
            title="9 ETAPAS ATÉ A CONFIRMAÇÃO."
            subtitle="Entenda cada detalhe de como a Fila Inteligente trabalha para conectar você rapidamente."
          />

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "1",
                title: "Você solicita",
                desc: "O passageiro informa o local de embarque e destino, depois solicita a corrida.",
                icon: UserPlus,
              },
              {
                num: "2",
                title: "Identifica mototaxistas",
                desc: "O MotoSango encontra todos os mototaxistas disponíveis próximos ao local.",
                icon: Users,
              },
              {
                num: "3",
                title: "Fila organiza",
                desc: "A Fila Inteligente ordena os mototaxistas, começando pelos mais próximos.",
                icon: Sparkles,
              },
              {
                num: "4",
                title: "Primeiro recebe",
                desc: "O primeiro mototaxista da fila recebe a solicitação no seu celular.",
                icon: Target,
              },
              {
                num: "5",
                title: "Tempo para responder",
                desc: "Ele tem um tempo definido para abrir a oferta de corrida.",
                icon: Clock,
              },
              {
                num: "6",
                title: "Próximo se não responder",
                desc: "Sem resposta dentro do tempo? A chamada passa para o próximo mototaxista.",
                icon: ChevronRight,
              },
              {
                num: "7",
                title: "Tempo para aceitar",
                desc: "Ao abrir a oferta, o mototaxista tem tempo para decidir se aceita a corrida.",
                icon: Timer,
              },
              {
                num: "8",
                title: "Próximo se não aceitar",
                desc: "Se não aceitar, a chamada segue para o próximo mototaxista da fila.",
                icon: Gauge,
              },
              {
                num: "9",
                title: "Corrida confirmada",
                desc: "Ao aceitar, a corrida é confirmada e o mototaxista vai até o embarque.",
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#FFC400]/20 transition-colors"
              >
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] font-black text-sm">
                    {item.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white/50" />
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFÍCIOS PASSAGEIRO */}
        <section className="bg-[#080B0B] rounded-3xl border border-white/5 p-8 sm:p-10 lg:p-14">
          <SectionTitle
            kicker="Para passageiros"
            title="BENEFÍCIOS PARA VOCÊ."
            subtitle="A Fila Inteligente foi pensada para tornar sua experiência a melhor possível."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Target,
                title: "Proximidade",
                desc: "Sempre o mototaxista mais próximo receberá sua solicitação primeiro.",
              },
              {
                icon: Scale,
                title: "Ordem justa",
                desc: "A fila organiza a ordem de forma transparente, por distância.",
              },
              {
                icon: Timer,
                title: "Sem espera longa",
                desc: "Se um mototaxista não responder, rapidamente passa para o próximo.",
              },
              {
                icon: Layers,
                title: "Simplicidade",
                desc: "Você solicita e a Fila Inteligente cuida de todo o resto.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#FFC400]/30 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 flex items-center justify-center mb-4 group-hover:bg-[#FFC400]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#FFC400]" />
                </div>
                <h3 className="text-white font-black text-base mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFÍCIOS MOTOTAXISTA */}
        <section>
          <SectionTitle
            kicker="Para mototaxistas"
            title="BENEFÍCIOS PARA O PROFISSIONAL."
            subtitle="A Fila Inteligente também traz vantagens para quem trabalha com a MotoSango."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Layers,
                title: "Ordem clara",
                desc: "Você sabe exatamente quando sua vez chega, por ordem de proximidade.",
              },
              {
                icon: Scale,
                title: "Chance igual",
                desc: "Todos os mototaxistas têm a mesma chance, respeitando a distância.",
              },
              {
                icon: Target,
                title: "Proximidade",
                desc: "Recebe primeiro as corridas mais próximas de você, otimizando seu tempo.",
              },
              {
                icon: Zap,
                title: "Simples de usar",
                desc: "Só precisa estar disponível e aceitar as corridas que aparecerem.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/5 hover:border-[#FFC400]/30 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFC400]/10 flex items-center justify-center mb-4 group-hover:bg-[#FFC400]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#FFC400]" />
                </div>
                <h3 className="text-white font-black text-base mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section>
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 lg:p-16 bg-gradient-to-br from-[#FFC400] via-[#FFD43B] to-[#FFC400] shadow-2xl shadow-[#FFC400]/20">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative text-center">
              <h2 className="text-black text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
                EXPERIMENTE A FILA INTELIGENTE AGORA.
              </h2>
              <p className="text-black/70 text-lg mb-10 max-w-2xl mx-auto">
                Passageiro: solicite sua corrida. Mototaxista: cadastre-se e
                comece a receber suas corridas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton
                  href="/cliente/login"
                  variant="primary"
                  icon={<Phone className="w-5 h-5" strokeWidth={2.5} />}
                >
                  SOU CLIENTE — ENTRAR
                </CTAButton>
                <Link
                  href="/mototaxista/cadastro"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold transition-all bg-black text-[#FFC400] hover:bg-[#1a1a1a] shadow-xl shadow-black/20 hover:-translate-y-0.5"
                >
                  QUERO SER MOTOTAXISTA
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
