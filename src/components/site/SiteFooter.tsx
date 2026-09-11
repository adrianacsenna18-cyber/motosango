import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#080B0B] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#FFC400] flex items-center justify-center">
                <img src="/logo.png" alt="MotoSango" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-white font-black text-2xl tracking-tight">
                Moto<span className="text-[#FFC400]">Sango</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Mototáxi rápido, seguro e confiável em São Gotardo e região.
            </p>
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 cursor-not-allowed"
                title="Facebook (em breve)"
              >
                <Facebook size={18} />
              </div>
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 cursor-not-allowed"
                title="Instagram (em breve)"
              >
                <Instagram size={18} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              MotoSango
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Início" },
                { href: "/como-funciona", label: "Como Funciona" },
                { href: "/fila-inteligente", label: "Fila Inteligente" },
                { href: "/seguranca", label: "Segurança" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Mototaxistas
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mototaxistas"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Para Mototaxistas
                </Link>
              </li>
              <li>
                <Link
                  href="/mototaxista/login"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/mototaxista/cadastro"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Cadastro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Ajuda
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ajuda"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/adicionar-no-celular"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Adicionar no Celular
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/termos"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#FFC400] mt-0.5 shrink-0" />
            <div>
              <p className="text-white/90 font-semibold text-sm">E-mail</p>
              <a
                href="mailto:motosangooficial@gmail.com"
                className="text-white/60 hover:text-[#FFC400] text-sm transition-colors"
              >
                motosangooficial@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#FFC400] mt-0.5 shrink-0" />
            <div>
              <p className="text-white/90 font-semibold text-sm">Área de atendimento</p>
              <p className="text-white/60 text-sm">São Gotardo e região</p>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} MotoSango — Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
