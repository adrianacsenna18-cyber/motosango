"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClienteBottomNav } from "@/components/layout/ClienteBottomNav";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HistoricoCliente() {
  const [corridas, setCorridas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorridas = async () => {
      const userData = localStorage.getItem("motosango_user");
      if (userData) {
        const user = JSON.parse(userData);
        const { data } = await supabase
          .from("rides")
          .select("*")
          .eq("cliente_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setCorridas(data);
      }
      setLoading(false);
    };
    fetchCorridas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20">
      <header className="bg-black border-b border-[#1A1A1A] p-6 pt-10 shadow-sm relative">
        <h1 className="text-xl font-bold text-white text-center tracking-wide">Histórico de Corridas</h1>
      </header>

      <div className="p-5 flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400 mt-10 animate-pulse">Carregando...</p>
        ) : corridas.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Nenhuma corrida encontrada.</p>
        ) : (
          <div className="space-y-5">
            {corridas.map((corrida) => (
              <div key={corrida.id} className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-[#222222] flex justify-between items-center transition-all hover:border-[#333333]">
                <div className="flex-1 pr-2">
                  <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">
                    {format(new Date(corrida.created_at), "dd/MM/yyyy - HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-base font-medium text-white max-w-[200px] truncate leading-tight">{corrida.destino}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md mt-2.5 inline-block tracking-wider ${
                    corrida.status === 'concluido' ? 'bg-green-900/40 text-green-400 border border-green-900/50' :
                    corrida.status === 'cancelado' ? 'bg-red-900/40 text-red-400 border border-red-900/50' : 'bg-yellow-900/40 text-primary border border-yellow-900/50'
                  }`}>
                    {corrida.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-[#222222]">
                  <p className="font-bold text-xl text-primary mb-1">R$ {corrida.valor || '10,00'}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium bg-[#1A1A1A] inline-block px-2 py-1 rounded-md">{corrida.forma_pagamento || 'PIX'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClienteBottomNav />
    </div>
  );
}