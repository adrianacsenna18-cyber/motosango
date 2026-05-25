"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("login", login)
        .eq("senha", senha);

      if (error || !data || data.length === 0) {
        alert("Credenciais incorretas.");
        setLoading(false);
        return;
      }

      localStorage.setItem("motosango_admin", JSON.stringify(data[0]));
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Erro no login admin:", error);
      alert("Erro ao acessar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col fixed inset-0 z-50 bg-gray-100 p-6 items-center justify-center w-full h-full">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="text-3xl">⚙️</span>
          <h1 className="text-2xl font-bold text-dark">MotoSango Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input 
              type="text" 
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 outline-none focus:border-primary"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-3 bg-dark text-white font-bold text-center rounded-lg shadow-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Acessando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
