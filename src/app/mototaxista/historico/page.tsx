"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HistoricoMoto() {
  const [corridas, setCorridas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-dark p-6 pt-8 shadow-md flex justify-between items-center">
        <button className="text-white">←</button>
        <h1 className="text-xl font-bold text-white">Histórico de Corridas</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex bg-white shadow-sm text-sm font-medium">
        <button className="flex-1 py-3 border-b-2 border-primary text-dark">Todas</button>
        <button className="flex-1 py-3 text-gray-500">Concluídas</button>
        <button className="flex-1 py-3 text-gray-500">Canceladas</button>
      </div>

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
                  <p className="text-sm font-bold text-dark max-w-[200px] truncate">{corrida.origem}</p>
                  <p className="text-sm text-gray-600 max-w-[200px] truncate">Para: {corrida.destino}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-dark">R$ {corrida.valor || '10,00'}</p>
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