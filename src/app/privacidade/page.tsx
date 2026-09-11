import type { Metadata } from "next";
import { InternalPageShell } from "@/components/site/InternalPageShell";

export const metadata: Metadata = {
  title: "Política de Privacidade | MotoSango - São Gotardo MG",
  description:
    "Política de privacidade do MotoSango. Como seus dados são protegidos e tratados no aplicativo de mototáxi de São Gotardo MG. Conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
};
import {
  Shield,
  User,
  MapPin,
  FileText,
  CreditCard,
  Activity,
  Users,
  Lock,
  Eye,
  Cookie,
  Navigation,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function PrivacidadePage() {
  return (
    <InternalPageShell
      breadcrumb={[
        { label: "Legal" },
        { label: "Política de Privacidade" },
      ]}
      kicker="Legal"
      title="POLÍTICA DE PRIVACIDADE."
      subtitle="Entenda como o MotoSango coleta, usa e protege suas informações."
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                1. Introdução
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                O MotoSango tem o compromisso com a privacidade e a segurança
                das informações de todos os seus usuários — passageiros e
                mototaxistas. Esta Política de Privacidade explica quais dados
                são coletados, como são utilizados, compartilhados e protegidos
                dentro da plataforma.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Ao utilizar o MotoSango, você concorda com as práticas descritas
                neste documento. Esta política foi atualizada em setembro de
                2026 e pode ser atualizada periodicamente conforme descrito na
                seção específica.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                2. Informações Coletadas
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-6">
                Coletamos apenas as informações necessárias para o funcionamento
                adequado do serviço, organizadas nas seguintes categorias:
              </p>

              <div className="space-y-5">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-lg font-black">
                      Dados de Cadastro
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Informações fornecidas no momento do cadastro, como nome
                    completo, e-mail, telefone, CPF (quando necessário para
                    identificação) e dados de perfil, incluindo foto quando
                    voluntariamente enviada.
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-lg font-black">
                      Dados de Localização
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Dados de geolocalização para encontrar mototaxistas
                    próximos ao passageiro e vice-versa, além de permitir o
                    acompanhamento do trajeto. A localização é coletada apenas
                    quando o aplicativo está em uso.
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-lg font-black">
                      Dados de Solicitação de Corrida
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Informações referentes a cada corrida, como endereço de
                    origem, destino, tipo de corrida solicitado, forma de
                    pagamento escolhida e status da solicitação (aceita, em
                    andamento, concluída ou cancelada).
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-lg font-black">
                      Dados Financeiros
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Dados relacionados às transações, como forma de pagamento
                    (Pix ou dinheiro), valores das corridas, confirmações e
                    comprovantes de Pix. Importante: o MotoSango{" "}
                    <strong className="text-white">
                      não armazena dados completos de cartão de crédito
                    </strong>
                    , pois o serviço utiliza principalmente Pix e dinheiro em
                    espécie.
                  </p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-lg font-black">
                      Dados de Uso
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Informações sobre como você interage com o aplicativo, como
                    telas acessadas, preferências de uso, tipo de dispositivo,
                    sistema operacional e dados de sessão para melhorar a
                    experiência do usuário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                3. Como Usamos as Informações
              </h2>
              <div className="space-y-4">
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">
                    Conectar passageiros e mototaxistas:
                  </strong>{" "}
                  os dados são utilizados para o funcionamento da Fila
                  Inteligente, conectando o passageiro ao mototaxista mais
                  adequado naquele momento.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">
                    Realizar e confirmar corridas:
                  </strong>{" "}
                  processar solicitações, confirmar aceites e organizar a comunicação entre passageiro e mototaxista.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">Processar pagamentos:</strong>{" "}
                  organizar e registrar transações via Pix ou dinheiro em
                  espécie, incluindo a emissão de comprovantes.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">
                    Histórico de corridas e financeiro:
                  </strong>{" "}
                  disponibilizar histórico completo de corridas e de valores
                  para passageiros e mototaxistas em suas respectivas áreas.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">Comunicação:</strong> enviar
                  mensagens importantes sobre o serviço, atualizações,
                  confirmações de corrida e respostas a solicitações de
                  atendimento.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">
                    Melhoria da plataforma:
                  </strong>{" "}
                  analisar dados de uso para entender o comportamento dos
                  usuários e aprimorar funcionalidades, desempenho e
                  experiência.
                </p>
                <p className="text-white/70 text-base leading-relaxed">
                  <strong className="text-white">
                    Segurança e prevenção de fraudes:
                  </strong>{" "}
                  identificar atividades suspeitas, proteger contas e garantir
                  a integridade das operações dentro do MotoSango.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                4. Compartilhamento de Informações
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                O MotoSango compartilha informações apenas nos seguintes
                cenários:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#FFC400] shrink-0 mt-3"></div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">
                      Entre passageiro e mototaxista:
                    </strong>{" "}
                    são compartilhados apenas os dados necessários para a
                    realização da corrida (como nome, dados do veículo e
                    localização), sem exibir informações sensíveis.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#FFC400] shrink-0 mt-3"></div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">
                      Exigência legal ou ordem judicial:
                    </strong>{" "}
                    quando houver determinação legal, como ordens judiciais,
                    requisições de autoridades competentes ou obrigações legais
                    aplicáveis.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#FFC400] shrink-0 mt-3"></div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-[#FFC400]">
                      Não vendemos, alugamos ou comercializamos
                    </strong>{" "}
                    dados pessoais de nossos usuários com terceiros para fins
                    comerciais ou de marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                5. Armazenamento e Segurança
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                O MotoSango adota medidas de segurança técnicas e
                organizacionais adequadas para proteger as informações dos
                usuários contra acessos não autorizados, perda, alteração ou
                divulgação indevida.
              </p>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                Os dados são armazenados em provedores de serviços seguros, com
                padrões de mercado em criptografia e proteção. É importante
                destacar, porém, que{" "}
                <strong className="text-white">
                  nenhuma medida de segurança é 100% infalível
                </strong>{" "}
                em ambientes digitais, por isso trabalhamos constantemente para
                manter nossos protocolos atualizados.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Em caso de incidente de segurança que possa afetar seus dados,
                comunicaremos de forma transparente e nos prazos legais
                aplicáveis.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                6. Seus Direitos
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                Você é o titular dos seus dados e possui direitos previstos em
                lei. Dentro do MotoSango, você pode:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5 text-xs font-black">
                    1
                  </div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">Acessar</strong> seus dados
                    pessoais armazenados na plataforma.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5 text-xs font-black">
                    2
                  </div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">Corrigir</strong>{" "}
                    informações incompletas, desatualizadas ou inexatas.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5 text-xs font-black">
                    3
                  </div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">Excluir</strong> seus dados,
                    quando aplicável e conforme permitido por lei (observando
                    eventuais obrigações legais de retenção).
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0 mt-0.5 text-xs font-black">
                    4
                  </div>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong className="text-white">Revogar</strong> o
                    consentimento para o tratamento de dados, quando aplicável.
                  </p>
                </li>
              </ul>
              <p className="text-white/70 text-base leading-relaxed mt-5">
                Para exercer qualquer um desses direitos, entre em contato
                conosco pelo e-mail:{" "}
                <a
                  href="mailto:motosangooficial@gmail.com"
                  className="text-[#FFC400] hover:underline font-semibold"
                >
                  motosangooficial@gmail.com
                </a>
                . Respondemos à sua solicitação dentro dos prazos legais.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                7. Cookies e Tecnologias Semelhantes
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                O MotoSango utiliza cookies e tecnologias semelhantes para
                garantir o funcionamento básico do serviço, manter a sessão do
                usuário, lembrar preferências e entender como as pessoas usam a
                plataforma.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Você pode desativar os cookies diretamente nas configurações do
                seu navegador. No entanto, é possível que algumas funcionalidades
                do serviço fiquem indisponíveis ou não funcionem corretamente
                sem eles.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                8. Localização
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                O uso de dados de localização é{" "}
                <strong className="text-white">essencial</strong> para o
                funcionamento do MotoSango, pois permite conectar passageiros e
                mototaxistas próximos e acompanhar o trajeto da corrida.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Você pode desligar a permissão de localização nas configurações
                do seu dispositivo, mas isso{" "}
                <strong className="text-white">
                  pode comprometer ou impossibilitar o uso correto
                </strong>{" "}
                das principais funcionalidades do serviço.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                9. Crianças e Adolescentes
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                O MotoSango não é um serviço voltado para crianças e
                adolescentes sem a devida autorização e acompanhamento de um
                responsável legal. O uso da plataforma por menores deve ocorrer
                sempre com a supervisão e consentimento dos pais ou
                responsáveis, que assumem total responsabilidade por qualquer
                utilização nestas condições.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Esta Política de Privacidade pode ser atualizada periodicamente
                para refletir alterações no serviço, em requisitos legais ou
                em nossas práticas de tratamento de dados. Sempre que houver
                alterações relevantes, avisaremos nossos usuários por meio dos
                canais apropriados. Recomendamos que você consulte esta página
                regularmente para se manter informado.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-[#FFC400]/20 p-8 lg:p-10">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFC400]/5 rounded-full blur-3xl"></div>

            <div className="relative flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shrink-0">
                <Mail className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-2xl lg:text-3xl font-black mb-4">
                  11. Contato
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-5">
                  Se você tiver dúvidas, sugestões ou questionamentos sobre
                  esta Política de Privacidade ou sobre o tratamento dos seus
                  dados pessoais no MotoSango, entre em contato conosco:
                </p>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                          Empresa
                        </p>
                        <p className="text-white font-bold">
                          MotoSango
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                          Cidade
                        </p>
                        <p className="text-white font-bold">São Gotardo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FFC400]/10 flex items-center justify-center text-[#FFC400] shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
                          E-mail de contato
                        </p>
                        <a
                          href="mailto:motosangooficial@gmail.com"
                          className="text-[#FFC400] font-bold hover:underline inline-block"
                        >
                          motosangooficial@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
