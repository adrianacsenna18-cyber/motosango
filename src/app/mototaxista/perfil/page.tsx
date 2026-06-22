"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import { LogOut, User, Bike, CreditCard, ShieldCheck } from "lucide-react";

export default function PerfilMototaxista() {
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    const driverData = localStorage.getItem("motosango_driver");
    if (!driverData) {
      router.push("/mototaxista/login");
      return;
    }
    setDriver(JSON.parse(driverData));
  }, [router]);

  const handleLogout = () => {
    if (confirm("Deseja realmente sair do aplicativo?")) {
      localStorage.removeItem("motosango_driver");
      router.push("/");
    }
  };

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20 relative w-full">
      <header className="bg-[#0A0A0A] text-white p-6 pt-10 rounded-b-[2.5rem] shadow-lg border-b border-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <h1 className="font-bold text-2xl mb-8 tracking-wide">Meu Perfil</h1>
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center overflow-hidden border-2 border-primary shadow-[0_0_15px_rgba(255,208,0,0.2)]">
            {driver.foto_base64 ? (
              <img src={driver.foto_base64} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-500" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-tight">{driver.nome}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{driver.telefone}</p>
            <div className="bg-green-900/30 text-green-400 border border-green-900/50 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mt-3 inline-block">
              ✓ Conta Ativa
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-5 mt-2">
        <section className="bg-[#111111] rounded-3xl p-6 shadow-sm border border-[#222222]">
          <h3 className="font-bold text-primary text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
            <Bike size={18} /> Dados do Veículo
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Modelo da Moto</p>
              <p className="font-bold text-white text-base">{driver.modelo_moto || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Placa</p>
              <p className="font-bold text-white text-base uppercase bg-[#1A1A1A] inline-block px-3 py-1.5 rounded-lg border border-[#333333] mt-1">{driver.placa || 'Não informado'}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] rounded-3xl p-6 shadow-sm border border-[#222222]">
          <h3 className="font-bold text-primary text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
            <CreditCard size={18} /> Dados de Recebimento
          </h3>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Minha Chave PIX</p>
            <p className="font-medium text-gray-200 bg-[#1A1A1A] p-3 rounded-xl border border-[#333333] break-all">{driver.chave_pix || 'Não informado'}</p>
          </div>
        </section>

        <section className="bg-[#111111] rounded-3xl p-6 shadow-sm border border-[#222222]">
          <h3 className="font-bold text-primary text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
            <ShieldCheck size={18} /> Segurança
          </h3>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">CPF</p>
            <p className="font-bold text-white text-base tracking-widest">***.{driver.cpf?.slice(-6) || '000-00'}</p>
          </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-red-900/20 text-red-500 border border-red-900/50 font-bold rounded-full flex items-center justify-center gap-2 hover:bg-red-900/40 hover:text-red-400 transition-all mt-8 uppercase tracking-wider text-sm"
        >
          <LogOut size={18} /> SAIR DO APLICATIVO
        </button>
      </main>

      <MotoBottomNav />
    </div>
  );
}