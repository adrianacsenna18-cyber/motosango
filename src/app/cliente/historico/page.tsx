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
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-dark p-6 pt-8 shadow-md">
        <h1 className="text-xl font-bold text-white text-center">Histórico de Corridas</h1>
      </header>

      <div className="p-4 flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Carregando...</p>
        ) : corridas.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Nenhuma corrida encontrada.</p>
        ) : (
          <div className="space-y-4">
            {corridas.map((corrida) => (
              <div key={corrida.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {format(new Date(corrida.created_at), "dd/MM/yyyy - HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-sm font-bold text-dark max-w-[200px] truncate">{corrida.destino}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md mt-2 inline-block ${
                    corrida.status === 'concluido' ? 'bg-green-100 text-green-700' :
                    corrida.status === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {corrida.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-dark">R$ {corrida.valor || '10,00'}</p>
                  <p className="text-xs text-gray-500">{corrida.forma_pagamento || 'PIX'}</p>
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