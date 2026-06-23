"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Phone, Copy, CheckCircle2 } from "lucide-react";

export default function StatusCorrida({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [corrida, setCorrida] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorrida = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*, drivers(*)")
        .eq("id", params.id);
      
      if (data && data.length > 0) {
        setCorrida(data[0]);
      }
      setLoading(false);
    };

    fetchCorrida();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel(`ride_${params.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rides', filter: `id=eq.${params.id}` },
        async (payload) => {
          const updatedRide = payload.new;
          
          // Se já tem motorista vinculado, sempre busca os dados do motorista
          // Isso garante que a chave PIX e nome apareçam independentemente do status (aceito, a_caminho, etc)
          if (updatedRide.motorista_id) {
            const { data: driverData } = await supabase
              .from('drivers')
              .select('*')
              .eq('id', updatedRide.motorista_id)
              .single();
              
            if (driverData) {
              updatedRide.drivers = driverData;
            }
          }
          
          setCorrida((prev: any) => ({ ...prev, ...updatedRide }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [params.id]);

  const cancelarCorrida = async () => {
    if (!confirm("Deseja realmente cancelar esta corrida?")) return;
    
    await supabase
      .from("rides")
      .update({ status: 'cancelado' })
      .eq("id", params.id);
      
    router.push("/cliente/solicitar");
  };

  if (loading) return <div className="p-6 text-center mt-20">Carregando status...</div>;
  if (!corrida) return <div className="p-6 text-center mt-20">Corrida não encontrada.</div>;

  const isPix = corrida.forma_pagamento === 'pix';
  const isDinheiro = corrida.forma_pagamento === 'dinheiro';

  const copiarPix = () => {
    if (corrida.drivers?.chave_pix) {
      navigator.clipboard.writeText(corrida.drivers.chave_pix);
      alert("Chave PIX copiada!");
    }
  };

  const renderPixBox = () => {
    if (!isPix || corrida.pagamento_confirmado) return null;
    return (
      <div className="bg-white p-4 rounded-2xl mb-4 text-center border border-gray-200 shadow-sm">
        {corrida.drivers?.chave_pix ? (
          <>
            <p className="text-sm text-gray-500 mb-2">Chave PIX de {corrida.drivers?.nome}</p>
            <p className="font-bold text-lg text-dark mb-4">{corrida.drivers?.chave_pix}</p>
            <button onClick={copiarPix} className="w-full py-3 bg-primary text-dark font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
              <Copy size={20} /> COPIAR PIX
            </button>
          </>
        ) : (
          <p className="text-sm text-red-500 font-medium py-2">
            Mototaxista ainda não cadastrou chave PIX
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
      {corrida.status === 'aguardando' && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-dark w-full h-full max-w-md max-h-[800px] rounded-2xl flex flex-col items-center justify-between p-6 mx-auto my-auto relative overflow-hidden shadow-2xl">
              <div className="w-full pt-8 text-center relative z-10">
            <h2 className="text-xl font-bold text-white mb-2">Buscando mototaxista</h2>
          </div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-full h-full border border-gray-700 rounded-full animate-ping opacity-20"></div>
            <div className="absolute w-48 h-48 border border-gray-700 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute w-32 h-32 border border-gray-700 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.4s' }}></div>
            
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-dark text-3xl z-10 shadow-lg shadow-primary/30">
              🏍️
            </div>
          </div>

          <div className="text-center w-full max-w-xs mb-8">
            <p className="text-white text-lg font-medium mb-2">Enviando para mototaxistas próximos...</p>
            <p className="text-gray-400 text-sm">Aguarde, por favor.</p>
          </div>

          {corrida.tipo_corrida === 'especial' && corrida.status_negociacao === 'sugerido' && (
            <div className="bg-white rounded-2xl p-6 mb-8 w-full max-w-sm text-center shadow-2xl relative z-50">
              <p className="text-gray-500 font-medium mb-2">VALOR DA CORRIDA:</p>
              <h3 className="text-4xl font-bold text-dark mb-6">R$ {corrida.valor_sugerido?.toFixed(2).replace('.', ',')}</h3>
              <div className="flex gap-4">
                <button 
                  onClick={async () => {
                    const newRejected = [...(corrida.rejected_by || []), corrida.motorista_id];
                    await supabase.from("rides").update({ 
                      status_negociacao: 'recusado', 
                      motorista_id: null,
                      rejected_by: newRejected 
                    }).eq("id", corrida.id);
                  }}
                  className="flex-1 py-3 border border-red-200 text-red-600 font-bold rounded-xl"
                >
                  RECUSAR
                </button>
                <button 
                  onClick={async () => {
                    await supabase.from("rides").update({
                      status_negociacao: 'aceito',
                      status: 'a_caminho',
                      valor: corrida.valor_sugerido
                    }).eq("id", corrida.id);
                  }}
                  className="flex-1 py-3 bg-primary text-dark font-bold rounded-xl shadow-md"
                >
                  ACEITAR
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={cancelarCorrida}
            className="w-full py-4 bg-transparent border border-gray-600 text-white font-bold text-center rounded-lg text-lg mb-8"
          >
            CANCELAR CORRIDA
          </button>
            </div>
          </div>
      )}

      {corrida.status !== 'aguardando' && (
        <>
          {/* Header */}
          <div className="bg-dark text-white p-4 flex items-center shadow-md shrink-0">
            <h1 className="font-bold mx-auto text-lg tracking-wide uppercase">
              {corrida.status === 'concluido' ? 'Pagamento' : 'Status da Corrida'}
            </h1>
          </div>

          {/* Painel Simples de Status */}
          <div className="flex-1 flex flex-col pt-8 px-6 bg-gray-50 overflow-y-auto pb-6">
            
            {/* Ícone e Status Principal */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <span className="text-5xl">🏍️</span>
              </div>
              <h2 className="text-2xl font-black text-dark text-center">
                {corrida.status === 'aceito' ? 'Mototaxista a caminho' : 
                 corrida.status === 'a_caminho' ? 'Mototaxista chegou' : 
                 corrida.status === 'em_andamento' ? 'Indo para o destino' : 
                 corrida.status === 'concluido' ? 'Corrida finalizada' : 'Corrida em andamento'}
              </h2>
              <p className="text-gray-500 text-sm mt-2 text-center">
                {corrida.status === 'concluido' ? 'Obrigado por viajar com o MotoSango!' : 'Acompanhe as informações abaixo'}
              </p>
            </div>

            {/* Informações do Mototaxista */}
            {corrida.drivers && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-3xl overflow-hidden border-2 border-primary/20 shrink-0">
                  {corrida.drivers.foto_base64 ? <img src={corrida.drivers.foto_base64} alt="Motorista" className="w-full h-full object-cover" /> : '👨‍✈️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-dark truncate">{corrida.drivers.nome}</h3>
                  <p className="text-sm text-gray-500 font-medium truncate">{corrida.drivers.modelo_moto}</p>
                  <p className="text-xs font-black text-gray-700 bg-gray-100 inline-block px-2 py-1 rounded mt-1">{corrida.drivers.placa}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-100 shrink-0">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-bold text-dark text-sm">4,9</span>
                </div>
              </div>
            )}

            {/* Valor e Pagamento */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 font-medium">Valor da corrida</p>
                <p className="text-2xl font-black text-dark">R$ {corrida.valor || '10,00'}</p>
              </div>
              <div className="w-full h-px bg-gray-100 my-1"></div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 font-medium">Forma de pagamento</p>
                <p className="text-sm text-primary font-black uppercase tracking-wider">{corrida.forma_pagamento || 'A COMBINAR'}</p>
              </div>
            </div>

            {/* Caixa do PIX ou Dinheiro */}
            {renderPixBox()}

            {isDinheiro && corrida.status === 'concluido' && (
              <div className="bg-white p-4 rounded-2xl mb-4 text-center border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 font-medium">
                  💵 Pagamento será realizado em dinheiro diretamente ao mototaxista.
                </p>
              </div>
            )}

            {/* Ações / Botões */}
            <div className="mt-auto pt-6">
              {corrida.status === 'concluido' && (
                <button 
                  onClick={() => router.push("/cliente/solicitar")}
                  className="w-full py-4 bg-green-600 text-white font-black text-center rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:bg-green-700 transition-colors uppercase tracking-wider"
                >
                  <CheckCircle2 size={24} /> FINALIZAR
                </button>
              )}
              
              {(corrida.status === 'aguardando' || corrida.status === 'aceito') && (
                <button 
                  onClick={cancelarCorrida}
                  className="w-full py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-center rounded-xl text-lg hover:bg-gray-50 transition-colors"
                >
                  CANCELAR CORRIDA
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
