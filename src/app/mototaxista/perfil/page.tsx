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
      router.push("/mototaxista/login");
    }
  };

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 relative w-full">
      <header className="bg-dark text-white p-6 pt-10 rounded-b-3xl shadow-md">
        <h1 className="font-bold text-2xl mb-6">Meu Perfil</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary">
            {driver.foto_base64 ? (
              <img src={driver.foto_base64} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-xl">{driver.nome}</h2>
            <p className="text-gray-400 text-sm">{driver.telefone}</p>
            <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block">
              ✓ Conta Ativa
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bike size={16} /> Dados do Veículo
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Modelo da Moto</p>
              <p className="font-bold text-dark">{driver.modelo_moto || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Placa</p>
              <p className="font-bold text-dark uppercase">{driver.placa || 'Não informado'}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <CreditCard size={16} /> Dados de Recebimento
          </h3>
          <div>
            <p className="text-xs text-gray-500">Minha Chave PIX</p>
            <p className="font-bold text-dark">{driver.chave_pix || 'Não informado'}</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={16} /> Segurança
          </h3>
          <div>
            <p className="text-xs text-gray-500">CPF</p>
            <p className="font-bold text-dark">***.{driver.cpf?.slice(-6) || '000-00'}</p>
          </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-8"
        >
          <LogOut size={20} /> SAIR DO APLICATIVO
        </button>
      </main>

      <MotoBottomNav />
    </div>
  );
}