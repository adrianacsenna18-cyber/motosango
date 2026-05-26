"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { Navigation, CheckCircle2, XCircle } from "lucide-react";

declare global {
  interface Window {
    currentTimeout: any;
  }
}

export default function PainelMototaxista() {
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [corridaAtiva, setCorridaAtiva] = useState<any>(null);
  const [novaCorrida, setNovaCorrida] = useState<any>(null);
  const [valorProposto, setValorProposto] = useState<string>("");
  const [isNegociando, setIsNegociando] = useState(false);
  const [showMensalidade, setShowMensalidade] = useState(false);
  const [configMensalidade, setConfigMensalidade] = useState<any>({ valor: 50.00, pix: '' });
  
  // Use refs to avoid stale closures in realtime subscriptions
  const isOnlineRef = useRef(isOnline);
  const corridaAtivaRef = useRef(corridaAtiva);

  useEffect(() => {
    isOnlineRef.current = isOnline;
    corridaAtivaRef.current = corridaAtiva;
  }, [isOnline, corridaAtiva]);

  const checkCorridasPendentes = async () => {
    // Apenas puxar corridas aguardando das últimas 12 horas
    const hoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "aguardando")
      .gte("created_at", hoursAgo)
      .order("created_at", { ascending: true });
      
    if (data && data.length > 0) {
      // Filtrar no client se ele já rejeitou (o array no PG pode ser null)
      const corridaValida = data.find(c => {
        const hasRejected = c.rejected_by && c.rejected_by.includes(driver?.id);
        const isReservedToAnother = c.motorista_id && c.motorista_id !== driver?.id && c.status_negociacao === 'sugerido';
        return !hasRejected && !isReservedToAnother;
      });
      
      if (corridaValida) {
        setNovaCorrida(corridaValida);
        setValorProposto("");
        setIsNegociando(false);
        
        // Timeout de 20s para ignorar (apenas se for normal ou se a especial nao tiver sido respondida)
        if (!window.currentTimeout) {
          window.currentTimeout = setTimeout(() => {
            if (corridaValida.status_negociacao === 'nenhuma') {
              recusarCorrida(corridaValida.id);
            }
          }, 20000);
        }
      } else {
        setNovaCorrida(null);
        clearTimeout(window.currentTimeout);
      }
    } else {
      setNovaCorrida(null);
      clearTimeout(window.currentTimeout);
    }
  };

  useEffect(() => {
    const driverData = localStorage.getItem("motosango_driver");
    if (!driverData) {
      router.push("/mototaxista/login");
      return;
    }
    
    const parsedDriver = JSON.parse(driverData);
    setDriver(parsedDriver);
    setIsOnline(parsedDriver.status_online);
    
    checkCorridaAtiva(parsedDriver.id);
    fetchConfig();

    if (parsedDriver.status_online) {
      checkCorridasPendentes();
    }

    // Subscribe to new rides
    const ridesSub = supabase
      .channel('public:rides')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rides' },
        (payload) => {
          if (payload.new.status === 'aguardando' && isOnlineRef.current && !corridaAtivaRef.current) {
            // Verificar se foi eu que rejeitei (provavelmente não pois é insert, mas por garantia)
            setNovaCorrida(payload.new);
            setValorProposto("");
            setIsNegociando(false);
            
            // Start timeout on insert
            clearTimeout(window.currentTimeout);
            window.currentTimeout = setTimeout(() => {
              if (payload.new.status_negociacao === 'nenhuma') {
                recusarCorrida(payload.new.id);
              }
            }, 20000);
            
            // Tocar som (Browser Audio API)
            try {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.log('Audio autoplay prevented'));
            } catch (e) {}
          }
        }
      )
      .subscribe();

    // Listen for updates (e.g. status_negociacao recusado or corrida canceled)
    const ridesUpdateSub = supabase
      .channel('public:rides:update')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rides' },
        (payload) => {
          const updatedRide = payload.new;
          
          // Se a corrida ativa atual for atualizada (ex: cliente cancelou)
          if (corridaAtivaRef.current && corridaAtivaRef.current.id === updatedRide.id) {
            if (updatedRide.status === 'cancelado' || updatedRide.status === 'concluido' || updatedRide.status === 'recusado') {
              setCorridaAtiva(null);
              checkCorridasPendentes();
            } else {
              setCorridaAtiva((prev: any) => ({ ...prev, ...updatedRide }));
            }
          } else if (!corridaAtivaRef.current && updatedRide.motorista_id === parsedDriver.id && (updatedRide.status === 'aceito' || updatedRide.status === 'a_caminho' || updatedRide.status === 'em_andamento')) {
            // Cliente acabou de aceitar a corrida especial ou houve atualização que ativou a corrida para nós
            checkCorridaAtiva(parsedDriver.id);
          } else if (corridaAtivaRef.current && corridaAtivaRef.current.id === updatedRide.id && corridaAtivaRef.current.status !== updatedRide.status) {
             // Sincronizar com qualquer atualização externa do mesmo id, caso necessário.
             setCorridaAtiva((prev: any) => ({ ...prev, ...updatedRide }));
          }
          
          if (isOnlineRef.current && !corridaAtivaRef.current) {
            checkCorridasPendentes(); // Re-evaluate if we should show something
          }
        }
      )
      .subscribe();

    // Listen for driver updates (e.g. admin blocking)
    const driverUpdateSub = supabase
      .channel('public:drivers:update')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'drivers', filter: `id=eq.${parsedDriver.id}` },
        (payload) => {
          const updatedDriver = payload.new;
          setDriver((prev: any) => ({ ...prev, ...updatedDriver }));
          localStorage.setItem("motosango_driver", JSON.stringify(updatedDriver));
          
          if (updatedDriver.bloqueado_mensalidade && isOnlineRef.current) {
            setIsOnline(false);
            setNovaCorrida(null);
            alert("Sua conta foi bloqueada pelo administrador (Mensalidade). Você está offline.");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ridesSub);
      supabase.removeChannel(ridesUpdateSub);
      supabase.removeChannel(driverUpdateSub);
      clearTimeout(window.currentTimeout);
    };
  }, [router]); // Removed isOnline and corridaAtiva to prevent recreating the channel

  const checkCorridaAtiva = async (driverId: string) => {
    // Apenas corridas das últimas 12 horas para evitar testes antigos presos
    const hoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from("rides")
      .select("*, users(nome, telefone)")
      .eq("motorista_id", driverId)
      .in("status", ["aceito", "a_caminho", "em_andamento"])
      .gte("created_at", hoursAgo)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (data && data.length > 0) {
      setCorridaAtiva(data[0]);
    } else {
      setCorridaAtiva(null);
    }
  };

  const fetchConfig = async () => {
    const { data } = await supabase.from("settings").select("mensalidade_valor, pix_admin").limit(1);
    if (data && data.length > 0) {
      setConfigMensalidade({ valor: data[0].mensalidade_valor, pix: data[0].pix_admin });
    }
  };

  const toggleOnline = async () => {
    if ((driver?.status_plano === 'vencido' || driver?.bloqueado_mensalidade) && !isOnline) {
      alert("Sua mensalidade está vencida ou bloqueada. Renove o plano para ficar online e receber corridas.");
      return;
    }

    const newState = !isOnline;
    setIsOnline(newState);
    
    if (newState) {
      checkCorridasPendentes();
    } else {
      setNovaCorrida(null);
    }
    
    if (driver) {
      await supabase
        .from("drivers")
        .update({ status_online: newState })
        .eq("id", driver.id);
        
      const updatedDriver = { ...driver, status_online: newState };
      setDriver(updatedDriver);
      localStorage.setItem("motosango_driver", JSON.stringify(updatedDriver));
    }
  };

  const recusarCorrida = async (corridaId: string) => {
    clearTimeout(window.currentTimeout);
    // Adicionar motorista ao array de rejeitados
    const currentRejected = novaCorrida.rejected_by || [];
    await supabase
      .from("rides")
      .update({ rejected_by: [...currentRejected, driver.id] })
      .eq("id", corridaId);
      
    setNovaCorrida(null);
    setIsNegociando(false);
    checkCorridasPendentes(); // Buscar a próxima
  };

  const aceitarCorrida = async (corridaId: string) => {
    clearTimeout(window.currentTimeout);
    
    // Tratamento correto para corrida especial
    if (novaCorrida.tipo_corrida === 'especial' && (novaCorrida.status_negociacao === 'nenhuma' || novaCorrida.status_negociacao === 'recusado')) {
      if (!valorProposto) return alert("Digite um valor para a corrida especial.");
      
      const valorNum = parseFloat(String(valorProposto).replace(',', '.'));
      if (isNaN(valorNum) || valorNum <= 0) return alert("Digite um valor válido.");

      // Enviar proposta de valor para o cliente aprovar
      const { error } = await supabase
        .from("rides")
        .update({ 
          status_negociacao: 'sugerido', 
          valor_sugerido: valorNum,
          motorista_id: driver.id // Fica "reservado" temporariamente para este motorista
        })
        .eq("id", corridaId)
        .eq("status_negociacao", "nenhuma");
        
      if (!error) {
        setNovaCorrida({ ...novaCorrida, status_negociacao: 'sugerido', valor_sugerido: valorNum, motorista_id: driver.id });
      } else {
        alert("Erro ao enviar proposta. A corrida já pode estar sendo negociada.");
      }
      return;
    }

    // Corrida normal ou especial já aprovada
    const { error } = await supabase
      .from("rides")
      .update({ 
        status: 'aceito', 
        motorista_id: driver.id,
        ...(novaCorrida.tipo_corrida === 'especial' ? { valor: novaCorrida.valor_sugerido } : {})
      })
      .eq("id", corridaId)
      .in("status", ["aguardando", "aceito"]); // Ensure it wasn't taken by someone else
      
    if (!error) {
      setNovaCorrida(null);
      setIsNegociando(false);
      checkCorridaAtiva(driver.id);
    } else {
      alert("Corrida já foi aceita por outro ou cancelada.");
      setNovaCorrida(null);
      setIsNegociando(false);
      checkCorridasPendentes();
    }
  };

  const atualizarStatus = async (novoStatus: string) => {
    if (!corridaAtiva) return;
    
    // Backup para reverter se necessário
    const currentRide = { ...corridaAtiva };
    
    // Atualização otimista na interface para ser instantâneo
    if (novoStatus === 'concluido' || novoStatus === 'cancelado') {
      setCorridaAtiva(null);
    } else {
      setCorridaAtiva({ ...currentRide, status: novoStatus });
    }
    
    const { error } = await supabase
      .from("rides")
      .update({ status: novoStatus })
      .eq("id", currentRide.id);
      
    if (error) {
      alert("Erro ao atualizar status. Tente novamente.");
      // Reverter se der erro
      setCorridaAtiva(currentRide);
    }
  };

  const informarPagamentoMensalidade = async () => {
    await supabase.from("drivers").update({ pagamento_em_analise: true }).eq("id", driver.id);
    const updatedDriver = { ...driver, pagamento_em_analise: true };
    setDriver(updatedDriver);
    localStorage.setItem("motosango_driver", JSON.stringify(updatedDriver));
    alert("Administrador notificado! Aguarde a liberação.");
  };

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 relative">
      {/* Header com Toggle */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-dark text-white p-4 pt-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary"
            onClick={() => setShowMensalidade(true)}
          >
            {driver.foto_base64 ? <img src={driver.foto_base64} alt="Perfil" className="w-full h-full object-cover" /> : '👨‍✈️'}
          </div>
          <div>
            <h1 className="font-bold text-sm">{driver.nome.split(' ')[0]}</h1>
            <p 
              className="text-xs text-primary font-bold cursor-pointer"
              onClick={() => setShowMensalidade(true)}
            >
              Minha Mensalidade ➔
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gray-500'}`}></div>
          <span className="text-sm font-bold text-white">{isOnline ? 'Online' : 'Offline'}</span>
          <button 
            onClick={toggleOnline}
            className={`ml-2 w-12 h-6 rounded-full relative transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>
      </header>

      {/* Modal Mensalidade */}
      {showMensalidade && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full h-full max-w-md max-h-[800px] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative mx-auto my-auto">
            <div className="bg-dark text-white p-4 flex items-center justify-between">
              <h1 className="font-bold text-lg">Minha Mensalidade</h1>
              <button onClick={() => setShowMensalidade(false)} className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col overflow-y-auto">
              <div className="text-center mb-6 mt-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Valor da Mensalidade</p>
                <h2 className="text-4xl font-bold text-dark">R$ {configMensalidade.valor}</h2>
                <p className="text-sm font-bold mt-2">
                  Vencimento: {driver.vencimento_mensalidade ? new Date(driver.vencimento_mensalidade).toLocaleDateString() : 'Não definido'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-2">Status do Plano</p>
                <div className={`py-3 rounded-lg text-center font-bold text-lg ${
                  driver.bloqueado_mensalidade || driver.status_plano === 'vencido' 
                    ? 'bg-red-100 text-red-600' 
                    : driver.pagamento_em_analise 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                }`}>
                  {driver.bloqueado_mensalidade || driver.status_plano === 'vencido' 
                    ? 'VENCIDO' 
                    : driver.pagamento_em_analise 
                      ? 'EM ANÁLISE' 
                      : 'PAGO / ATIVO'}
                </div>
              </div>

              {configMensalidade.pix && (
                <div className="bg-gray-50 p-4 rounded-xl mb-auto text-center border border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">PIX do Administrador</p>
                  <p className="font-bold text-lg text-dark mb-4">{configMensalidade.pix}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(configMensalidade.pix);
                      alert("PIX copiado!");
                    }} 
                    className="w-full py-3 bg-gray-200 text-dark font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                  >
                    COPIAR PIX DO ADMINISTRADOR
                  </button>
                </div>
              )}

              <button 
                onClick={informarPagamentoMensalidade}
                disabled={driver.pagamento_em_analise}
                className="w-full py-4 mt-6 bg-primary text-dark font-bold text-center rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 disabled:opacity-50 hover:bg-yellow-400 transition-colors"
              >
                <CheckCircle2 size={24} /> {driver.pagamento_em_analise ? 'JÁ AVISADO' : 'JÁ PAGUEI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="h-[55vh] bg-gray-200 relative w-full">
        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Fake Map Route/Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 z-20 relative p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex flex-col">
        {!isOnline && !corridaAtiva && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">😴</div>
            <h2 className="text-xl font-bold text-dark mb-2">Você está offline</h2>
            <p className="text-gray-500 text-sm">Fique online no topo da tela para começar a receber corridas na sua região.</p>
          </div>
        )}

        {isOnline && !corridaAtiva && !novaCorrida && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 shadow-lg shadow-green-100">
              <Navigation size={32} className="animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Você está disponível</h2>
            <p className="text-gray-500 text-sm max-w-xs">Aguardando novas solicitações de corrida na sua região...</p>
          </div>
        )}

        {/* Modal de Nova Corrida */}
        {novaCorrida && !corridaAtiva && (
          <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-3xl p-6 flex flex-col z-30 shadow-2xl overflow-y-auto pb-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-dark">Nova corrida</h2>
              {novaCorrida.tipo_corrida === 'especial' && (
                <div className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  ⚠️ CORRIDA ESPECIAL
                </div>
              )}
            </div>
            
            <div className="space-y-5 mb-auto">
              <div className="flex gap-4 items-start">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1 shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Origem</p>
                  <p className="font-bold text-dark text-lg">{novaCorrida.origem}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Destino</p>
                  <p className="font-bold text-dark text-lg">{novaCorrida.destino}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 mt-4 border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Valor</p>
                  {novaCorrida.tipo_corrida === 'especial' ? (
                    novaCorrida.status_negociacao === 'nenhuma' || novaCorrida.status_negociacao === 'recusado' ? (
                      <p className="text-lg font-bold text-orange-500">A combinar</p>
                    ) : novaCorrida.status_negociacao === 'sugerido' ? (
                      <p className="text-lg font-bold text-orange-500">R$ {novaCorrida.valor_sugerido?.toFixed(2).replace('.', ',')} (Aguardando...)</p>
                    ) : (
                      <p className="text-lg font-bold text-red-500">Recusado</p>
                    )
                  ) : (
                    <p className="text-2xl font-bold text-dark">R$ {novaCorrida.valor || '10,00'}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Tipo</p>
                  <p className={`text-md font-bold ${novaCorrida.tipo_corrida === 'especial' ? 'text-purple-600' : 'text-dark'}`}>
                    {novaCorrida.tipo_corrida === 'especial' ? 'ESPECIAL' : 'NORMAL'}
                  </p>
                </div>
              </div>
              
              {novaCorrida.tipo_corrida === 'especial' && (novaCorrida.status_negociacao === 'nenhuma' || novaCorrida.status_negociacao === 'recusado') && (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1 shadow-inner">
                    <span className="font-bold text-dark text-lg">R$</span>
                    <input 
                      type="number" 
                      value={valorProposto}
                      onChange={(e) => setValorProposto(e.target.value)}
                      placeholder="0,00"
                      className="w-full text-lg font-bold outline-none text-dark bg-transparent"
                      autoFocus
                    />
                  </div>
                  <button 
                    onClick={() => aceitarCorrida(novaCorrida.id)}
                    className="py-3 px-4 bg-primary text-dark font-bold rounded-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <CheckCircle2 size={18} /> ENVIAR
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-auto">
              {novaCorrida.status_negociacao !== 'sugerido' && (
                <>
                  <button 
                    onClick={() => recusarCorrida(novaCorrida.id)}
                    className="flex-1 py-4 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} /> RECUSAR
                  </button>
                  {novaCorrida.tipo_corrida !== 'especial' && (
                    <button 
                      onClick={() => aceitarCorrida(novaCorrida.id)}
                      className="flex-1 py-4 bg-primary text-dark font-bold rounded-xl shadow-lg shadow-yellow-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle2 size={20} /> ACEITAR
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Corrida Ativa */}
        {corridaAtiva && (
          <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-3xl p-6 flex flex-col z-30 shadow-2xl overflow-y-auto pb-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-dark">
                {corridaAtiva.status?.toLowerCase() === 'aceito' 
                  ? 'Corrida Aceita' 
                  : corridaAtiva.status?.toLowerCase() === 'a_caminho' 
                    ? 'Indo buscar cliente' 
                    : 'Corrida em andamento'}
              </h2>
              <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                {corridaAtiva.status?.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
              <div className="flex-1">
                <p className="font-bold text-lg text-dark">{corridaAtiva.users?.nome}</p>
                <a href={`tel:${corridaAtiva.users?.telefone}`} className="text-blue-600 font-bold text-sm mt-0.5 inline-block">
                  📞 {corridaAtiva.users?.telefone}
                </a>
              </div>
            </div>

            <div className="space-y-4 mb-auto">
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Origem</p>
                  <p className="font-bold text-dark">{corridaAtiva.origem}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Destino</p>
                  <p className="font-bold text-dark">{corridaAtiva.destino}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {corridaAtiva.status?.toLowerCase() === 'aceito' && (
                <button 
                  onClick={() => atualizarStatus('a_caminho')}
                  className="w-full py-4 bg-dark text-white font-bold rounded-xl shadow-md text-lg"
                >
                  ESTOU A CAMINHO
                </button>
              )}
              
              {corridaAtiva.status?.toLowerCase() === 'a_caminho' && (
                <button 
                  onClick={() => atualizarStatus('em_andamento')}
                  className="w-full py-4 bg-primary text-dark font-bold rounded-xl shadow-lg text-lg"
                >
                  INICIAR CORRIDA
                </button>
              )}

              {corridaAtiva.status?.toLowerCase() === 'em_andamento' && (
                <button 
                  onClick={() => atualizarStatus('concluido')}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 text-lg"
                >
                  ENCERRAR CORRIDA
                </button>
              )}

              <button 
                onClick={() => {
                  if (confirm("Cancelar corrida? Informe o motivo ao cliente.")) {
                    atualizarStatus('cancelado');
                  }
                }}
                className="w-full py-4 bg-transparent text-gray-500 font-bold rounded-xl"
              >
                CANCELAR CORRIDA
              </button>
            </div>
          </div>
        )}
      </div>

      <MotoBottomNav />
    </div>
  );
}
