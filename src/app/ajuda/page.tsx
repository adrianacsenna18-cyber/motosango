"use client";

import { useState } from "react";
import {
  InternalPageShell,
  SectionTitle,
  CTAButton,
} from "@/components/site/InternalPageShell";

import {
  ChevronDown,
  CircleHelp,
  UserCircle,
  Bike,
  CreditCard,
  Sparkles,
  Shield,
  Smartphone,
  Mail,
} from "lucide-react";

const passageiroFaq = [
  {
    id: 1,
    question: "O que é o MotoSango?",
    answer:
      "O MotoSango é o aplicativo de mototáxi oficial de São Gotardo, criado para conectar passageiros aos melhores mototaxistas da região de forma rápida, segura e organizada.",
  },
  {
    id: 2,
    question: "Como solicitar uma corrida?",
    answer:
      "No app, clique em Solicitar Corrida, informe o local de embarque, o destino desejado, escolha a forma de pagamento e confirme. A Fila Inteligente encaminhará sua solicitação para os mototaxistas mais próximos.",
  },
  {
    id: 3,
    question: "Como informar o local de embarque?",
    answer:
      "Permita o acesso ao GPS do seu celular para detectar automaticamente sua localização atual, ou digite o endereço de embarque manualmente no campo apropriado. Confirme sempre se o local está correto.",
  },
  {
    id: 4,
    question: "Como informar o destino?",
    answer:
      "Selecione um dos destinos sugeridos ou digite o endereço completo no campo de destino. Você pode ajustar o ponto de desembarque arrastando o marcador no mapa para maior precisão.",
  },
  {
    id: 5,
    question: "Como funciona a Fila Inteligente?",
    answer:
      "A Fila Inteligente organiza todas as solicitações de corrida priorizando os mototaxistas mais próximos do ponto de embarque. Isso garante atendimento mais rápido e distribuição justa das corridas.",
  },
  {
    id: 6,
    question: "Como o MotoSango encontra os mototaxistas?",
    answer:
      "Através da localização GPS dos mototaxistas que estão ativos e disponíveis no momento da solicitação. O sistema seleciona os profissionais mais próximos e encaminha a chamada.",
  },
  {
    id: 7,
    question: "Por que a chamada pode passar para outro mototaxista?",
    answer:
      "A chamada é repassada para outro mototaxista quando o profissional selecionado não responde dentro do tempo limite, não aceita a corrida, ou está indisponível no momento.",
  },
  {
    id: 8,
    question: "O que acontece se o mototaxista não responder?",
    answer:
      "Se o mototaxista não responder à solicitação dentro do tempo estabelecido, a chamada passa automaticamente para o próximo profissional da fila, evitando atrasos no seu atendimento.",
  },
  {
    id: 9,
    question: "O que acontece se ele não aceitar?",
    answer:
      "Se o mototaxista recusar a corrida, a solicitação é imediatamente encaminhada para o próximo profissional disponível na Fila Inteligente, mantendo o processo rápido e eficiente.",
  },
  {
    id: 10,
    question: "Como sei que minha corrida foi confirmada?",
    answer:
      "Você recebe a confirmação no próprio app, com os dados completos do mototaxista para identificação.",
  },
  {
    id: 11,
    question: "Quais são as formas de pagamento?",
    answer:
      "O MotoSango oferece duas opções de pagamento: Pix (pagamento antecipado e confirmado na solicitação) ou Dinheiro (pagamento diretamente ao mototaxista ao final da corrida).",
  },
  {
    id: 12,
    question: "Se eu escolher Pix, preciso pagar antes?",
    answer:
      "SIM. O pagamento via Pix precisa ser confirmado ANTES da liberação da solicitação. Se o pagamento não for confirmado, a solicitação NÃO é liberada para os mototaxistas.",
  },
  {
    id: 13,
    question: "O que acontece enquanto o Pix não for confirmado?",
    answer:
      "A solicitação fica em estado de aguardo, bloqueada para envio aos mototaxistas. Somente após a confirmação do pagamento Pix a corrida é liberada e encaminhada para a Fila Inteligente.",
  },
  {
    id: 14,
    question: "Posso pagar em dinheiro?",
    answer:
      "Sim. Ao escolher a opção Dinheiro, você informa o valor disponível para troco, o mototaxista confirma que possui o troco adequado, e você paga diretamente ao profissional ao final da corrida.",
  },
  {
    id: 15,
    question: "Como funciona a Chamada Especial?",
    answer:
      "Na Chamada Especial você informa origem e destino, e o mototaxista informa o valor da corrida. Você pode aceitar ou não o valor proposto, garantindo transparência na negociação.",
  },
  {
    id: 16,
    question: "Como funciona o valor na Chamada Especial?",
    answer:
      "O mototaxista propõe um valor com base na distância e rota. Você recebe a proposta e decide se aceita ou não, de forma totalmente livre. Não há obrigação de aceitar o valor oferecido.",
  },
  {
    id: 17,
    question: "Posso fazer uma nova consulta se não aceitar o valor?",
    answer:
      "Sim, você pode fazer quantas consultas quiser. Se não aceitar o valor proposto por um mototaxista, basta solicitar uma nova corrida ou uma nova Chamada Especial quando desejar.",
  },
  {
    id: 18,
    question: "Como adicionar o MotoSango à tela do celular?",
    answer:
      "Acesse o site do MotoSango pelo navegador do celular, clique no menu do navegador (três pontinhos) e selecione a opção 'Adicionar à tela inicial'. O ícone aparecerá como um app nativo.",
  },
  {
    id: 19,
    question: "Funciona em Android e iPhone?",
    answer:
      "Sim! O MotoSango funciona perfeitamente em dispositivos Android e iPhone (iOS). Você acessa pelo navegador ou adiciona à tela inicial para uma experiência similar a app nativo.",
  },
  {
    id: 20,
    question: "O que fazer se houver algum problema com a corrida?",
    answer:
      "Entre em contato conosco por email. Relate os detalhes do ocorrido, incluindo data, horário e dados da corrida. Nossa equipe analisará e entrará em contato com o retorno.",
  },
];

const mototaxistaFaq = [
  {
    id: 1,
    question: "Como faço meu cadastro?",
    answer:
      "Acesse a página de cadastro de mototaxista, preencha seus dados pessoais, envie os documentos necessários e aguarde a análise e aprovação do seu cadastro pela nossa equipe.",
  },
  {
    id: 2,
    question: "Como me torno mototaxista no MotoSango?",
    answer:
      "Cadastre-se na área de mototaxista, envie toda a documentação exigida e aguarde a validação. Após a aprovação, você já pode ativar sua disponibilidade e receber solicitações.",
  },
  {
    id: 3,
    question: "Como fico disponível?",
    answer:
      "Acesse seu painel de mototaxista e ative a chave de disponibilidade. Enquanto estiver disponível e com GPS ativo, você receberá as solicitações de corrida da Fila Inteligente.",
  },
  {
    id: 4,
    question: "Como recebo solicitações?",
    answer:
      "As solicitações chegam diretamente no seu celular através de notificações quando você está disponível. Você verá os dados da corrida (origem, destino, forma de pagamento e valor).",
  },
  {
    id: 5,
    question: "Como o MotoSango encontra os mototaxistas?",
    answer:
      "Através da sua localização GPS e proximidade com o ponto de embarque do passageiro. Quanto mais próximo você estiver, maior a chance de receber a solicitação primeiro.",
  },
  {
    id: 6,
    question: "Como funciona a Fila Inteligente?",
    answer:
      "A Fila Inteligente organiza e distribui as chamadas priorizando os mototaxistas mais próximos do passageiro, garantindo agilidade no atendimento e justiça na distribuição das corridas.",
  },
  {
    id: 7,
    question: "Por que os mais próximos são chamados primeiro?",
    answer:
      "Para garantir mais agilidade para o passageiro e menos deslocamento vazio para o mototaxista. Esse modelo otimiza o tempo, reduz custos e melhora a experiência de ambos.",
  },
  {
    id: 8,
    question: "Quanto tempo tenho para responder?",
    answer:
      "Você tem um tempo pré-definido para visualizar a oferta e decidir se aceita ou não a corrida. Fique atento às notificações para não perder o prazo e a chamada passar para outro colega.",
  },
  {
    id: 9,
    question: "O que acontece se eu não responder?",
    answer:
      "Se você não responder dentro do tempo limite, a chamada passa automaticamente para o próximo mototaxista da fila. Respondendo rapidamente você garante mais corridas.",
  },
  {
    id: 10,
    question: "O que acontece se eu não aceitar?",
    answer:
      "Se você não aceitar a corrida, a solicitação é encaminhada para o próximo mototaxista disponível. Não há penalidades, mas aceitar mais corridas aumenta seus ganhos.",
  },
  {
    id: 11,
    question: "Como consulto minhas corridas?",
    answer:
      "No seu painel, acesse a área de Histórico. Lá você encontra todas as corridas realizadas, com detalhes de data, horário, origem, destino, forma de pagamento e valores.",
  },
  {
    id: 12,
    question: "Onde vejo as informações das minhas corridas?",
    answer:
      "As informações completas ficam no painel do mototaxista, seja na tela inicial (corridas do dia) ou na seção de histórico, onde você pode filtrar por período e status.",
  },
  {
    id: 13,
    question: "Onde consulto meus ganhos?",
    answer:
      "Na área Financeira do painel do mototaxista. Lá você tem acesso a todos os seus ganhos, valores por corrida, totais diários, semanais e mensais, e o resumo financeiro completo.",
  },
  {
    id: 14,
    question: "Quando uma solicitação paga por Pix chega para mim?",
    answer:
      "A solicitação paga por Pix só chega para você APÓS a confirmação do pagamento pelo passageiro. Se o Pix não for confirmado, a corrida não é liberada e não chega aos mototaxistas.",
  },
  {
    id: 15,
    question: "O que acontece quando o passageiro escolhe dinheiro?",
    answer:
      "Você recebe o valor em espécie diretamente do passageiro ao final da corrida. Lembre-se de confirmar o valor do troco no momento da aceitação para evitar transtornos.",
  },
];

type Categoria = "passageiro" | "mototaxista";

export default function AjudaPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("passageiro");
  const [passageiroAberto, setPassageiroAberto] = useState<number | null>(null);
  const [mototaxistaAberto, setMototaxistaAberto] = useState<number | null>(null);

  const togglePassageiro = (id: number) => {
    setPassageiroAberto(passageiroAberto === id ? null : id);
  };

  const toggleMototaxista = (id: number) => {
    setMototaxistaAberto(mototaxistaAberto === id ? null : id);
  };

  return (
    <InternalPageShell
      breadcrumb={[
        { label: "Ajuda" },
        { label: "Central de Ajuda" },
      ]}
      kicker="Central de Ajuda"
      title="TIRAMOS SUAS DÚVIDAS."
      subtitle="Perguntas frequentes organizadas para passageiros e mototaxistas."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        <section>
          <SectionTitle
            kicker="Navegue por Categoria"
            title="Escolha seu perfil"
            subtitle="Selecione abaixo se você é passageiro ou mototaxista para ver as perguntas frequentes do seu perfil."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">
            <button
              onClick={() => setCategoriaAtiva("passageiro")}
              className={`p-6 rounded-2xl border transition-all text-left ${
                categoriaAtiva === "passageiro"
                  ? "bg-[#FFC400]/10 border-[#FFC400]/40 shadow-lg shadow-[#FFC400]/10"
                  : "bg-[#080B0B] border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    categoriaAtiva === "passageiro"
                      ? "bg-[#FFC400] text-black"
                      : "bg-[#FFC400]/10 border border-[#FFC400]/20 text-[#FFC400]"
                  }`}
                >
                  <UserCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-black">PASSAGEIRO</h3>
                  <p className="text-white/50 text-sm">
                    {passageiroFaq.length} perguntas respondidas
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Tudo sobre como solicitar corridas, formas de pagamento, Fila Inteligente e mais.
              </p>
            </button>

            <button
              onClick={() => setCategoriaAtiva("mototaxista")}
              className={`p-6 rounded-2xl border transition-all text-left ${
                categoriaAtiva === "mototaxista"
                  ? "bg-[#FFC400]/10 border-[#FFC400]/40 shadow-lg shadow-[#FFC400]/10"
                  : "bg-[#080B0B] border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    categoriaAtiva === "mototaxista"
                      ? "bg-[#FFC400] text-black"
                      : "bg-[#FFC400]/10 border border-[#FFC400]/20 text-[#FFC400]"
                  }`}
                >
                  <Bike className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-black">MOTOTAXISTA</h3>
                  <p className="text-white/50 text-sm">
                    {mototaxistaFaq.length} perguntas respondidas
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Cadastro, disponibilidade, recebimento de corridas, ganhos e financeiro.
              </p>
            </button>
          </div>
        </section>

        <section>
          <div
            className={`transition-all duration-300 ${
              categoriaAtiva === "passageiro" ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400]">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  Categoria
                </span>
                <h3 className="text-white text-2xl font-black">
                  PASSAGEIRO - Perguntas Frequentes
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {passageiroFaq.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#080B0B] border rounded-2xl overflow-hidden transition-all ${
                    passageiroAberto === item.id
                      ? "border-[#FFC400]/30 shadow-lg shadow-[#FFC400]/5"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => togglePassageiro(item.id)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        passageiroAberto === item.id
                          ? "bg-[#FFC400] text-black"
                          : "bg-white/5 text-white/50"
                      }`}
                    >
                      <CircleHelp className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-white font-bold text-sm sm:text-base leading-relaxed pr-2">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        passageiroAberto === item.id
                          ? "text-[#FFC400] rotate-180"
                          : "text-white/40"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      passageiroAberto === item.id
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-2 pl-[4.5rem] sm:pl-[5.25rem]">
                        <div className="h-px bg-white/5 mb-4"></div>
                        <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-300 ${
              categoriaAtiva === "mototaxista" ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[#FFC400]">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  Categoria
                </span>
                <h3 className="text-white text-2xl font-black">
                  MOTOTAXISTA - Perguntas Frequentes
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {mototaxistaFaq.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#080B0B] border rounded-2xl overflow-hidden transition-all ${
                    mototaxistaAberto === item.id
                      ? "border-[#FFC400]/30 shadow-lg shadow-[#FFC400]/5"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => toggleMototaxista(item.id)}
                    className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        mototaxistaAberto === item.id
                          ? "bg-[#FFC400] text-black"
                          : "bg-white/5 text-white/50"
                      }`}
                    >
                      <CircleHelp className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-white font-bold text-sm sm:text-base leading-relaxed pr-2">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        mototaxistaAberto === item.id
                          ? "text-[#FFC400] rotate-180"
                          : "text-white/40"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      mototaxistaAberto === item.id
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-2 pl-[4.5rem] sm:pl-[5.25rem]">
                        <div className="h-px bg-white/5 mb-4"></div>
                        <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            kicker="Regras Importantes"
            title="REGRAS DESTACADAS DA PLATAFORMA"
            subtitle="Pontos essenciais que todo usuário do MotoSango deve conhecer para uma experiência tranquila."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#FFC400]/10 to-transparent border border-[#FFC400]/20 rounded-3xl p-7 lg:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-[#FFC400]" />
                </div>
                <h4 className="text-white text-xl font-black">
                  Regra do Pagamento Pix
                </h4>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                  </div>
                  <div>
                    <p className="text-white/75 text-sm leading-relaxed">
                      <strong className="text-white">Para passageiros:</strong>{" "}
                      Se escolher Pix, o pagamento precisa ser confirmado{" "}
                      <strong className="text-[#FFC400]">ANTES</strong> da
                      liberação da solicitação. Se não confirmado,{" "}
                      <strong className="text-[#FFC400]">NÃO libera</strong>.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFC400]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                  </div>
                  <div>
                    <p className="text-white/75 text-sm leading-relaxed">
                      <strong className="text-white">Para mototaxistas:</strong>{" "}
                      A solicitação paga por Pix{" "}
                      <strong className="text-[#FFC400]">
                        só chega para você APÓS
                      </strong>{" "}
                      a confirmação do pagamento. Não se preocupe com corridas
                      sem pagamento garantido.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 lg:p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-white text-xl font-black">
                  Regras Gerais da Plataforma
                </h4>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed">
                    Mantenha o GPS do celular sempre ativo para receber
                    solicitações com precisão e pontualidade.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bike className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed">
                    Respeite o tempo de resposta: não respondendo a tempo, a
                    corrida passa para o próximo da fila.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed">
                    Respeito mútuo: passageiros e mototaxistas devem sempre
                    agir com educação e cordialidade.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080B0B] to-black border border-white/5 p-10 sm:p-14 lg:p-16">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-[#FFC400]" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/20 mb-6">
                <CircleHelp className="w-3.5 h-3.5 text-[#FFC400]" />
                <span className="text-[#FFC400] font-bold text-xs uppercase tracking-wider">
                  Não encontrou sua resposta?
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
                Fale diretamente com nossa equipe.
              </h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                Se sua dúvida não foi resolvida nas perguntas frequentes, entre
                em contato por email. Nossa equipe responderá o mais rápido
                possível.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton
                  href="mailto:motosangooficial@gmail.com"
                  icon={<Mail className="w-4 h-4" />}
                >
                  motosangooficial@gmail.com
                </CTAButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </InternalPageShell>
  );
}
