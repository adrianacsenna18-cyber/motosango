"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClienteBottomNav } from "@/components/layout/ClienteBottomNav";
import { LogOut, User, Phone } from "lucide-react";

export default function PerfilCliente() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("motosango_user");
    if (!userData) {
      router.push("/cliente/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    if (confirm("Deseja realmente sair do aplicativo?")) {
      localStorage.removeItem("motosango_user");
      router.push("/");
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20 relative w-full">
      <header className="bg-[#0A0A0A] text-white p-6 pt-10 rounded-b-[2.5rem] shadow-lg border-b border-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <h1 className="font-bold text-2xl mb-8 tracking-wide">Meu Perfil</h1>
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center overflow-hidden border-2 border-primary shadow-[0_0_15px_rgba(255,208,0,0.2)]">
            <User size={32} className="text-gray-500" />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-tight">{user.nome}</h2>
            <div className="bg-green-900/30 text-green-400 border border-green-900/50 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mt-2 inline-block">
              ✓ Cliente Sango
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-5 mt-2">
        <section className="bg-[#111111] rounded-3xl p-6 shadow-sm border border-[#222222]">
          <h3 className="font-bold text-primary text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
            <User size={18} /> Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Nome Completo</p>
              <p className="font-bold text-white text-base">{user.nome}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Telefone (WhatsApp)</p>
              <div className="flex items-center gap-2 bg-[#1A1A1A] inline-flex px-3 py-1.5 rounded-lg border border-[#333333] mt-1">
                <Phone size={14} className="text-gray-400" />
                <p className="font-bold text-white text-base tracking-wider">{user.telefone}</p>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-red-900/20 text-red-500 border border-red-900/50 font-bold rounded-full flex items-center justify-center gap-2 hover:bg-red-900/40 hover:text-red-400 transition-all mt-8 uppercase tracking-wider text-sm"
        >
          <LogOut size={18} /> SAIR DA CONTA
        </button>
      </main>

      <ClienteBottomNav />
    </div>
  );
}