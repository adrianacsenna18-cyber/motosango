"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, X } from "lucide-react";
import InstalarPwaModal from "@/components/site/InstalarPwaModal";

const DISMISS_KEY = "motosango_pwa_prompt_dismissed";
const INITIAL_DELAY_MS = 6000;
const RETRY_DELAY_MS = 4000;

export default function ClientePwaInstallToast({
  pathname,
}: {
  pathname: string;
}) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const deferredPromptRef = useRef<any>(null);
  const tentouRetryRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exibidoRef = useRef(false);

  useEffect(() => {
    setShow(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;

    let standalone = false;
    try {
      const mediaStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const navStandalone =
        (window.navigator as any).standalone === true;
      const emApp = window.location.pathname.startsWith("/app");
      standalone = mediaStandalone || navStandalone || emApp;
    } catch {
      standalone = false;
    }
    if (standalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };
    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    const isUsuarioDigitando = () => {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA";
    };

    const tentarExibir = () => {
      if (exibidoRef.current) return;
      try {
        const d = localStorage.getItem(DISMISS_KEY) === "1";
        if (d) return;
      } catch {
        /* noop */
      }
      if (isUsuarioDigitando() && !tentouRetryRef.current) {
        tentouRetryRef.current = true;
        timerRef.current = setTimeout(tentarExibir, RETRY_DELAY_MS);
        return;
      }
      exibidoRef.current = true;
      setShow(true);
    };

    timerRef.current = setTimeout(tentarExibir, INITIAL_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
    setShow(false);
  };

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (prompt && typeof prompt.prompt === "function") {
      try {
        await prompt.prompt();
      } catch {
        /* noop */
      }
      deferredPromptRef.current = null;
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* noop */
      }
      setShow(false);
      return;
    }

    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isIphone = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;
    if (isIphone) {
      router.push("/adicionar-no-celular");
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* noop */
      }
      setShow(false);
      return;
    }

    setModalAberto(true);
  };

  if (!show) return null;

  return (
    <>
      <div
        role="dialog"
        aria-labelledby="pwa-install-title"
        className="fixed left-1/2 -translate-x-1/2 z-40 top-[18dvh] w-[86vw] max-w-[300px] animate-fade-in"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="relative w-full bg-[#080B0B] border border-[#FFC400]/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] px-4 py-3.5 sm:py-4 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFC400]/10 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            aria-label="Fechar"
            onClick={handleDismiss}
            className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-white/45 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-2.5 pr-7">
            <div className="shrink-0 w-9 h-9 rounded-2xl bg-[#FFC400]/15 border border-[#FFC400]/25 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#FFC400]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <h3
                id="pwa-install-title"
                className="text-white font-black text-[15px] sm:text-base tracking-tight mb-1"
              >
                Instale o MotoSango no seu celular
              </h3>
              <p className="text-white/65 text-xs sm:text-[13px] leading-relaxed mb-3">
                Acesse mais rápido nas próximas corridas.
              </p>

              <div className="flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleInstall}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3.5 bg-[#FFC400] text-black font-black rounded-full text-xs sm:text-sm shadow-[0_10px_24px_rgba(255,196,0,0.18)] hover:bg-[#FFD43B] transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  Instalar agora
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white/85 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InstalarPwaModal
        aberto={modalAberto}
        onClose={() => {
          setModalAberto(false);
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* noop */
          }
          setShow(false);
        }}
      />
    </>
  );
}
