import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Como Instalar | MotoSango - App de Mototáxi em São Gotardo",
  description:
    "Aprenda a instalar o aplicativo MotoSango na tela inicial do seu celular Android ou iPhone (Safari). Aplicativo de mototáxi para pedir corrida em São Gotardo MG direto do navegador sem baixar nada.",
  alternates: { canonical: "/adicionar-no-celular" },
};
import {
  Globe,
  Share2,
  Plus,
  CheckCircle2,
  Menu,
  ChevronRight,
} from "lucide-react";

const androidSteps = [
  {
    number: 1,
    title: "Abra o MotoSango pelo navegador",
    description:
      "Abra o site oficial do MotoSango utilizando o navegador do seu celular — pode ser Chrome, Edge ou qualquer outro de sua preferência.",
    icon: Globe,
  },
  {
    number: 2,
    title: "Toque no menu do navegador",
    description:
      "Toque no menu do navegador, representado pelos três pontinhos, geralmente no canto superior direito da tela.",
    icon: Menu,
  },
  {
    number: 3,
    title: "Procure a opção de adicionar",
    description:
      "Procure a opção “Adicionar à tela inicial” ou “Instalar aplicativo”, conforme o navegador que você estiver utilizando.",
    icon: Plus,
  },
  {
    number: 4,
    title: "Confirme a instalação",
    description:
      "Confirme a opção selecionada para adicionar o MotoSango como atalho ou aplicativo na tela do seu aparelho.",
    icon: ChevronRight,
  },
  {
    number: 5,
    title: "Pronto na tela inicial",
    description:
      "O MotoSango ficará disponível na tela inicial do aparelho, com ícone próprio, igual aos outros aplicativos que você já utiliza.",
    icon: CheckCircle2,
  },
];

const iosSteps = [
  {
    number: 1,
    title: "Abra o MotoSango pelo Safari",
    description:
      "Abra o site oficial do MotoSango utilizando o navegador Safari no seu iPhone. É importante usar o Safari para este procedimento.",
    icon: Globe,
  },
  {
    number: 2,
    title: "Toque no botão Compartilhar",
    description:
      "Toque no botão Compartilhar — um quadrado com uma seta para cima, geralmente na parte inferior da tela do Safari.",
    icon: Share2,
  },
  {
    number: 3,
    title: "Adicionar à Tela de Início",
    description:
      "Deslize a lista de opções do compartilhamento e toque em “Adicionar à Tela de Início”.",
    icon: Plus,
  },
  {
    number: 4,
    title: "Confirme em Adicionar",
    description:
      "Confirme a operação tocando em “Adicionar” no canto superior direito da tela.",
    icon: ChevronRight,
  },
  {
    number: 5,
    title: "Pronto na tela inicial",
    description:
      "O MotoSango ficará disponível na tela inicial do seu iPhone, com ícone próprio e acesso direto sempre que precisar.",
    icon: CheckCircle2,
  },
];

export default function AdicionarNoCelularPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Ajuda" }, { label: "Como instalar" }]}
      kicker="Tela inicial"
      title={
        <>
          Coloque o <span className="text-white">Moto</span>
          <span className="text-[#FFC400]">Sango</span> na tela do seu celular
        </>
      }
      subtitle="Tenha o MotoSango sempre à mão."
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFC400]/15 via-[#FFC400]/8 to-[#FFC400]/15 border border-[#FFC400]/25 p-6 sm:p-8 lg:p-10">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFC400]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="relative flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFC400] flex items-center justify-center shrink-0 shadow-lg shadow-[#FFC400]/25">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#FFC400] text-base sm:text-lg lg:text-xl font-black mb-1.5 tracking-tight">
                  Instalação rápida e segura
                </h3>
                <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                  Funciona direto do navegador. Não precisa baixar em loja de
                  aplicativos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Android"
            title="COMO INSTALAR NO ANDROID"
            subtitle="Siga os 5 passos abaixo e tenha o MotoSango sempre à mão na tela inicial do seu celular Android."
          />
          <ol className="space-y-4 lg:space-y-5">
            {androidSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={index}
                  className="bg-[#080B0B] border border-white/5 rounded-2xl p-5 sm:p-6 lg:p-7 transition-all hover:border-[#FFC400]/30"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center shrink-0">
                      <Icon
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC400]"
                        strokeWidth={2.3}
                      />
                    </div>
                    <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFC400] shrink-0">
                      <span className="text-black font-black text-lg sm:text-xl">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-white text-lg sm:text-xl font-black mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <SectionTitle
            kicker="iPhone"
            title="COMO INSTALAR NO IPHONE"
            subtitle="Se você usa iPhone, siga esses 5 passos utilizando o navegador Safari para adicionar o MotoSango à tela inicial."
          />
          <ol className="space-y-4 lg:space-y-5">
            {iosSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={index}
                  className="bg-[#080B0B] border border-white/5 rounded-2xl p-5 sm:p-6 lg:p-7 transition-all hover:border-[#FFC400]/30"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center shrink-0">
                      <Icon
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC400]"
                        strokeWidth={2.3}
                      />
                    </div>
                    <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFC400] shrink-0">
                      <span className="text-black font-black text-lg sm:text-xl">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-white text-lg sm:text-xl font-black mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080B0B] to-black border border-white/5 p-8 sm:p-12 lg:p-14">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC400]/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
                Acesse o <span className="text-white">Moto</span>
                <span className="text-[#FFC400]">Sango</span> e adicione à tela inicial.
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Abra o site oficial e siga o passo a passo acima para manter o
                MotoSango sempre à disposição no seu celular.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton
                  href="/"
                  icon={<Globe className="w-4 h-4" />}
                  classNameExtra="animate-pulseYellow"
                >
                  Acessar o MotoSango
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
