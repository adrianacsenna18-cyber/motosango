"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Verifica se já existe um admin logado
    const savedAdmin = localStorage.getItem("motosango_admin");
    if (savedAdmin) {
      router.push("/admin/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Credenciais incorretas.");
        setLoading(false);
        return;
      }

      localStorage.setItem("motosango_admin", JSON.stringify(data.user));
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Erro no login admin:", error);
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
    <div className="flex flex-col fixed inset-0 z-50 bg-black p-6 items-center justify-center w-full h-full">
      <div className="w-full max-w-sm bg-[#111111] p-8 rounded-[2rem] shadow-2xl border border-[#222222] flex flex-col items-center">
        <div className="flex flex-col items-center justify-center mb-8 relative z-20 w-full">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tight text-center">
            Moto<span className="text-primary">Sango</span> <span className="text-xs uppercase tracking-widest text-gray-400 not-italic ml-1">Admin</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="text-center">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Login Administrativo</label>
            <input 
              type="text" 
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-[#333333] rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder-gray-600"
              placeholder="Digite o usuário"
            />
          </div>

          <div className="text-center">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Senha de Acesso</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white text-center border border-[#333333] rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full py-4 bg-primary text-black font-black text-center rounded-full text-sm uppercase tracking-wider shadow-[0_10px_20px_rgba(255,208,0,0.15)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Acessando..." : "Entrar no Painel"}
          </button>
        </form>

        <Link href="/" className="mt-8 text-xs text-gray-500 hover:text-white transition-colors block text-center">
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
