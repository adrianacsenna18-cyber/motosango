"use client";

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
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="bg-dark p-6 pt-8 shadow-md text-center">
        <h1 className="text-xl font-bold text-white">Mensalidade</h1>
      </header>

      <div className="p-6 flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center border border-gray-100 w-full max-w-sm flex flex-col justify-center mx-auto">
          <h2 className="text-5xl font-bold text-dark mb-4">R$ {driver.mensalidade_valor || '50,00'}</h2>
          
          <p className="text-gray-500 mb-6">
            Vencimento: <span className="font-bold text-dark">
              {driver.vencimento_plano ? new Date(driver.vencimento_plano).toLocaleDateString('pt-BR') : '10/06/2026'}
            </span>
          </p>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
              driver.status_plano === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {driver.status_plano === 'ativo' ? 'ATIVO' : 'PENDENTE'}
            </span>
          </div>

          <div className="mt-auto">
            <p className="text-sm text-gray-500 mb-2">Pagamento via PIX (Admin)</p>
            <p className="font-bold text-lg text-dark mb-4">{adminPix}</p>
            
            <button className="w-full py-4 bg-primary text-dark font-bold rounded-xl flex items-center justify-center gap-2 mb-4 shadow-md">
              <Copy size={20} /> COPIAR PIX DO ADMIN
            </button>
            
            <button className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-md">
              JÁ PAGUEI MENSALIDADE
            </button>
          </div>
        </div>
      </div>

      <MotoBottomNav />
    </div>
  );
}