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
          
          // If a driver accepted, fetch the driver's info
          if (updatedRide.motorista_id && updatedRide.status === 'aceito') {
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
      <div className="bg-gray-50 p-4 rounded-xl mb-auto text-center border border-gray-200">
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
          <div className="absolute top-0 left-0 right-0 z-20 bg-dark text-white p-4 flex items-center shadow-md">
            <h1 className="font-bold mx-auto">
              {corrida.status === 'concluido' ? 'Pagamento' : 'Corrida em andamento'}
            </h1>
          </div>

          {/* Map Area */}
          <div className="h-[45vh] bg-gray-200 relative">
            <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {corrida.drivers && (
              <div className="absolute top-20 left-4 right-4 bg-white rounded-xl p-4 shadow-lg flex items-center gap-4 z-10">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                  {corrida.drivers.foto_base64 ? <img src={corrida.drivers.foto_base64} alt="Motorista" className="w-full h-full object-cover" /> : '👨‍✈️'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark">{corrida.drivers.nome}</h3>
                  <p className="text-sm text-gray-500">{corrida.drivers.modelo_moto}</p>
                  <p className="text-xs font-bold text-gray-700">{corrida.drivers.placa}</p>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <span>★</span> 4,9
                </div>
              </div>
            )}
            
            {/* Fake Route */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M 50 200 Q 150 100 250 250 T 350 150" fill="none" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" className="drop-shadow-md"/>
              <circle cx="50" cy="200" r="8" fill="#10B981" />
              <circle cx="350" cy="150" r="8" fill="#1F2937" />
            </svg>
          </div>

          {/* Bottom Card */}
          <div className="flex-1 bg-white rounded-t-3xl -mt-6 z-20 relative p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex flex-col">
            
            {corrida.status !== 'concluido' ? (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium">Status</p>
                  <h2 className="text-xl font-bold text-dark mt-1">
                    {corrida.status === 'aceito' ? 'Mototaxista a caminho' : 'Indo para o destino'}
                  </h2>
                  <p className="text-sm text-green-600 font-medium mt-1">Chega em 2 min</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <p className="text-sm text-gray-500 font-medium mb-1">Pagamento</p>
                  <p className="text-2xl font-bold text-dark">R$ {corrida.valor || '10,00'}</p>
                  <p className="text-sm text-gray-600 mt-1 uppercase font-bold">{corrida.forma_pagamento || 'PIX ou Dinheiro'}</p>
                </div>

                {renderPixBox()}

                {(corrida.status === 'aguardando' || corrida.status === 'aceito') && (
                  <button 
                    onClick={cancelarCorrida}
                    className="w-full py-4 mt-6 bg-gray-100 text-dark font-bold text-center rounded-xl text-lg"
                  >
                    CANCELAR CORRIDA
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 font-medium">Total da corrida</p>
                  <h2 className="text-4xl font-bold text-dark mt-2">R$ {corrida.valor || '10,00'}</h2>
                  <p className="text-sm text-gray-600 mt-2 uppercase font-bold">Pagamento via {corrida.forma_pagamento}</p>
                </div>

                {renderPixBox()}

                {isDinheiro && (
                  <div className="bg-gray-50 p-4 rounded-xl mb-6 text-center border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium">
                      💵 Pagamento será realizado em dinheiro diretamente ao mototaxista.
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => router.push("/cliente/solicitar")}
                  className="w-full py-4 mt-auto bg-green-600 text-white font-bold text-center rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 size={24} /> FINALIZAR CORRIDA
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
