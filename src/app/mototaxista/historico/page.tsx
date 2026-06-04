"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HistoricoMoto() {
  const [corridas, setCorridas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState<"todas" | "concluido" | "cancelado">("todas");

  useEffect(() => {
    const fetchCorridas = async () => {
      const driverData = localStorage.getItem("motosango_driver");
      if (driverData) {
        const driver = JSON.parse(driverData);
        const { data } = await supabase
          .from("rides")
          .select("*")
          .eq("motorista_id", driver.id)
          .order("created_at", { ascending: false });
        if (data) setCorridas(data);
      }
      setLoading(false);
    };
    fetchCorridas();
  }, []);

  const corridasFiltradas = corridas.filter((corrida) => {
    if (filtroAtual === "todas") return true;
    if (filtroAtual === "concluido") return corrida.status === "concluido" || corrida.status === "concluída" || corrida.status === "concluído";
    if (filtroAtual === "cancelado") return corrida.status === "cancelado" || corrida.status === "cancelada";
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20">
      <header className="bg-[#0A0A0A] p-6 pt-8 border-b border-[#222] flex justify-between items-center">
        <button className="text-white hover:text-[#FFD000] transition-colors">←</button>
        <h1 className="text-xl font-bold text-white">Histórico de Corridas</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex bg-[#111111] border-b border-[#222] text-sm font-medium">
        <button 
          onClick={() => setFiltroAtual("todas")}
          className={`flex-1 py-3 transition-colors ${filtroAtual === "todas" ? "border-b-2 border-[#FFD000] text-[#FFD000]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Todas
        </button>
        <button 
          onClick={() => setFiltroAtual("concluido")}
          className={`flex-1 py-3 transition-colors ${filtroAtual === "concluido" ? "border-b-2 border-[#FFD000] text-[#FFD000]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Concluídas
        </button>
        <button 
          onClick={() => setFiltroAtual("cancelado")}
          className={`flex-1 py-3 transition-colors ${filtroAtual === "cancelado" ? "border-b-2 border-[#FFD000] text-[#FFD000]" : "text-gray-500 hover:text-gray-300"}`}
        >
          Canceladas
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Carregando...</p>
        ) : corridasFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Nenhuma corrida encontrada.</p>
        ) : (
          <div className="space-y-4">
            {corridasFiltradas.map((corrida) => (
              <div key={corrida.id} className="bg-[#1A1A1A] p-4 rounded-3xl border border-[#222] flex justify-between items-center hover:border-[#333] transition-colors">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {format(new Date(corrida.created_at), "dd/MM/yyyy - HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-sm font-bold text-white max-w-[200px] truncate">{corrida.origem}</p>
                  <p className="text-sm text-gray-400 max-w-[200px] truncate">Para: {corrida.destino}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#FFD000]">R$ {corrida.valor || '10,00'}</p>
                  <p className="text-xs text-gray-500">{corrida.forma_pagamento || 'Dinheiro'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MotoBottomNav />
    </div>
  );
}
