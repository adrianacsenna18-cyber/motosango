"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { ClienteBottomNav } from "@/components/layout/ClienteBottomNav";

export default function SolicitarCorrida() {
  const router = useRouter();
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipoCorrida, setTipoCorrida] = useState("normal");
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tarifaBase, setTarifaBase] = useState(10.00);

  useEffect(() => {
    const userData = localStorage.getItem("motosango_user");
    if (!userData) {
      router.push("/cliente/login");
    } else {
      setUser(JSON.parse(userData));
    }
    
    // Fetch global config
    const fetchSettings = async () => {
      const { data } = await supabase.from("settings").select("tarifa_base").limit(1);
      if (data && data.length > 0) {
        setTarifaBase(Number(data[0].tarifa_base));
      }
    };
    fetchSettings();
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

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("rides")
        .insert([{
          cliente_id: user.id,
          origem,
          destino,
          referencia,
          tipo_corrida: tipoCorrida,
          forma_pagamento: formaPagamento,
          status: 'aguardando',
          status_negociacao: tipoCorrida === 'especial' ? 'nenhuma' : 'nenhuma',
          valor: tipoCorrida === 'normal' ? tarifaBase : null
        }])
        .select();

      if (error) throw error;
      
      router.push(`/cliente/corrida/${data[0].id}`);
    } catch (error) {
      console.error("Erro ao solicitar:", error);
      alert("Erro ao solicitar corrida.");
    } finally {
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
          <div className="bg-dark text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2 shadow-md">
            Você está aqui
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
        </div>
      </div>

      <header className="flex items-center justify-between p-6 pt-8 mb-2 z-10 relative">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <h1 className="text-lg font-bold text-dark">Olá, {user.nome.split(' ')[0]}</h1>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border-2 border-primary">
          👤
        </div>
      </header>

      <div className="p-4 mt-auto z-10 relative">
        <div className="bg-white rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 border border-gray-100">
          <h2 className="font-bold text-xl mb-6 text-dark flex items-center gap-2">
            <span>🏍️</span> Para onde vamos?
          </h2>
          
          <form onSubmit={handleSolicitar} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              <div className="absolute top-10 left-5 w-0.5 h-8 bg-gray-200"></div>
              <input 
                type="text" 
                required
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-dark"
                placeholder="Local de embarque"
              />
              <button 
                type="button" 
                onClick={obterLocalizacao}
                className="absolute right-3 top-3 text-primary font-bold text-sm bg-yellow-50 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                📍 GPS
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <input 
                type="text" 
                required
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-dark"
                placeholder="Para onde você vai?"
              />
            </div>

            <div className="mt-2">
              <input 
                type="text" 
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium text-gray-600"
                placeholder="Ponto de referência (opcional)"
              />
            </div>

            <div className="mt-2 flex bg-gray-100 p-1 rounded-xl">
              <button 
                type="button"
                onClick={() => setTipoCorrida("normal")}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tipoCorrida === 'normal' ? 'bg-white text-dark shadow-sm' : 'text-gray-500'}`}
              >
                Normal (R$ {tarifaBase.toFixed(2).replace('.', ',')})
              </button>
              <button 
                type="button"
                onClick={() => setTipoCorrida("especial")}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tipoCorrida === 'especial' ? 'bg-dark text-white shadow-sm' : 'text-gray-500'}`}
              >
                ⚠️ Especial (Negociar)
              </button>
            </div>
            
            {tipoCorrida === 'especial' && (
              <p className="text-xs text-orange-600 font-medium px-2">
                ⚠️ Corrida Especial — Negociar com o Mototaxista (O mototaxista irá propor um valor para você aprovar antes da corrida começar).
              </p>
            )}

            <div className="mt-4">
              <p className="text-sm font-bold text-dark mb-2">Forma de Pagamento</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormaPagamento("pix")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all border-2 flex items-center justify-center gap-2 ${formaPagamento === 'pix' ? 'border-primary bg-yellow-50 text-dark' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="text-green-500 text-lg">◉</span> PIX
                </button>
                <button 
                  type="button"
                  onClick={() => setFormaPagamento("dinheiro")}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all border-2 flex items-center justify-center gap-2 ${formaPagamento === 'dinheiro' ? 'border-primary bg-yellow-50 text-dark' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="text-yellow-500 text-lg">💵</span> DINHEIRO
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !origem || !destino}
              className="mt-4 w-full py-4 bg-primary text-dark font-bold text-center rounded-xl text-lg shadow-lg shadow-yellow-200 hover:bg-yellow-400 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex justify-center items-center gap-2"
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
