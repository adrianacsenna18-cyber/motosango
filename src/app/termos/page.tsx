import type { Metadata } from "next";
import {
  InternalPageShell,
  SectionTitle,
} from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Termos de Uso | MotoSango - Mototáxi São Gotardo MG",
  description:
    "Termos de uso do aplicativo MotoSango. Regras e condições para passageiros e mototaxistas que utilizam o serviço de mototáxi em São Gotardo MG e Guarda dos Ferreiros.",
  alternates: { canonical: "/termos" },
};
import {
  CheckCircle,
  Info,
  User,
  Bike,
  CreditCard,
  MapPin,
  Users,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Mail,
} from "lucide-react";

const termsSections = [
  {
    number: "01",
    icon: CheckCircle,
    title: "Aceitação dos Termos",
    content: [
      "Ao acessar e utilizar a plataforma MotoSango, você declara ter lido, compreendido e concordado integralmente com todos os termos e condições estabelecidos neste documento.",
      "O uso continuado do aplicativo ou website implica aceitação automática destes Termos de Uso.",
    ],
  },
  {
    number: "02",
    icon: Info,
    title: "Sobre o Serviço",
    content: [
      "O MotoSango é uma plataforma digital que conecta passageiros e mototaxistas na cidade de São Gotardo e região.",
      "Importante: o MotoSango não é um serviço de transporte público, nem uma empresa de transporte tradicional. Atuamos exclusivamente como meio de conexão (intermediação) entre pessoas que necessitam de transporte em moto e profissionais mototaxistas autônomos cadastrados.",
    ],
  },
  {
    number: "03",
    icon: User,
    title: "Para Passageiros",
    content: [
      "Cadastro e veracidade dos dados: é obrigatório fornecer informações verdadeiras, completas e atualizadas no momento do cadastro. Cada passageiro é responsável pela precisão dos dados informados.",
      "Uso da localização: para encontrar mototaxistas próximos e oferecer o serviço, o app utiliza sua localização geográfica em tempo real. Ao usar a plataforma, você autoriza expressamente esse uso.",
      "Pagamento via Pix: para corridas pagas por Pix, a confirmação do pagamento é obrigatória para liberação da solicitação. Sem a confirmação do pagamento, a corrida não é liberada para os mototaxistas.",
      "Pagamento em Dinheiro: para corridas pagas em dinheiro, o valor é entregue diretamente ao mototaxista ao final do trajeto.",
      "Comportamento adequado: espera-se dos passageiros tratamento respeitoso e cordial com os mototaxistas, além do cumprimento das instruções de segurança.",
      "Chamada Especial e negociação de valores: na modalidade de Chamada Especial, os valores podem ser propostos pelo mototaxista, e a corrida segue conforme acordado entre as partes.",
    ],
  },
  {
    number: "04",
    icon: Bike,
    title: "Para Mototaxistas",
    content: [
      "Cadastro, documentação e veracidade: é obrigatório fornecer documentos válidos, completos e verdadeiros durante o cadastro, bem como manter toda a documentação regularizada e atualizada.",
      "Disponibilidade e aptidão: ao ficar disponível na plataforma, o mototaxista declara estar apto física e legalmente para realizar corridas, com moto em condições adequadas de uso e documentação em dia.",
      "Uso de localização: o app utiliza a localização do mototaxista em tempo real para conectá-lo aos passageiros próximos e organizar a fila de atendimento.",
      "Aceitar ou recusar dentro dos prazos: cada mototaxista deve responder às solicitações de corrida dentro dos prazos estabelecidos, seja aceitando ou recusando. O não cumprimento desses prazos pode afetar sua posição na fila de atendimento.",
      "Pagamentos e valores: os valores das corridas, comissões e demais condições financeiras seguem as regras estabelecidas pela plataforma e informadas no momento da solicitação ou aceite da corrida.",
    ],
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Pagamentos",
    content: [
      "Pix: o pagamento via Pix é realizado na solicitação da corrida. A confirmação do pagamento pela instituição financeira libera a solicitação para os mototaxistas. Sem confirmação, a corrida não é liberada.",
      "Dinheiro: o pagamento em dinheiro é feito diretamente ao mototaxista ao final do trajeto, combinado previamente no momento da solicitação.",
      "Chamada Especial: nesta modalidade, os valores são propostos pelo mototaxista, e a aceitação do passageiro formaliza o acordo para o valor da corrida.",
    ],
  },
  {
    number: "06",
    icon: MapPin,
    title: "Uso de Dados e Localização",
    content: [
      "A localização geográfica de passageiros e mototaxistas é utilizada exclusivamente para o funcionamento do serviço: conectar pessoas próximas, organizar a fila de atendimento e permitir o acompanhamento do trajeto.",
      "Demais dados pessoais são tratados de acordo com a Política de Privacidade do MotoSango, disponível na plataforma. Ao utilizar o serviço, você concorda com o tratamento dos seus dados conforme descrito.",
    ],
  },
  {
    number: "07",
    icon: Users,
    title: "Fila Inteligente",
    content: [
      "O MotoSango opera com um sistema de Fila Inteligente, que organiza a ordem de atendimento dos mototaxistas cadastrados de forma transparente e automática.",
      "Quando uma corrida é solicitada, ela é direcionada ao mototaxista que estiver na posição correspondente da fila. Se esse profissional não responder dentro do prazo ou recusar a corrida, a solicitação passa automaticamente para o próximo mototaxista da fila, e assim sucessivamente.",
    ],
  },
  {
    number: "08",
    icon: ShieldAlert,
    title: "Responsabilidades e Isenções",
    content: [
      "O MotoSango é apenas uma plataforma de conexão. Não nos responsabilizamos por atos, omissões, danos, acidentes, perdas ou prejuízos causados por passageiros, mototaxistas ou terceiros em decorrência das corridas realizadas por meio da plataforma.",
      "Não garantimos a disponibilidade contínua ou ininterrupta do serviço. A plataforma pode passar por manutenções, atualizações ou indisponibilidades temporárias sem aviso prévio.",
      "Cada usuário (passageiro ou mototaxista) é exclusivamente responsável por suas próprias ações, omissões e conduta durante a utilização do serviço e as corridas.",
    ],
  },
  {
    number: "09",
    icon: ShieldCheck,
    title: "Segurança",
    content: [
      "Disponibilizamos orientações gerais de segurança para ambos os lados e oferecemos recursos para identificação e registro das corridas.",
      "No entanto, não prometemos nem garantimos que o serviço seja 100% seguro ou livre de riscos. A segurança depende da atuação responsável, cuidadosa e respeitosa de cada usuário.",
      "Em caso de emergência, risco iminente ou situação irregular, contate imediatamente as autoridades competentes.",
    ],
  },
  {
    number: "10",
    icon: RefreshCw,
    title: "Modificações dos Termos",
    content: [
      "Estes Termos de Uso podem ser atualizados ou modificados pelo MotoSango a qualquer momento, conforme necessidade ou obrigações legais.",
      "Recomendamos que você revise esta página periodicamente para se manter informado sobre eventuais alterações. O uso da plataforma após as modificações implica aceitação dos novos termos.",
    ],
  },
  {
    number: "11",
    icon: Mail,
    title: "Contato",
    content: [
      "Dúvidas, sugestões, reclamações ou questionamentos relacionados a estes Termos de Uso ou à plataforma podem ser enviados para o nosso canal oficial de atendimento.",
      "Entre em contato pelo e-mail: motosangooficial@gmail.com",
    ],
  },
];

export default function TermosPage() {
  return (
    <InternalPageShell
      breadcrumb={[{ label: "Legal" }, { label: "Termos de Uso" }]}
      kicker="Legal"
      title="TERMOS DE USO DO MOTOSANGO."
      subtitle="Leia atentamente os termos para uso da plataforma MotoSango."
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-24">
        <section>
          <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 mb-12">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center shrink-0">
                <Info className="w-7 h-7 text-[#FFC400]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-black mb-2">
                  Sobre este documento
                </h3>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                  Estes Termos de Uso regem a relação entre o MotoSango e os
                  usuários da plataforma (passageiros e mototaxistas). Ao
                  cadastrar-se ou utilizar o serviço, você concorda com todas
                  as regras aqui estabelecidas.
                </p>
                <p className="text-[#FFC400] text-xs sm:text-sm font-bold mt-4 tracking-wide uppercase">
                  Atualizado em setembro de 2026
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {termsSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 hover:border-[#FFC400]/30 transition-all"
                >
                  <div className="flex items-start gap-4 sm:gap-6 mb-6">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] mb-3">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-white/10 text-3xl font-black leading-none">
                        {section.number}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-white text-xl sm:text-2xl font-black mb-4">
                        {section.title}
                      </h3>
                      <div className="space-y-4">
                        {section.content.map((paragraph, j) => (
                          <p
                            key={j}
                            className="text-white/65 text-sm sm:text-base leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFC400]/10 to-transparent border border-[#FFC400]/20 p-8 sm:p-10 lg:p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#FFC400]" />
              </div>
              <h2 className="text-white text-2xl sm:text-3xl font-black mb-4">
                Obrigado por ler nossos Termos de Uso
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                Ao utilizar o MotoSango, você contribui para um ambiente de
                respeito, transparência e confiança entre passageiros e
                mototaxistas de São Gotardo e região.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:motosangooficial@gmail.com"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold bg-[#FFC400] text-black hover:bg-[#FFD43B] transition-all shadow-xl shadow-[#FFC400]/25"
                >
                  <Mail className="w-4 h-4" />
                  Contato: motosangooficial@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
