import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "MotoSango | Mototáxi em São Gotardo MG",
  description:
    "MotoSango é o aplicativo de mototáxi de São Gotardo MG. Solicite corridas rápidas, seguras e práticas pelo celular. Atendimento em São Gotardo e Guarda dos Ferreiros.",
  alternates: { canonical: "/" },
};
import SiteFooter from "@/components/site/SiteFooter";
import {
  MapPin,
  Zap,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Phone,
  UserCheck,
  Route,
  Flag,
  CheckCircle2,
  CircleDot,
  Banknote,
  CreditCard,
  Sparkles,
  Lock,
  Building2,
  Smartphone,
  ChevronRight,
  ChevronDown,
  CircleHelp,
  UserPlus,
  Eye,
  BellRing,
  ThumbsUp,
  Hand,
  Wallet,
} from "lucide-react";
import Link from "next/link";

function SmartphoneMockup() {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[255px] md:w-[280px] drop-shadow-[0_35px_80px_rgba(0,0,0,0.7)] -rotate-[2deg]">
      <div className="relative rounded-[2.4rem] border-[10px] border-[#0B0B0B] bg-[#0B0B0B] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_0_3px_rgba(255,255,255,0.03)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0B0B0B] rounded-[1.2rem] z-40 mt-1"></div>

        <div className="bg-[#EEF1F4] rounded-[1.55rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-2.5">
            <span className="text-[#111827] font-bold text-[11px] tracking-tight">
              09:49
            </span>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="10" viewBox="0 0 18 12" fill="none">
                <path
                  d="M1 11h2v-3H1v3zm4 0h2V6H5v5zm4 0h2V3H9v8zm4 0h2V0h-2v11z"
                  fill="#111827"
                />
              </svg>
              <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 10.8c.44 0 .8-.36.8-.8s-.36-.8-.8-.8-.8.36-.8.8.36.8.8.8zm4.6-4.4c-1.13-1.13-2.7-1.75-4.6-1.75S4.53 5.27 3.4 6.4l1.13 1.13C5.44 6.62 6.66 6.05 8 6.05s2.56.57 3.47 1.48l1.13-1.13zM13.74 1.66C10.45-1.63 5.55-1.63 2.26 1.66l1.13 1.13C6.07.11 9.93.11 12.61 2.8l1.13-1.14z"
                  fill="#111827"
                />
              </svg>
              <div className="relative w-6 h-3 rounded-sm border-[1.5px] border-[#111827]">
                <div className="absolute inset-0.5 bg-[#111827] rounded-[1px]" style={{ width: "78%" }}></div>
                <div className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[2px] h-[6px] bg-[#111827] rounded-sm"></div>
                <span className="absolute -top-[1px] right-[3px] text-[8px] font-bold text-[#111827] leading-none">
                  78
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#EEF1F4] px-3 pt-8 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                <span className="text-[#1a1a1a] font-bold text-sm">
                  Olá, Maria
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-gray-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#6B7280" />
                  <path
                    d="M4 20c0-4 4-7 8-7s8 3 8 7"
                    fill="#6B7280"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-t-[2.2rem] -mt-1 relative z-10 px-3.5 pt-4 pb-3.5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏍️</span>
              <h2 className="text-[#0b0b0b] font-black text-2xl sm:text-[1.55rem] leading-tight">
                Para onde vamos?
              </h2>
            </div>

            <div className="pt-0.5">
              <p className="text-[#334155] font-semibold text-base mb-2.5">
                Onde você está?
              </p>
              <div className="flex items-start gap-2 mb-3 px-1">
                <span className="text-red-500 mt-1 shrink-0 text-sm">📍</span>
                <p className="text-[#4B5563] text-sm leading-snug">
                  Permita sua localização para encontrarmos o mototaxista mais
                  próximo de você.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#F6F7F9] rounded-2xl px-3 py-3 flex items-center gap-2.5 border border-gray-100 shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 shrink-0"></div>
                <span className="text-red-500 shrink-0 text-sm">📍</span>
                <div className="flex-1">
                  <p className="text-[#111827] text-sm font-semibold">
                    Localização atual
                  </p>
                </div>
                <button className="bg-[#FEF3C7] text-black text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  📍 GPS
                </button>
              </div>

              <div className="bg-[#F6F7F9] rounded-2xl px-3 py-3 border border-gray-100 shadow-inner">
                <p className="text-[#9CA3AF] text-sm font-medium">
                  Número ou complemento (Ex: 123, casa azul, portã
                </p>
              </div>

              <div className="bg-white rounded-2xl px-3 py-3 border-[3px] border-[#FACC15] flex items-center justify-between shadow-sm">
                <p className="text-[#9CA3AF] text-sm font-medium pl-2">
                  &nbsp;
                </p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              <div className="bg-[#F6F7F9] rounded-2xl px-3 py-3 border border-gray-100 shadow-inner">
                <p className="text-[#9CA3AF] text-sm font-medium">
                  Ponto de referência (opcional)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1.5">
              <div className="bg-[#EDEEF0] rounded-2xl py-3 text-center">
                <p className="text-[#9CA3AF] font-bold text-[0.95rem]">
                  Normal (R$ 12,00)
                </p>
              </div>
              <div className="bg-black rounded-2xl py-3 text-center flex items-center justify-center gap-2 shadow-md">
                <span className="text-[#FACC15] text-lg">⚠️</span>
                <p className="text-white font-bold text-[0.95rem]">
                  Especial (Negociar)
                </p>
              </div>
            </div>

            <div className="bg-[#FFF7E6] rounded-2xl px-4 py-3 border border-[#FFE5B3]">
              <p className="text-[#B45309] text-sm leading-relaxed text-center font-medium">
                <span className="font-bold">⚠️ Corrida Especial</span> —
                Negociar com o Mototaxista (O mototaxista irá propor um valor
                para você aprovar antes da corrida começar).
              </p>
            </div>

            <div className="pt-0.5">
              <p className="text-[#0F172A] font-bold text-base mb-2.5">
                Forma de Pagamento
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#FFFBEB] border-[2.5px] border-[#FACC15] rounded-2xl py-3 flex items-center justify-center gap-2.5 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  </div>
                  <span className="text-[#0F172A] font-black text-xl">
                    PIX
                  </span>
                </div>
                <div className="bg-white border-[2.5px] border-[#E5E7EB] rounded-2xl py-3 flex items-center justify-center gap-2.5 shadow-sm">
                  <span className="text-xl">💵</span>
                  <span className="text-[#94A3B8] font-black text-xl">
                    DINHEIRO
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#FFD000] text-black font-black py-4 rounded-[1.4rem] shadow-[0_10px_30px_rgba(255,208,0,0.35)] text-xl flex items-center justify-center gap-2 mt-0.5 border-[1.5px] border-[#FFE36A]">
              <span className="text-2xl">🚕</span>
              CHAMAR MOTOTÁXI AGORA
            </button>
          </div>

          <div className="bg-white border-t border-gray-100 flex items-center justify-around py-3.5 px-4 pb-6">
            <div className="flex flex-col items-center gap-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FACC15">
                <path d="M3 12L12 3l9 9v8a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-8z" />
              </svg>
              <span className="text-[10px] font-bold text-[#FACC15]">
                Início
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M12 7v5l3 2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-bold text-[#94A3B8]">
                Histórico
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path
                  d="M4 20c0-4 4-7 8-7s8 3 8 7"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-bold text-[#94A3B8]">
                Perfil
              </span>
            </div>
          </div>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[36%] h-1 bg-black/80 rounded-full z-40"></div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-12`}>
      {kicker && (
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
          <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
            {kicker}
          </span>
        </div>
      )}
      <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />

      {/* HERO — composição FIEL à referência visual oficial */}
      <section className="relative pt-24 lg:pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("/hero-mototaxista.jpg")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 xl:col-span-5 relative z-20 pt-6 lg:pt-10 lg:pl-0 xl:pl-0 lg:pr-12 xl:pr-16">
              <h1 className="text-white font-black leading-[1.08] tracking-tight mb-7">
                <span className="block text-3xl sm:text-[2.5rem] lg:text-[3.3rem] whitespace-nowrap">
                  SEU MOTOTÁXI
                </span>
                <span className="block text-3xl sm:text-[2.5rem] lg:text-[3.3rem] mt-3 whitespace-nowrap">
                  NA PALMA DA
                </span>
                <span className="block text-[#FFC400] text-[2.15rem] sm:text-[2.7rem] lg:text-[4.0rem] mt-3 whitespace-nowrap">
                  SUA MÃO
                </span>
              </h1>

              <p className="text-white/85 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Rápido, seguro e confiável em{" "}
                <strong className="text-white">São Gotardo</strong> e região.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-3 max-w-none">
                <Link
                  href="/cliente/login"
                  className="inline-flex items-center justify-center min-w-[230px] px-6 py-3.5 bg-[#FFC400] text-black font-black rounded-full text-sm sm:text-base whitespace-nowrap hover:bg-[#FFD43B] transition-all shadow-[0_10px_30px_rgba(255,196,0,0.22)] w-full sm:w-auto animate-pulseYellow"
                >
                  SOLICITAR CORRIDA
                </Link>
                <Link
                  href="/como-funciona"
                  className="inline-flex items-center justify-center min-w-[210px] px-6 py-3.5 bg-black/55 border-2 border-[#FFC400]/60 text-white font-black rounded-full text-sm sm:text-base whitespace-nowrap hover:bg-black/75 hover:border-[#FFC400] transition-all backdrop-blur-sm w-full sm:w-auto"
                >
                  COMO FUNCIONA
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 xl:col-span-4 relative h-[460px] lg:h-[560px] z-10">
              <div className="absolute top-[2%] right-[-40px] sm:top-[0%] sm:right-[-46px] lg:top-[6%] lg:right-[-80px] xl:top-[3%] xl:right-[-110px] z-20 w-[68%] sm:w-[65%] lg:w-[92%] xl:w-[88%]">
                <img
                  src="/hero-mockup.png"
                  alt="MotoSango - Tela inicial do cliente"
                  className="w-full h-auto object-contain select-none drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
                  draggable={false}
                />
              </div>
            </div>

            <div className="lg:col-span-3 xl:col-span-3 space-y-6 relative z-20 pb-6 lg:pl-12 xl:pl-16 lg:ml-6 xl:ml-10">
              {[
                {
                  icon: Zap,
                  title: "RÁPIDO",
                  desc: "Atendimento ágil com fila inteligente.",
                },
                {
                  icon: Shield,
                  title: "SEGURO",
                  desc: "Mototaxistas verificados e comprometidos.",
                },
                {
                  icon: MapPin,
                  title: "LOCAL",
                  desc: "Serviço local em São Gotardo e região.",
                },
                {
                  icon: Clock,
                  title: "ATÉ 22H",
                  desc: "Atendimento disponível todos os dias até às 22h.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 mt-0.5">
                    <item.icon
                      className="w-7 h-7 text-[#FFC400]"
                      strokeWidth={2.4}
                    />
                  </div>
                  <div>
                    <h3 className="text-[#FFC400] font-black text-[1rem] uppercase tracking-[0.06em] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/85 text-sm leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA AMARELA */}
      <section className="relative py-5 sm:py-6 bg-[#FFC400] overflow-hidden rounded-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,#000_35px,#000_36px)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="w-full mx-auto max-w-6xl lg:max-w-5xl bg-[#FFC400] py-2 px-4 sm:px-6 lg:px-8 border border-black/15 rounded-full">
            <div className="flex items-center justify-center gap-3 lg:gap-4">
              <div className="h-0.5 w-10 sm:w-20 bg-black/30 rounded-full shrink-0"></div>
              <p className="text-black text-base sm:text-lg lg:text-xl font-black uppercase tracking-[0.08em] text-center leading-snug whitespace-nowrap sm:whitespace-normal">
                São Gotardo tem um novo jeito de ir e vir.
              </p>
              <div className="h-0.5 w-10 sm:w-20 bg-black/30 rounded-full shrink-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="py-20 lg:py-28 bg-[#080B0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <SectionTitle
                kicker="O que é MotoSango"
                title="FEITO PARA FACILITAR SEU DESLOCAMENTO."
                center={false}
              />
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                O MotoSango conecta você a mototaxistas disponíveis próximos ao
                seu local. Com localização e Fila Inteligente, sua solicitação
                é encaminhada de forma organizada para tornar o atendimento mais
                ágil.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: UserCheck,
                    title: "Mototaxistas Verificados",
                    desc: "Todos os mototaxistas são cadastrados no sistema.",
                  },
                  {
                    icon: Wallet,
                    title: "Pix ou Dinheiro",
                    desc: "Pagamento simples da forma que você preferir.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#FFC400]/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-[#FFC400]" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/5]">
                <img
                  src="/01_feito_para_facilitar_seu_deslocamento.png"
                  alt="MotoSango - Solução de mototáxi prática para deslocamento em São Gotardo MG"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 right-12 bg-black rounded-2xl p-5 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFC400]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#FFC400]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-1">
                      Área de atendimento
                    </p>
                    <p className="text-white font-bold">
                      São Gotardo e região
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 BENEFÍCIOS */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Por que escolher MotoSango"
            title="QUATRO MOTIVOS PARA CONFIAR NA GENTE."
            subtitle="Simplicidade, organização e agilidade para você chegar ao seu destino."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                num: "01",
                title: "PROXIMIDADE",
                desc: "O MotoSango identifica mototaxistas disponíveis próximos ao local de embarque.",
              },
              {
                icon: Users,
                num: "02",
                title: "FILA INTELIGENTE",
                desc: "Organiza a ordem das chamadas, começando pelos mototaxistas mais próximos.",
              },
              {
                icon: Zap,
                num: "03",
                title: "AGILIDADE",
                desc: "Se um mototaxista não responder ou não aceitar dentro do tempo, a chamada passa para o próximo.",
              },
              {
                icon: Sparkles,
                num: "04",
                title: "PRATICIDADE",
                desc: "Você solicita a corrida pelo sistema e recebe todas as informações necessárias.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/5 hover:border-[#FFC400]/30 transition-all hover:-translate-y-1"
              >
                <div className="absolute top-5 right-5 text-white/5 group-hover:text-[#FFC400]/10 transition-colors font-black text-4xl">
                  {item.num}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 flex items-center justify-center mb-5 group-hover:bg-[#FFC400]/20 transition-colors">
                  <item.icon className="w-7 h-7 text-[#FFC400]" />
                </div>
                <h3 className="text-white font-black text-lg mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILA INTELIGENTE */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-[#080B0B] to-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Diferencial MotoSango"
            title="MENOS ESPERA. MAIS AGILIDADE."
            subtitle="Conheça a Fila Inteligente do MotoSango e como organizamos cada solicitação."
          />

          <div className="bg-gradient-to-br from-[#FFC400]/5 via-transparent to-[#FFC400]/5 rounded-3xl border border-[#FFC400]/10 p-6 sm:p-10 mb-12">
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
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${
                      step.highlight
                        ? "bg-[#FFC400]/10 border-[#FFC400]/30"
                        : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 max-w-md mx-auto">
              <p className="text-sm font-semibold text-center whitespace-nowrap sm:whitespace-normal">
                <span className="text-[#D4AF37]">NÃO ACEITOU</span>
                <span className="text-white"> → A CHAMADA PASSA PARA O PRÓXIMO MOTOTAXISTA</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "1",
                title: "Você solicita",
                desc: "O passageiro informa o local e solicita a corrida.",
              },
              {
                num: "2",
                title: "Identificamos mototaxistas",
                desc: "O MotoSango encontra os disponíveis próximos.",
              },
              {
                num: "3",
                title: "Fila organiza",
                desc: "A Fila Inteligente ordena pelos mais próximos.",
              },
              {
                num: "4",
                title: "Primeiro recebe",
                desc: "O primeiro mototaxista recebe a solicitação.",
              },
              {
                num: "5",
                title: "Tempo para responder",
                desc: "Ele tem o tempo definido para abrir a oferta.",
              },
              {
                num: "6",
                title: "Próximo se não responder",
                desc: "Sem resposta? A chamada passa adiante.",
              },
              {
                num: "7",
                title: "Tempo para aceitar",
                desc: "Ao abrir, tem tempo para decidir por aceitar.",
              },
              {
                num: "8",
                title: "Próximo se não aceitar",
                desc: "Se não aceitar, passa para o próximo.",
              },
              {
                num: "9",
                title: "Corrida confirmada",
                desc: "Ao aceitar, a corrida é confirmada.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] font-black text-sm">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/fila-inteligente"
              className="inline-flex items-center gap-2 text-[#FFC400] font-bold hover:underline underline-offset-4"
            >
              Entenda melhor a Fila Inteligente
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA PASSAGEIRO */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Passageiro"
            title="COMO FUNCIONA PARA VOCÊ."
            subtitle="Solicitar uma corrida com MotoSango é simples. Veja cada passo:"
          />
          <div className="relative">
            <div className="hidden lg:block absolute top-[70px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
              {[
                {
                  n: "01",
                  icon: UserPlus,
                  title: "SOLICITE",
                  desc: "Informe o local de embarque e o destino.",
                },
                {
                  n: "02",
                  icon: MapPin,
                  title: "PROCURAMOS",
                  desc: "O sistema identifica mototaxistas disponíveis próximos.",
                },
                {
                  n: "03",
                  icon: Sparkles,
                  title: "FILA ORGANIZA",
                  desc: "As chamadas começam pelos mais próximos.",
                },
                {
                  n: "04",
                  icon: BellRing,
                  title: "ELE RECEBE",
                  desc: "A solicitação chega ao celular do mototaxista.",
                },
                {
                  n: "05",
                  icon: CheckCircle2,
                  title: "CONFIRMADA",
                  desc: "Quando um mototaxista aceita, a corrida é confirmada.",
                },
                {
                  n: "06",
                  icon: Route,
                  title: "VAI ATÉ VOCÊ",
                  desc: "O mototaxista se dirige ao local de embarque.",
                },
                {
                  n: "07",
                  icon: Flag,
                  title: "CHEGA AO DESTINO",
                  desc: "A corrida é realizada normalmente.",
                },
              ].map((s) => (
                <div key={s.n} className="relative">
                  <div className="relative z-10 flex flex-col items-center text-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 h-full">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC400] text-black text-[10px] font-black px-2.5 py-1 rounded-full">
                      {s.n}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 flex items-center justify-center mb-4 mt-2">
                      <s.icon className="w-7 h-7 text-[#FFC400]" />
                    </div>
                    <h3 className="text-white font-black text-sm mb-2 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-white/55 text-xs leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAGAMENTO */}
      <section className="py-20 lg:py-28 bg-[#080B0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Formas de Pagamento"
            title="PIX OU DINHEIRO. VOCÊ ESCOLHE."
            subtitle="Pagamento simples, seguro e transparente."
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-green-500/[0.08] to-transparent border border-green-500/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">PIX</h3>
                  <p className="text-white/50 text-sm">Pagamento instantâneo</p>
                </div>
              </div>
              <p className="text-white/70 text-base leading-relaxed mb-5">
                Se você escolher pagar por Pix, primeiro precisa fazer o
                pagamento. A solicitação fica aguardando a confirmação. Depois
                que o Pix for confirmado, a solicitação é liberada para os
                mototaxistas.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-yellow-300/90 text-sm leading-relaxed">
                  ⚠️ Se o Pix ainda não estiver confirmado, a solicitação não é
                  liberada.
                </p>
              </div>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFC400]/[0.08] to-transparent border border-[#FFC400]/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/15 flex items-center justify-center">
                  <Banknote className="w-7 h-7 text-[#FFC400]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">DINHEIRO</h3>
                  <p className="text-white/50 text-sm">Pagamento direto ao mototaxista</p>
                </div>
              </div>
              <p className="text-white/70 text-base leading-relaxed mb-5">
                Se você escolher pagar em dinheiro, não precisa pagar antes. A
                solicitação segue normalmente e o pagamento é feito ao
                mototaxista conforme o valor da corrida.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <p className="text-[#FFC400]/90 text-sm leading-relaxed">
                  💵 Sem pagamento antecipado. Apenas pague ao final da corrida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA ESPECIAL */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                kicker="Outra opção para você"
                title="CHAMADA ESPECIAL."
                subtitle="Precisa ir para um local específico? Negocie o valor diretamente com o mototaxista."
                center={false}
              />
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Na Chamada Especial, você informa de onde vai sair e para onde
                deseja ir. A solicitação é enviada ao mototaxista, que informa o
                valor da corrida. Você recebe a proposta e decide se aceita.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Você informa origem e destino",
                  "Envia a solicitação",
                  "Mototaxista informa o valor",
                  "Você decide se aceita",
                  "Se aceitar, a corrida é confirmada",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#FFC400]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#FFC400] font-bold text-xs">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{item}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/15">
                  <p className="text-green-300/90 text-xs font-bold uppercase tracking-wider mb-1">
                    Pix
                  </p>
                  <p className="text-white/70 text-sm">
                    Pagamento precisa ser confirmado antes da liberação.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFC400]/5 border border-[#FFC400]/15">
                  <p className="text-[#FFC400] text-xs font-bold uppercase tracking-wider mb-1">
                    Dinheiro
                  </p>
                  <p className="text-white/70 text-sm">
                    Não existe pagamento antecipado.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-square">
                <img
                  src="/02_chamada_especial.png"
                  alt="MotoSango - Chamada Especial para corridas com valor negociado em São Gotardo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 max-w-[230px] bg-[#FFC400] rounded-2xl p-5 shadow-2xl shadow-[#FFC400]/20">
                <p className="text-black font-black text-base leading-tight mb-1">
                  Não aceitou o valor?
                </p>
                <p className="text-black/70 text-sm">
                  Você pode fazer uma nova consulta quando quiser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGURANÇA */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-black to-[#080B0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="Sua tranquilidade"
            title="SEGURANÇA EM PRIMEIRO LUGAR."
            subtitle="Trabalhamos para oferecer um ambiente seguro para passageiros e mototaxistas."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: UserCheck,
                title: "Cadastro de Mototaxistas",
                desc: "Todos os mototaxistas passam por cadastro no sistema.",
              },
              {
                icon: MapPin,
                title: "Uso da Localização",
                desc: "A localização ajuda a conectar passageiros e mototaxistas próximos.",
              },
              {
                icon: Eye,
                title: "Informações da Solicitação",
                desc: "Dados da corrida são organizados para clareza de ambos os lados.",
              },
              {
                icon: Shield,
                title: "Atendimento Organizado",
                desc: "A Fila Inteligente organiza o atendimento de forma estruturada.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#FFC400]" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 max-w-3xl mx-auto">
            <p className="text-amber-200/80 text-sm text-center leading-relaxed">
              Orientamos passageiros e mototaxistas a sempre conferirem os
              dados da corrida, as informações do veículo e manterem a
              comunicação clara durante o atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* SÃO GOTARDO */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <SectionTitle
                kicker="Atendimento local"
                title="MOTOSANGO EM SÃO GOTARDO."
                subtitle="Mobilidade feita para a realidade de São Gotardo e região."
                center={false}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    icon: Building2,
                    title: "Serviço local",
                    desc: "Pensado para a nossa cidade e região.",
                  },
                  {
                    icon: Users,
                    title: "Pessoas da região",
                    desc: "Mototaxistas que conhecem cada rua.",
                  },
                  {
                    icon: Sparkles,
                    title: "Fila Inteligente",
                    desc: "Sistema que organiza o atendimento.",
                  },
                  {
                    icon: MapPin,
                    title: "Proximidade",
                    desc: "Sempre o mototaxista mais próximo primeiro.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFC400]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#FFC400]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-white/55 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
                <img
                  src="/03_motosango_em_sao_gotardo.png"
                  alt="MotoSango - Área de atendimento em São Gotardo e Guarda dos Ferreiros MG"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARA MOTOTAXISTAS */}
      <section className="py-20 lg:py-28 bg-[#080B0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/5]">
                <img
                  src="/04_voce_e_um_mototaxista.png"
                  alt="MotoSango - Seja mototaxista parceiro e receba corridas em São Gotardo MG"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionTitle
                kicker="Para profissionais"
                title="VOCÊ É MOTOTAXISTA?"
                subtitle="Faça parte do MotoSango e receba solicitações de passageiros pelo seu celular."
                center={false}
              />

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 mb-6">
                <h3 className="text-[#FFC400] font-black text-lg mb-3 tracking-tight">
                  COMO O MOTOSANGO ENCONTRA VOCÊ
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  Quando um passageiro solicita uma corrida, o MotoSango
                  identifica mototaxistas disponíveis que estão mais próximos do
                  local de embarque. A Fila Inteligente organiza a ordem das
                  chamadas, começando pelos mototaxistas mais próximos.
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Você poderá estar em diferentes locais da cidade. Quando
                  estiver disponível, o MotoSango poderá encontrar você de
                  acordo com sua localização e a proximidade do passageiro.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/mototaxista/cadastro"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FFC400] text-black font-black rounded-full text-base hover:bg-[#FFD43B] transition-all shadow-xl shadow-[#FFC400]/25 animate-pulseYellow"
                >
                  QUERO SER MOTOTAXISTA
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/mototaxistas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10 transition-all"
                >
                  Saiba mais
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CENTRAL DE AJUDA CTA */}
      <section className="py-20 lg:py-28 bg-[#080B0B] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            kicker="Central de Ajuda"
            title="AINDA TEM DÚVIDAS?"
            subtitle="Temos uma central completa com perguntas frequentes para passageiros e mototaxistas."
          />
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            {[
              {
                q: "Como funciona a Fila Inteligente?",
                a: "Ela organiza as chamadas pelos mototaxistas mais próximos.",
              },
              {
                q: "Preciso pagar antes no Pix?",
                a: "Sim. A solicitação só libera após a confirmação do pagamento.",
              },
              {
                q: "Como me torno mototaxista?",
                a: "Basta fazer seu cadastro e ficar disponível.",
              },
              {
                q: "Como adicionar no celular?",
                a: "Pelo navegador, adicione à tela inicial do aparelho.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-left"
              >
                <div className="flex items-start gap-3 mb-2">
                  <CircleHelp className="w-5 h-5 text-[#FFC400] shrink-0 mt-0.5" />
                  <p className="text-white font-bold text-sm">{faq.q}</p>
                </div>
                <p className="text-white/55 text-sm pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/ajuda"
            className="inline-flex items-center gap-2 px-7 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
          >
            <CircleHelp className="w-4 h-4" />
            ACESSAR CENTRAL DE AJUDA
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] p-10 sm:p-14 lg:p-16 bg-gradient-to-br from-[#FFC400] via-[#FFD43B] to-[#FFC400] text-center shadow-2xl shadow-[#FFC400]/20">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <h2 className="text-black text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
                PRONTO PARA SOLICITAR SUA CORRIDA?
              </h2>
              <p className="text-black/70 text-lg mb-8 max-w-xl mx-auto">
                É rápido, seguro e confiável. Em poucos minutos você estará com
                um mototaxista a caminho.
              </p>
              <Link
                href="/cliente/login"
                className="inline-flex items-center gap-2 px-10 py-5 bg-black text-[#FFC400] font-black rounded-full text-lg hover:bg-[#1a1a1a] transition-all shadow-xl shadow-black/20 hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" strokeWidth={2.5} />
                SOLICITAR CORRIDA
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
