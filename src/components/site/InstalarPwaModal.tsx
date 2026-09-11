"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Menu,
  Plus,
  CheckCircle2,
  Share2,
  X,
} from "lucide-react";

type Step = {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const androidSteps: Step[] = [
  {
    number: 1,
    title: "Abra o navegador",
    description:
      "Abra o navegador do seu celular — pode ser Chrome, Edge ou qualquer outro que você preferir.",
    icon: Globe,
  },
  {
    number: 2,
    title: "Acesse o MotoSango",
    description:
      "Digite o endereço oficial do MotoSango na barra de endereços e acesse o site.",
    icon: Globe,
  },
  {
    number: 3,
    title: "Abra o menu",
    description:
      "Toque no menu (três pontinhos no canto superior direito) ou procure a opção 'Adicionar à tela inicial'.",
    icon: Menu,
  },
  {
    number: 4,
    title: "Adicione à tela inicial",
    description:
      "Selecione 'Adicionar à tela inicial' ou 'Instalar aplicativo' nas opções que aparecerem.",
    icon: Plus,
  },
  {
    number: 5,
    title: "Pronto!",
    description:
      "O ícone do MotoSango aparecerá na tela do seu celular. Agora é só tocar para abrir.",
    icon: CheckCircle2,
  },
];

const iosSteps: Step[] = [
  {
    number: 1,
    title: "Abra o Safari",
    description:
      "Abra o navegador Safari no seu iPhone. É importante usar o Safari para esse procedimento.",
    icon: Globe,
  },
  {
    number: 2,
    title: "Acesse o MotoSango",
    description:
      "Digite o endereço oficial do MotoSango na barra de endereços e acesse o site.",
    icon: Globe,
  },
  {
    number: 3,
    title: "Toque em compartilhar",
    description:
      "Toque no ícone de compartilhar — um quadrado com uma seta para cima, na parte inferior da tela.",
    icon: Share2,
  },
  {
    number: 4,
    title: "Adicione à Tela de Início",
    description:
      "Role a lista de opções e toque em 'Adicionar à Tela de Início'.",
    icon: Plus,
  },
  {
    number: 5,
    title: "Confirme e pronto!",
    description:
      "Toque em 'Adicionar' no canto superior direito. O ícone do MotoSango aparecerá na sua tela.",
    icon: CheckCircle2,
  },
];

type Props = {
  aberto: boolean;
  onClose: () => void;
};

export default function InstalarPwaModal({ aberto, onClose }: Props) {
  const [tab, setTab] = useState<"android" | "ios">("android");

  useEffect(() => {
    if (!aberto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!aberto) return null;

  const steps = tab === "android" ? androidSteps : iosSteps;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl bg-[#080B0B] border border-white/10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.65)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FFC400]/8 via-transparent pointer-events-none" />

        <div className="relative px-6 sm:px-10 pt-7 pb-4 border-b border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src="/logo.png"
                  alt="MotoSango"
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="leading-tight">
                  <p className="font-black text-xl sm:text-2xl tracking-tight">
                    <span className="text-white">Moto</span>
                    <span className="text-[#FFC400]">Sango</span>
                  </p>
                  <p className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-black leading-none mt-0.5">
                    SEU MOTOTÁXI NA PALMA DA SUA MÃO
                  </p>
                </div>
              </div>
              <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight">
                Adicione à tela inicial
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                Siga o passo a passo abaixo correspondente ao seu celular.
              </p>
            </div>

            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-2 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 p-1.5 bg-white/5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setTab("android")}
              className={`px-4 sm:px-6 py-2 text-sm font-black rounded-full transition-colors whitespace-nowrap ${
                tab === "android"
                  ? "bg-[#FFC400] text-black shadow shadow-[#FFC400]/25"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Android
            </button>
            <button
              type="button"
              onClick={() => setTab("ios")}
              className={`px-4 sm:px-6 py-2 text-sm font-black rounded-full transition-colors whitespace-nowrap ${
                tab === "ios"
                  ? "bg-[#FFC400] text-black shadow shadow-[#FFC400]/25"
                  : "text-white/70 hover:text-white"
              }`}
            >
              iPhone
            </button>
          </div>
        </div>

        <div className="relative px-6 sm:px-10 py-7 sm:py-8 space-y-4 max-h-[55vh] overflow-y-auto">
          <ol className="space-y-3">
            {steps.map((s) => (
              <li
                key={s.title}
                className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5"
              >
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFC400]/15 border border-[#FFC400]/25 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[#FFC400]" strokeWidth={2.3} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#FFC400] text-xs font-black tracking-wider">
                      PASSO {s.number}
                    </span>
                  </div>
                  <h3 className="text-white font-black text-base sm:text-lg leading-snug mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative px-6 sm:px-10 pt-3 pb-6 sm:pb-8 border-t border-white/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FFC400] text-black font-black rounded-full text-sm sm:text-base hover:bg-[#FFD43B] transition-all shadow-[0_10px_28px_rgba(255,196,0,0.18)]"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
