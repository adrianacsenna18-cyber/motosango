import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function InternalPageShell({
  children,
  title,
  kicker,
  subtitle,
  breadcrumb,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  kicker?: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SiteHeader />
      <div className="flex-1">
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {breadcrumb && breadcrumb.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-white/50 mb-6 flex-wrap">
                <Link href="/" className="hover:text-[#FFC400] transition-colors">
                  Início
                </Link>
                {breadcrumb.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-white/30" />
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-[#FFC400] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white/80">{item.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {kicker && (
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20">
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  {kicker}
                </span>
              </div>
            )}
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight max-w-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/60 text-lg lg:text-xl leading-relaxed mt-5 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
        </section>

        <div className="py-16 lg:py-20">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div
      className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-12`}
    >
      {kicker && (
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20">
          <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
            {kicker}
          </span>
        </div>
      )}
      <h2 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-4">
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

export function CTAButton({
  href,
  children,
  variant = "primary",
  icon,
  classNameExtra,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  classNameExtra?: string;
}) {
  const base =
    "inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold transition-all";
  const primary =
    "bg-[#FFC400] text-black hover:bg-[#FFD43B] shadow-xl shadow-[#FFC400]/25 hover:-translate-y-0.5";
  const secondary =
    "bg-white/5 border border-white/10 text-white hover:bg-white/10";

  return (
    <Link
      href={href}
      className={`${base} ${variant === "primary" ? primary : secondary} ${classNameExtra ?? ""}`}
    >
      {icon}
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
