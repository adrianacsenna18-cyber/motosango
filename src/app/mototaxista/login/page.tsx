"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DriverLogin() {
  const router = useRouter();
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Verifica se já existe um mototaxista logado
    const savedDriver = localStorage.getItem("motosango_driver");
    if (savedDriver) {
      router.push("/mototaxista/painel");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanTelefone = telefone.replace(/\D/g, "");
    const cleanNome = nome.trim();

    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("telefone", cleanTelefone)
        .ilike("nome", `%${cleanNome}%`);

      if (error || !data || data.length === 0) {
        alert("Credenciais incorretas ou mototaxista não encontrado. Verifique se os dados estão corretos.");
        setLoading(false);
        return;
      }

      const driver = data[0];

      if (!driver.aprovado_admin) {
        alert("Seu cadastro ainda está aguardando aprovação do administrador.");
        setLoading(false);
        return;
      }

      localStorage.setItem("motosango_driver", JSON.stringify(driver));
      router.push("/mototaxista/painel");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao acessar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Enquanto verifica o localStorage, mostra uma tela vazia preta para não piscar o formulário
  if (checkingAuth) {
    return <div className="min-h-screen bg-black"></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo Oficial MotoSango */}
        <div className="w-32 h-32 mb-4 flex items-center justify-center relative z-20">
          <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>

        <div className="bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,208,0,0.3)]">
          Área do Mototaxista
        </div>

        <h1 className="text-3xl font-black text-white italic tracking-tight mb-2 text-center relative z-20">
          Moto<span className="text-primary">Sango</span>
        </h1>
        <p className="text-gray-400 mb-8 text-center text-sm">Informe seus dados cadastrados</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full items-center">
          <div className="w-full text-center">
            <label className="block text-center text-sm font-medium text-gray-300 mb-2">Telefone (WhatsApp)</label>
            <input 
              type="tel" 
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="w-full text-center">
            <label className="block text-center text-sm font-medium text-gray-300 mb-2">Primeiro Nome</label>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors"
              placeholder="Seu nome cadastrado"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 bg-primary text-black font-bold text-center rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Acessando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
