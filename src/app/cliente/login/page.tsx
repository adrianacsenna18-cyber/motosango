"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ClienteLogin() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanTelefone = telefone.replace(/\D/g, "");

    try {
      // Busca se o cliente já existe
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telefone", cleanTelefone);

      if (!data || data.length === 0) {
        // Se não existe, cadastra
        const { data: newUserArray, error: insertError } = await supabase
          .from("users")
          .insert([{ nome, telefone: cleanTelefone }])
          .select();
          
        if (insertError) throw insertError;
        localStorage.setItem("motosango_user", JSON.stringify(newUserArray[0]));
      } else {
        // Se existe, apenas salva na sessão local
        localStorage.setItem("motosango_user", JSON.stringify(data[0]));
      }

      router.push("/cliente/solicitar");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao acessar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-dark mt-12 mb-2">Bem-vindo(a)</h1>
      <p className="text-gray-500 mb-8">Informe seus dados para continuar</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primeiro Nome</label>
          <input 
            type="text" 
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border-gray-300 border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Ex: João"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seu Telefone (WhatsApp)</label>
          <input 
            type="tel" 
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full border-gray-300 border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="(00) 00000-0000"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-6 w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg shadow-sm hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Acessando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
