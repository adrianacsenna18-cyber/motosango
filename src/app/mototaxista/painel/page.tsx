"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { Navigation, CheckCircle2, XCircle, Copy, Bell } from "lucide-react";

const AddressDisplay = ({ address }: { address: string }) => {
  const [readable, setReadable] = useState<string>('');
  const [coords, setCoords] = useState<{lat: string, lng: string} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) return;
    if (address.includes('Lat:') && address.includes('Lng:')) {
      setIsLoading(true);
      // Extrair números ignorando formatação exata (pega qualquer sequência de números, ponto e sinal de menos após Lat e Lng)
      const latMatch = address.match(/Lat:\s*([-\d.]+)/);
      const lngMatch = address.match(/Lng:\s*([-\d.]+)/);
      
      if (latMatch && lngMatch) {
        setCoords({ lat: latMatch[1], lng: lngMatch[1] });
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latMatch[1]}&lon=${lngMatch[1]}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
              const { road, house_number, suburb, city, town, village } = data.address;
              const cityName = city || town || village || '';
              const parts = [];
              if (road) parts.push(house_number ? `${road}, ${house_number}` : road);
              if (suburb) parts.push(suburb);
              if (cityName) parts.push(cityName);
              setReadable(parts.join(', '));
            } else {
              setReadable('Localização recebida pelo GPS');
            }
          })
          .catch(() => setReadable('Localização recebida pelo GPS'))
          .finally(() => setIsLoading(false));
      } else {
         setReadable('Localização recebida pelo GPS');
         setIsLoading(false);
      }
    }
  }, [address]);

  if (!address) return null;

  if (address.includes('Lat:') && address.includes('Lng:')) {
    return (
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold">📍 Localização do cliente:</span>
          <span className="font-bold text-dark text-sm leading-snug">
            {isLoading ? 'Buscando endereço...' : (readable || 'Localização recebida pelo GPS')}
          </span>
        </div>
        {coords && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-black w-fit shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <span className="text-lg">🗺️</span> Abrir rota
          </a>
        )}
      </div>
    );
  }

  return <span className="font-bold text-dark text-lg">{address}</span>;
};

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
  const [pushStatus, setPushStatus] = useState<string>(''); // '' | 'saving' | 'saved' | 'error'
  
  // Referência persistente para o áudio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Inicializa o áudio apenas no cliente
  useEffect(() => {
    audioRef.current = new Audio('/beep.mp3');
    audioRef.current.loop = true;
  }, []);

  // Use refs to avoid stale closures in realtime subscriptions
  const isOnlineRef = useRef(isOnline);
  const corridaAtivaRef = useRef(corridaAtiva);
  
  // Ref para guardar corridas recusadas localmente nesta sessão (evita que voltem antes do Supabase sincronizar)
  const localRejectedRidesRef = useRef<Set<string>>(new Set());
  
  // Ref para a função de recusa, evitando dependências no useEffect e stale closures
  const recusarCorridaRef = useRef<any>(null);

  useEffect(() => {
    isOnlineRef.current = isOnline;
    corridaAtivaRef.current = corridaAtiva;
  }, [isOnline, corridaAtiva]);

  // Efeito de Timeout da Nova Corrida (25 segundos)
  useEffect(() => {
    if (novaCorrida && !corridaAtiva && (novaCorrida.status_negociacao === 'nenhuma' || novaCorrida.status_negociacao === 'recusado')) {
      clearTimeout(window.currentTimeout);
      const id = novaCorrida.id;
      window.currentTimeout = setTimeout(() => {
        if (recusarCorridaRef.current) {
          recusarCorridaRef.current(id);
        }
      }, 25000);
    }
    return () => {
      clearTimeout(window.currentTimeout);
    };
  }, [novaCorrida, corridaAtiva, isOnline]);

  // Efeito de Áudio e Vibração em Loop
  useEffect(() => {
    let vibrateInterval: any = null;

    if (novaCorrida && !corridaAtiva) {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.loop = true;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Audio autoplay prevented:', e));
          }
        } catch (e) {
          console.log('Audio error:', e);
        }
      }

      if ('vibrate' in navigator) {
        vibrateInterval = setInterval(() => {
          try { navigator.vibrate([200, 100, 200]); } catch (e) {}
        }, 2000);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (vibrateInterval) {
        clearInterval(vibrateInterval);
      }
    };
  }, [novaCorrida, corridaAtiva]);

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
        if (localRejectedRidesRef.current.has(c.id)) return false;
        const hasRejected = c.rejected_by && c.rejected_by.includes(driver?.id);
        const isReservedToAnother = c.motorista_id && c.motorista_id !== driver?.id && c.status_negociacao === 'sugerido';
        return !hasRejected && !isReservedToAnother;
      });
      
      if (corridaValida) {
        setNovaCorrida(corridaValida);
        setValorProposto("");
        setIsNegociando(false);
      } else {
        setNovaCorrida(null);
        clearTimeout(window.currentTimeout);
      }
    } else {
      setNovaCorrida(null);
      clearTimeout(window.currentTimeout);
    }
  };

  // UseEffect separado para checar corridas só se estiver online
  useEffect(() => {
    if (isOnline) {
      checkCorridasPendentes();
    }
  }, [isOnline]);

  useEffect(() => {
    const driverData = localStorage.getItem("motosango_driver");
    if (!driverData) {
      router.push("/mototaxista/login");
      return;
    }
    
    const parsedDriver = JSON.parse(driverData);
    setDriver(parsedDriver);

    // FORÇAR OFFLINE NO INÍCIO:
    // O app sempre começa offline para obrigar o clique do usuário (desbloqueando áudio/push/gps no iOS)
    setIsOnline(false);
    parsedDriver.status_online = false;
    localStorage.setItem('motosango_driver', JSON.stringify(parsedDriver));
    
    // Atualiza no banco em background silenciosamente
    supabase.from('drivers')
      .update({ status_online: false })
      .eq('id', parsedDriver.id)
      .then(({ error }) => {
        if (error) console.error("Erro ao forçar offline no banco:", error);
      });
    
    checkCorridaAtiva(parsedDriver.id);
    fetchConfig();

    // Subscribe to new rides
    const ridesSub = supabase
      .channel('public:rides')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rides' },
        (payload) => {
          if (payload.new.status === 'aguardando' && isOnlineRef.current && !corridaAtivaRef.current) {
            // Se eu já recusei esta corrida nesta sessão localmente, ignora o evento
            if (localRejectedRidesRef.current.has(payload.new.id)) return;
            
            // Verificar se foi eu que rejeitei (provavelmente não pois é insert, mas por garantia)
            setNovaCorrida(payload.new);
            setValorProposto("");
            setIsNegociando(false);
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

    // Listener para Visibility Change (App acordando do background)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[PAINEL] App voltou ao foco, verificando corridas pendentes");
        if (isOnlineRef.current) {
          checkCorridasPendentes();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      supabase.removeChannel(ridesSub);
      supabase.removeChannel(ridesUpdateSub);
      supabase.removeChannel(driverUpdateSub);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

    // Tocar bip audível no clique para desbloquear áudio no iOS
    if (newState && audioRef.current) {
      try {
        audioRef.current.volume = 0.5; // Volume moderado
        const unlockPromise = audioRef.current.play();
        if (unlockPromise !== undefined) {
          unlockPromise.then(() => {
            console.log("[AUDIO] Bip de confirmação Online tocando");
            // Deixa tocar por 500ms e depois pausa
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1.0; // Restaura volume para quando a corrida chegar
              }
            }, 500);
          }).catch((err) => {
            console.error("[AUDIO] iPhone ainda bloqueou o áudio:", err);
          });
        }
      } catch (err) {
        console.error("[AUDIO] Falha ao preparar áudio:", err);
      }
    }
    
    if (newState) {
      // Quando fica online, não precisamos chamar checkCorridasPendentes aqui
      // pois o useEffect([isOnline]) já fará isso automaticamente.
      // alert("Ficou online! Aguardando corridas...");
    } else {
      setNovaCorrida(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
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
    
    // Bloquear a corrida localmente IMEDIATAMENTE para evitar que ela volte em caso de atraso da rede
    localRejectedRidesRef.current.add(corridaId);
    
    // Backup do array atual antes de limpar o estado
    const currentRejected = novaCorrida?.rejected_by || [];
    
    // Otimista: limpar da tela IMEDIATAMENTE
    setNovaCorrida(null);
    setIsNegociando(false);
    
    try {
      await supabase
        .from("rides")
        .update({ rejected_by: [...currentRejected, driver.id] })
        .eq("id", corridaId);
    } catch (e) {
      console.error("Erro ao recusar corrida:", e);
    }
      
    checkCorridasPendentes(); // Buscar a próxima (já vai ignorar pela ref)
  };

  useEffect(() => {
    recusarCorridaRef.current = recusarCorrida;
  });

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

  const urlBase64ToUint8Array = (base64String: string) => {
    let base64 = base64String.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    base64 = base64 + padding;
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const ativarNotificacoesPush = async () => {
    alert("1 - Clique no sino iniciou");
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Seu navegador não suporta notificações em segundo plano.");
      return;
    }

    try {
      setPushStatus('saving');
      const permission = await Notification.requestPermission();
      alert("2 - Permissão: " + permission);
      
      if (permission !== 'granted') {
        setPushStatus('');
        alert("Você precisa permitir as notificações para receber alertas com a tela apagada.");
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      alert("3 - Service Worker registrado");
      
      await navigator.serviceWorker.ready;
      alert("4 - Service Worker ready");
      
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      alert("5 - VAPID existe: " + (vapidPublicKey ? "sim" : "não"));
      
      if (!vapidPublicKey) {
        console.error("VAPID Key ausente");
        setPushStatus('error');
        return;
      }

      alert("6 - Verificando inscrição antiga...");
      let subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        alert("Inscrição existente encontrada, reutilizando");
      } else {
        alert("Nenhuma inscrição encontrada, criando nova");
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
        alert("7 - PushSubscription criada");
      }

      alert("8 - Antes do fetch");
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: driver.id,
          subscription
        })
      });

      alert("9 - Status API: " + response.status);

      if (response.ok) {
        setPushStatus('saved');
        alert("10 - Salvo com sucesso");
      } else {
        setPushStatus('error');
      }
    } catch (error: any) {
      alert("ERRO: " + (error.message || error));
      console.error("Erro ao ativar push:", error);
      setPushStatus('error');
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
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
            {pushStatus !== 'saved' && (
              <button
                onClick={ativarNotificacoesPush}
                disabled={pushStatus === 'saving'}
                className="mr-2 text-gray-400 hover:text-white transition-colors"
                title="Ativar alertas com tela apagada"
              >
                <Bell size={16} className={pushStatus === 'saving' ? 'animate-pulse' : ''} />
              </button>
            )}
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gray-500'}`}></div>
            <span className="text-sm font-bold text-white">{isOnline ? 'Online' : 'Offline'}</span>
            <button 
              onClick={toggleOnline}
              className={`ml-2 w-12 h-6 rounded-full relative transition-colors ${isOnline ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
          {!isOnline && (
            <span className="text-[10px] text-gray-400 mr-2">Toque em ONLINE para receber corridas</span>
          )}
        </div>
      </header>

      {/* Modal Mensalidade */}
      {showMensalidade && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-[2.5rem] p-8 shadow-2xl text-center border border-[#222222] w-full max-w-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
            
            <button onClick={() => setShowMensalidade(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-gray-400 rounded-full hover:bg-[#333] transition-colors border border-[#333]">
              ✕
            </button>

            <h2 className="text-[3.5rem] font-black text-primary mb-4 tracking-tighter drop-shadow-md mt-4">R$ {configMensalidade.valor}</h2>
            
            <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs font-medium">
              Vencimento: <br/> <span className="font-bold text-white text-sm mt-1 inline-block bg-[#1A1A1A] px-3 py-1 rounded-md border border-[#333333]">
                {driver.vencimento_mensalidade ? new Date(driver.vencimento_mensalidade).toLocaleDateString() : 'Não definido'}
              </span>
            </p>

            <div className="mb-10 bg-[#0A0A0A] py-4 rounded-3xl border border-[#1A1A1A]">
              <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Status do Plano</p>
              <span className={`inline-block px-5 py-2 rounded-full font-bold text-xs tracking-wider border ${
                driver.bloqueado_mensalidade || driver.status_plano === 'vencido' 
                  ? 'bg-red-900/30 text-red-400 border-red-800/50' 
                  : driver.pagamento_em_analise 
                    ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50' 
                    : 'bg-green-900/30 text-green-400 border-green-800/50'
              }`}>
                {driver.bloqueado_mensalidade || driver.status_plano === 'vencido' 
                  ? 'VENCIDO' 
                  : driver.pagamento_em_analise 
                    ? 'EM ANÁLISE' 
                    : 'PAGO / ATIVO'}
              </span>
            </div>

            <div className="mt-auto">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">PIX do Administrador</p>
              <p className="font-medium text-base text-gray-300 mb-6 bg-[#1A1A1A] py-3 px-4 rounded-xl border border-[#222222] break-all">{configMensalidade.pix}</p>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(configMensalidade.pix);
                  alert("PIX copiado!");
                }}
                className="w-full py-4 bg-primary text-black font-black rounded-full flex items-center justify-center gap-2 mb-4 shadow-[0_10px_20px_rgba(255,208,0,0.15)] hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-wide text-sm"
              >
                <Copy size={18} /> COPIAR PIX DO ADMIN
              </button>
              
              <button 
                onClick={informarPagamentoMensalidade}
                disabled={driver.pagamento_em_analise}
                className={`w-full py-4 font-bold rounded-full transition-all uppercase tracking-wide text-xs border ${
                  driver.pagamento_em_analise 
                    ? 'bg-yellow-600/50 text-white opacity-50 cursor-not-allowed border-transparent' 
                    : 'bg-[#1A1A1A] border-[#333333] text-white hover:text-primary hover:border-primary/50'
                }`}
              >
                {driver.pagamento_em_analise ? 'JÁ AVISADO' : 'JÁ PAGUEI MENSALIDADE'}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-flash-bg">
            <div className="bg-white w-full h-auto max-h-[90vh] max-w-md rounded-3xl p-6 flex flex-col animate-shake-violent animate-neon-pulse overflow-y-auto mx-auto my-auto shadow-2xl">
              <div className="text-center mb-6 mt-2">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-ping shadow-[0_0_30px_rgba(255,204,0,1)] mx-auto">
                    <span className="text-4xl">🔔</span>
                  </div>
                  <div className="bg-red-600 text-white px-4 py-3 rounded-2xl font-black text-xl animate-bounce shadow-[0_0_30px_rgba(220,38,38,0.8)] w-full text-center uppercase tracking-wider mx-auto">
                    Nova Corrida!
                  </div>
                  
                  <p className="text-sm font-bold text-gray-600 mt-2 px-2 text-center">
                    ⏳ Você tem 25 segundos para aceitar esta corrida. Após esse prazo, ela será encaminhada automaticamente ao mototaxista mais próximo.
                  </p>

                  {novaCorrida.tipo_corrida === 'especial' && (
                    <div className="bg-purple-600 text-white text-md font-black px-6 py-2 rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.6)] w-full mx-auto mt-2">
                      ⚠️ CORRIDA ESPECIAL
                    </div>
                  )}
                </div>
              </div>
            
              <div className="space-y-4 mb-auto">
              <div className="flex gap-4 items-start">
                <div className="w-4 h-4 rounded-full bg-green-500 mt-1 shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Origem</p>
                  <AddressDisplay address={novaCorrida.origem} />
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-sm"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Destino</p>
                  <AddressDisplay address={novaCorrida.destino} />
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
                    className="py-4 px-6 bg-primary text-dark font-black text-xl rounded-xl shadow-[0_0_30px_rgba(255,204,0,0.8)] flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition-transform animate-pulse-fast"
                  >
                    <CheckCircle2 size={24} /> ENVIAR
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-auto pt-4">
              {novaCorrida.status_negociacao !== 'sugerido' && novaCorrida.tipo_corrida !== 'especial' && (
                <button 
                  onClick={() => aceitarCorrida(novaCorrida.id)}
                  className="w-full py-8 bg-primary text-dark font-black text-3xl rounded-2xl shadow-[0_0_40px_rgba(255,204,0,0.8)] flex items-center justify-center gap-3 animate-pulse-fast active:scale-95 transition-transform"
                >
                  <CheckCircle2 size={32} /> ACEITAR
                </button>
              )}
              <button 
                onClick={() => recusarCorrida(novaCorrida.id)}
                className="w-full py-5 bg-red-100 text-red-600 font-bold text-xl rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <XCircle size={24} /> RECUSAR
              </button>
            </div>
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
                  <AddressDisplay address={corridaAtiva.origem} />
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Destino</p>
                  <AddressDisplay address={corridaAtiva.destino} />
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
