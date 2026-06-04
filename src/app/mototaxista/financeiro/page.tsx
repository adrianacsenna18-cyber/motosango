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
    <div className="flex flex-col min-h-screen bg-black pb-20">
      <header className="bg-black border-b border-[#1A1A1A] p-6 pt-10 shadow-sm relative text-center">
        <h1 className="text-xl font-bold text-white tracking-wide">Meus Ganhos</h1>
      </header>

      <div className="p-6">
        <div className="bg-primary text-black rounded-[2rem] p-8 shadow-[0_15px_30px_rgba(255,208,0,0.15)] mb-8 border border-yellow-400/50">
          <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90">Ganhos de Hoje</p>
          <h2 className="text-5xl font-black tracking-tighter">R$ 120,00</h2>
          <p className="text-sm mt-3 font-medium opacity-80">12 corridas finalizadas</p>
        </div>

        <h3 className="font-black text-white text-xl mb-5 tracking-wide">Resumo da Semana</h3>
        <div className="space-y-4">
          <div className="bg-[#111111] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-[#222222]">
            <span className="text-gray-400 font-medium">Segunda</span>
            <span className="font-bold text-white text-lg">R$ 80,00</span>
          </div>
          <div className="bg-[#111111] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-[#222222]">
            <span className="text-gray-400 font-medium">Terça</span>
            <span className="font-bold text-white text-lg">R$ 95,00</span>
          </div>
          <div className="bg-[#1A1A1A] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-primary/30 border-l-4 border-l-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <span className="text-white font-bold relative z-10">Quarta (Hoje)</span>
            <span className="font-black text-primary text-xl relative z-10">R$ 120,00</span>
          </div>
        </div>
      </div>

      <MotoBottomNav />
    </div>
  );
}