"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";

export default function FinanceiroMoto() {
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const driverData = localStorage.getItem("motosango_driver");
    if (driverData) setDriver(JSON.parse(driverData));
  }, []);

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-dark p-6 pt-8 shadow-md text-center">
        <h1 className="text-xl font-bold text-white">Meus Ganhos</h1>
      </header>

      <div className="p-6">
        <div className="bg-primary text-dark rounded-2xl p-6 shadow-lg mb-6">
          <p className="text-sm font-medium mb-1">Ganhos de Hoje</p>
          <h2 className="text-4xl font-bold">R$ 120,00</h2>
          <p className="text-xs mt-2 opacity-80">12 corridas finalizadas</p>
        </div>

        <h3 className="font-bold text-dark text-lg mb-4">Resumo da Semana</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
            <span className="text-gray-600 font-medium">Segunda</span>
            <span className="font-bold text-dark">R$ 80,00</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
            <span className="text-gray-600 font-medium">Terça</span>
            <span className="font-bold text-dark">R$ 95,00</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100 border-l-4 border-l-primary">
            <span className="text-dark font-bold">Quarta (Hoje)</span>
            <span className="font-bold text-dark">R$ 120,00</span>
          </div>
        </div>
      </div>

      <MotoBottomNav />
    </div>
  );
}