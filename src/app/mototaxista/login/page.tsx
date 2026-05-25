"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DriverLogin() {
  const router = useRouter();
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mt-12 mb-2">Acesso Restrito</h1>
      <p className="text-gray-400 mb-8">Informe seus dados cadastrados</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Telefone (WhatsApp)</label>
          <input 
            type="tel" 
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Primeiro Nome</label>
          <input 
            type="text" 
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white"
            placeholder="Seu nome cadastrado"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-6 w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg shadow-sm hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Acessando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
