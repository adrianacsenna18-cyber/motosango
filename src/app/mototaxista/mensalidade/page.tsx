"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { Copy } from "lucide-react";

export default function MensalidadeMoto() {
  const [driver, setDriver] = useState<any>(null);
  const [adminPix, setAdminPix] = useState<string>("Carregando...");

  useEffect(() => {
    const driverData = localStorage.getItem("motosango_driver");
    if (driverData) setDriver(JSON.parse(driverData));

    const fetchAdmin = async () => {
      const { data } = await supabase.from("admin").select("pix_admin").limit(1);
      if (data && data.length > 0) setAdminPix(data[0].pix_admin);
    };
    fetchAdmin();
  }, []);

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20">
      <header className="bg-black border-b border-[#1A1A1A] p-6 pt-10 shadow-sm text-center relative">
        <h1 className="text-xl font-bold text-white tracking-wide">Mensalidade</h1>
      </header>

      <div className="p-6 flex-1 flex flex-col items-center justify-center">
        <div className="bg-[#111111] rounded-[2.5rem] p-8 shadow-2xl text-center border border-[#222222] w-full max-w-sm flex flex-col justify-center mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
          
          <h2 className="text-[3.5rem] font-black text-primary mb-4 tracking-tighter drop-shadow-md">R$ {driver.mensalidade_valor || '50,00'}</h2>
          
          <p className="text-gray-400 mb-8 uppercase tracking-widest text-xs font-medium">
            Vencimento: <br/> <span className="font-bold text-white text-sm mt-1 inline-block bg-[#1A1A1A] px-3 py-1 rounded-md border border-[#333333]">
              {driver.vencimento_plano ? new Date(driver.vencimento_plano).toLocaleDateString('pt-BR') : '10/06/2026'}
            </span>
          </p>

          <div className="mb-10 bg-[#0A0A0A] py-4 rounded-3xl border border-[#1A1A1A]">
            <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">Status do Plano</p>
            <span className={`inline-block px-5 py-2 rounded-full font-bold text-xs tracking-wider border ${
              driver.status_plano === 'ativo' ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-red-900/30 text-red-400 border-red-900/50'
            }`}>
              {driver.status_plano === 'ativo' ? 'ATIVO' : 'PENDENTE'}
            </span>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Pagamento via PIX (Admin)</p>
            <p className="font-medium text-base text-gray-300 mb-6 bg-[#1A1A1A] py-3 px-4 rounded-xl border border-[#222222] break-all">{adminPix}</p>
            
            <button className="w-full py-4 bg-primary text-black font-black rounded-full flex items-center justify-center gap-2 mb-4 shadow-[0_10px_20px_rgba(255,208,0,0.15)] hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-wide text-sm">
              <Copy size={18} /> COPIAR PIX DO ADMIN
            </button>
            
            <button className="w-full py-4 bg-[#1A1A1A] border border-[#333333] text-white hover:text-primary hover:border-primary/50 font-bold rounded-full transition-all uppercase tracking-wide text-xs">
              JÁ PAGUEI MENSALIDADE
            </button>
          </div>
        </div>
      </div>

      <MotoBottomNav />
    </div>
  );
}