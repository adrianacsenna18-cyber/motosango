"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { ClienteBottomNav } from "@/components/layout/ClienteBottomNav";

export default function SolicitarCorrida() {
  const router = useRouter();
  const pathname = usePathname();
  const [origem, setOrigem] = useState("");
  const [complemento, setComplemento] = useState("");
  const [destino, setDestino] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoCorrida, setTipoCorrida] = useState("normal");
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tarifaBase, setTarifaBase] = useState(10.00);
  
  const [regras, setRegras] = useState({
    regra_noite: false,
    regra_sabado: false,
    regra_domingo: false,
    regra_feriado_nacional: false,
    regra_feriado_local: false
  });

  const isRuleActive = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    
    if (regras.regra_noite && (hour >= 22 || hour < 6)) return true;
    if (regras.regra_sabado && day === 6) return true;
    if (regras.regra_domingo && day === 0) return true;
    if (regras.regra_feriado_local) return true;
    
    if (regras.regra_feriado_nacional) {
      const d = now.getDate();
      const m = now.getMonth() + 1;
      const isHoliday = 
        (d===1 && m===1) || // Confraternização Universal
        (d===21 && m===4) || // Tiradentes
        (d===1 && m===5) || // Dia do Trabalho
        (d===7 && m===9) || // Independência
        (d===12 && m===10) || // Nossa Sra Aparecida
        (d===2 && m===11) || // Finados
        (d===15 && m===11) || // Proclamação da República
        (d===25 && m===12); // Natal
      if (isHoliday) return true;
    }
    
    return false;
  };

  // FAILSAFE: Se o usuário interagir com o formulário, garantimos que loading seja falso
  useEffect(() => {
    if (loading) setLoading(false);
  }, [origem, destino, tipoCorrida, formaPagamento]);

  // RESET TOTAL AO VOLTAR PARA A TELA: Garante que o Next.js não mantenha cache quebrado
  useEffect(() => {
    if (pathname === '/cliente/solicitar') {
      setLoading(false);
      // Não resetamos origem e destino aqui para não apagar o que o usuário já digitou,
      // a menos que estejamos vindo de um redirect direto de finalização.
      // Como já limpamos antes de sair, deve estar vazio.
    }
  }, [pathname]);

  useEffect(() => {
    const userData = localStorage.getItem("motosango_user");
    if (!userData) {
      router.push("/cliente/login");
    } else {
      setUser(JSON.parse(userData));
    }
    
    // Fetch global config
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("*").limit(1);
      if (data && data.length > 0) {
        setTarifaBase(Number(data[0].tarifa_base));
        setRegras({
          regra_noite: !!data[0].regra_noite,
          regra_sabado: !!data[0].regra_sabado,
          regra_domingo: !!data[0].regra_domingo,
          regra_feriado_nacional: !!data[0].regra_feriado_nacional,
          regra_feriado_local: !!data[0].regra_feriado_local
        });
      }
    };
    fetchSettings();

    // Garantir que o estado de loading e formulário não fiquem travados 
    // ao voltar de uma corrida finalizada (Next.js bfcache)
    setLoading(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setLoading(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handlePageShow = () => {
      setLoading(false);
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router]);

  // Auto detect special cities
  useEffect(() => {
    if (!destino && !origem) return;
    
    // Lista de palavras que identificam a cidade base (São Gotardo)
    const baseCityKeywords = ["são gotardo", "sao gotardo"];
    
    const destLower = destino.toLowerCase();
    const origLower = origem.toLowerCase();
    
    // Se o destino E a origem estiverem vazios, não faz nada
    if (!destLower && !origLower) return;
    
    // Função auxiliar para verificar se é São Gotardo
    const isBaseCity = (text: string) => {
      // Se não digitou nada, assume local (ou se for apenas rua)
      if (!text) return true;
      // Se tiver virgula ou tracinho indicando cidade, verifica.
      // Uma regra mais abrangente: se mencionar QUALQUER OUTRA CIDADE, é especial.
      // Se mencionar São Gotardo, é local.
      return baseCityKeywords.some(city => text.includes(city));
    };

    // Lista de cidades/distritos que DEVEM forçar corrida especial
    const specialCities = [
      "guarda dos ferreira",
      "guarda dos ferreiros", 
      "matutina", 
      "rio paranaíba", 
      "rio paranaiba",
      "tiros",
      "carmo do paranaíba",
      "carmo do paranaiba",
      "patos de minas",
      "arapua",
      "arapuá"
    ];
    
    const hasSpecialDest = specialCities.some(city => destLower.includes(city));
    const hasSpecialOrig = specialCities.some(city => origLower.includes(city));
    
    // Se digitou explicitamente uma cidade especial na origem ou destino
    if (hasSpecialDest || hasSpecialOrig) {
      setTipoCorrida("especial");
      return;
    }
    
    // Se o usuário colocou o nome de uma cidade que NÃO É São Gotardo (ex: ", ibia")
    // Esta é uma regra avançada, mas como a maioria digita apenas a rua para local,
    // e "rua tal, guarda dos ferreiros" para especial, a regra acima já cobre.
    // Vamos garantir que Guarda dos Ferreiros está acionando.
    
  }, [destino, origem]);

  const obterLocalizacao = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigem(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
        },
        (error) => {
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Geolocalização não suportada no seu navegador.");
    }
  };

  const formatAddressForDisplay = (address: string) => {
    if (!address) return '';
    if (address.startsWith('Lat:')) {
      return '📍 Localização atual';
    }
    return address;
  };

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const origemCompleta = complemento.trim() !== "" ? `${origem} (Comp: ${complemento.trim()})` : origem;

    let finalTipoCorrida = tipoCorrida;
    let finalValor = tipoCorrida === 'normal' ? tarifaBase : null;
    let finalNegociacao = tipoCorrida === 'especial' ? 'nenhuma' : 'nenhuma';

    // Se a corrida for local (UI em 'normal') mas houver regra ativa (noite/fds/feriado), 
    // força para o fluxo de negociação (especial)
    if (tipoCorrida === 'normal' && isRuleActive()) {
      finalTipoCorrida = 'especial';
      finalValor = null;
    }

    try {
      const { data, error } = await supabase
        .from("rides")
        .insert([{
          cliente_id: user.id,
          origem: origemCompleta,
          destino,
          referencia,
          tipo_corrida: finalTipoCorrida,
          forma_pagamento: formaPagamento,
          status: 'aguardando',
          status_negociacao: finalNegociacao,
          valor: finalValor
        }])
        .select();

      if (error) throw error;
      
      // Disparar push notification em background sem travar a tela
      fetch('/api/push/notify-all', { method: 'POST' }).catch(err => 
        console.error("Erro ao disparar push de notificação:", err)
      );
      
      const rideId = data[0].id;
      
      // Resetar o estado local ANTES de navegar
      // Isso evita que o Next.js faça cache da tela com o loading=true e com os dados da corrida antiga
      setOrigem("");
      setComplemento("");
      setDestino("");
      setReferencia("");
      setTipoCorrida("normal");
      setLoading(false);
      
      // Um pequeno delay garante que o React vai atualizar a tela e remover o loading
      // antes do Next.js congelar o componente e navegar.
      setTimeout(() => {
        router.push(`/cliente/corrida/${rideId}`);
      }, 100);
    } catch (error) {
      console.error("Erro ao solicitar:", error);
      alert("Erro ao solicitar corrida.");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0 bg-gray-200">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Current Location Pin */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full mb-2 shadow-xl tracking-wide">
            Você está aqui
          </div>
          <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl"></div>
        </div>
      </div>

      <header className="flex items-center justify-between p-6 pt-8 mb-2 z-10 relative">
        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
          <h1 className="text-base font-bold text-black tracking-tight">Olá, {user.nome.split(' ')[0]}</h1>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">
          👤
        </div>
      </header>

      <div className="p-4 mt-auto z-10 relative">
        <div className="bg-white rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] p-6 sm:p-8 border border-gray-100">
          <h2 className="font-black text-2xl mb-6 text-black tracking-tight flex items-center gap-2">
            <span>🏍️</span> Para onde vamos?
          </h2>
          
          <form onSubmit={handleSolicitar} className="flex flex-col gap-4">
            <label htmlFor="origem" className="block text-sm font-bold text-gray-700 mb-0 ml-1">Onde você está?</label>
            <p className="text-xs text-gray-500 mb-2 ml-1">📍 Permita sua localização para encontrarmos o mototaxista mais próximo de você.</p>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-5 w-3 h-3 rounded-full bg-green-500 shadow-sm z-10"></div>
              <div className="absolute top-10 left-[1.3rem] w-0.5 h-6 bg-gray-200 z-0"></div>
              <input 
                type="text" 
                required
                value={formatAddressForDisplay(origem)}
                onChange={(e) => {
                  // Se o usuário tentar editar manualmente a localização atual, limpamos para ele digitar
                  if (origem.startsWith('Lat:')) {
                    setOrigem(e.target.value.replace('📍 Localização atual', ''));
                  } else {
                    setOrigem(e.target.value);
                  }
                }}
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-black text-sm placeholder-gray-400"
                placeholder="Local de embarque"
              />
              <button 
                type="button" 
                onClick={obterLocalizacao}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold text-xs bg-primary/20 px-3 py-2 rounded-xl hover:bg-primary/30 transition-colors flex items-center gap-1"
              >
                📍 GPS
              </button>
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium text-black placeholder-gray-400"
                placeholder="Número ou complemento (Ex: 123, casa azul, portão preto)"
              />
            </div>

            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-5 w-3 h-3 rounded-full bg-primary shadow-sm z-10 pointer-events-none"></div>
              {tipoCorrida === 'especial' ? (
                <div className="relative w-full">
                  <select
                    required
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 pl-12 pr-10 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-black text-sm appearance-none cursor-pointer relative z-20"
                  >
                    <option value="">Selecione o destino especial...</option>
                    <option value="Guarda dos Ferreiros">Guarda dos Ferreiros</option>
                    <option value="Agrovila">Agrovila</option>
                    <option value="Coopadap">Coopadap</option>
                    <option value="Capelinha de Cima">Capelinha de Cima</option>
                    <option value="Capelinha de Baixo">Capelinha de Baixo</option>
                    <option value="Rio Paranaíba">Rio Paranaíba</option>
                    <option value="Vera Shimada">Vera Shimada</option>
                    <option value="Campos Altos">Campos Altos</option>
                    <option value="Ibiá">Ibiá</option>
                    <option value="Carmo do Paranaíba">Carmo do Paranaíba</option>
                    <option value="Santa Rosa">Santa Rosa</option>
                    <option value="Patos de Minas">Patos de Minas</option>
                    <option value="Araxá">Araxá</option>
                    <option value="Aeroporto">Aeroporto</option>
                    <option value="Matutina">Matutina</option>
                    <option value="Tiros">Tiros</option>
                    <option value="Sekita">Sekita</option>
                    <option value="Outros">Outros</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-30">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : (
                <input 
                  type="text" 
                  required
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-black text-sm placeholder-gray-400 relative z-20"
                  placeholder="Para onde você vai?"
                />
              )}
            </div>

            <div className="mt-1">
              <input 
                type="text" 
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium text-black placeholder-gray-400"
                placeholder="Ponto de referência (opcional)"
              />
            </div>

            <div className="mt-2 flex bg-gray-100 p-1.5 rounded-2xl">
              <button 
                type="button"
                onClick={() => {
                  if (tipoCorrida !== 'normal') {
                    setTipoCorrida("normal");
                    setDestino("");
                  }
                }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoCorrida === 'normal' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Normal ({isRuleActive() ? 'A combinar' : `R$ ${tarifaBase.toFixed(2).replace('.', ',')}`})
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (tipoCorrida !== 'especial') {
                    setTipoCorrida("especial");
                    setDestino("");
                  }
                }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tipoCorrida === 'especial' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ⚠️ Especial (Negociar)
              </button>
            </div>
            
            {tipoCorrida === 'normal' && isRuleActive() && (
              <p className="text-xs text-orange-700 font-medium px-4 py-3 bg-orange-50 rounded-xl border border-orange-100 text-center leading-relaxed">
                🕒 Devido ao horário ou feriado, o valor desta corrida será combinado diretamente com o mototaxista.
              </p>
            )}
            
            {tipoCorrida === 'especial' && (
              <p className="text-xs text-orange-700 font-medium px-4 py-3 bg-orange-50 rounded-xl border border-orange-100 text-center leading-relaxed">
                ⚠️ Corrida Especial — Negociar com o Mototaxista (O mototaxista irá propor um valor para você aprovar antes da corrida começar).
              </p>
            )}

            <div className="mt-3">
              <p className="text-sm font-bold text-black mb-3 px-1">Forma de Pagamento</p>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setFormaPagamento("pix")}
                  className={`flex-1 py-3.5 text-sm font-bold rounded-2xl transition-all border-2 flex items-center justify-center gap-2 ${formaPagamento === 'pix' ? 'border-primary bg-yellow-50 text-black' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <span className="text-green-500 text-xl leading-none">◉</span> PIX
                </button>
                <button 
                  type="button"
                  onClick={() => setFormaPagamento("dinheiro")}
                  className={`flex-1 py-3.5 text-sm font-bold rounded-2xl transition-all border-2 flex items-center justify-center gap-2 ${formaPagamento === 'dinheiro' ? 'border-primary bg-yellow-50 text-black' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                >
                  <span className="text-green-600 text-xl leading-none">💵</span> DINHEIRO
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || origem.trim() === "" || destino.trim() === ""}
              className="mt-4 w-full py-4 bg-primary text-black font-black text-center rounded-full text-lg shadow-[0_10px_20px_rgba(255,208,0,0.2)] hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 transition-all active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-wide"
            >
              {loading ? "Buscando..." : "🚖 Chamar mototáxi agora"}
            </button>
          </form>
        </div>
      </div>
      <ClienteBottomNav />
    </div>
  );
}
