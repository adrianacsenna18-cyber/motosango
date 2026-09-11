"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/adicionar-no-celular", label: "Como instalar" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/fila-inteligente", label: "Fila Inteligente" },
  { href: "/mototaxistas", label: "Mototaxistas" },
  { href: "/seguranca", label: "Segurança" },
  { href: "/ajuda", label: "Ajuda" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-sm shadow-lg border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 lg:gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="MotoSango"
              className="w-9 h-9 lg:w-11 lg:h-11 object-contain shrink-0"
            />
            <div className="flex flex-col items-start">
              <span className="text-white font-black text-xl lg:text-2xl tracking-tight leading-tight">
                Moto<span className="text-[#FFC400]">Sango</span>
              </span>
              <span className="text-[#FFC400] text-[11px] lg:text-xs font-black uppercase tracking-[0.14em] leading-none mt-1">
                SEU MOTOTÁXI NA PALMA DA SUA MÃO
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 lg:gap-7 xl:gap-8 shrink-0 ml-auto mr-8 xl:mr-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-[#FFC400] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0 ml-auto lg:ml-0">
            <Link
              href="/cliente/login"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-[#FFC400] text-black font-bold rounded-full text-sm hover:bg-[#FFD43B] transition-colors shadow-lg shadow-[#FFC400]/20 whitespace-nowrap"
            >
              <Phone size={16} strokeWidth={2.5} />
              SOLICITAR CORRIDA
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Abrir menu"
            >
              {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black/98 backdrop-blur-md z-40">
          <nav className="flex flex-col px-6 py-8 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 px-4 text-white/90 hover:text-[#FFC400] hover:bg-white/5 text-lg font-semibold rounded-xl transition-all border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 mt-4">
              <Link
                href="/cliente/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#FFC400] text-black font-bold rounded-full text-lg shadow-lg shadow-[#FFC400]/20"
              >
                <Phone size={18} strokeWidth={2.5} />
                SOLICITAR CORRIDA
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
