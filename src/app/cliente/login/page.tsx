"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  clearClienteLegacyStorage,
  fetchClienteSession,
  syncClienteLegacyStorage,
} from "@/lib/cliente-session-client";

export default function ClienteLogin() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await fetchClienteSession();

        if (sessionUser) {
          syncClienteLegacyStorage(sessionUser);
          router.push("/cliente/solicitar");
          return;
        }

        clearClienteLegacyStorage();
      } catch {
        clearClienteLegacyStorage();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let cleanTelefone = telefone.replace(/\D/g, "");

    // Remove o 55 inicial caso o usuário tenha digitado
    if (cleanTelefone.startsWith("55") && cleanTelefone.length >= 12) {
      cleanTelefone = cleanTelefone.substring(2);
    }

    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      alert("Informe o telefone com DDD.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cliente/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          telefone,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        throw new Error(data.error || "Erro ao acessar. Tente novamente.");
      }

      syncClienteLegacyStorage(data.user);

      router.push("/cliente/solicitar");
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
        {/* Logo Oficial MotoSango - Tamanho Reduzido e Proporcional */}
        <div className="w-32 h-32 mb-4 flex items-center justify-center relative z-20">
          <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>

        <h1 className="text-3xl font-black text-white italic tracking-tight mb-2 text-center relative z-20">
          Moto<span className="text-primary">Sango</span>
        </h1>
        <p className="text-gray-400 mb-8 text-center text-sm">Faça login ou cadastre-se para continuar</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full items-center">
          <div className="w-full text-center">
            <label className="block text-center text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Primeiro Nome</label>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
              placeholder="Ex: João"
            />
          </div>

          <div className="w-full text-center">
            <label className="block text-center text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Seu Telefone (WhatsApp)</label>
            <input 
              type="tel" 
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
              placeholder="(00) 00000-0000"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 bg-primary text-black font-bold text-center rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wide"
          >
            {loading ? "Acessando..." : "Entrar / Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
