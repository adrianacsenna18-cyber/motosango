"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DriverCadastro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    modelo_moto: "",
    placa: "",
    chave_pix: "",
    foto_base64: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto_base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      telefone: formData.telefone.replace(/\D/g, ""),
      cpf: formData.cpf.replace(/\D/g, "")
    };

    try {
      const { error } = await supabase
        .from("drivers")
        .insert([dataToSubmit]);

      if (error) {
        if (error.code === '23505') {
          alert("Este CPF ou Telefone já está cadastrado.");
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      setSucesso(true);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao realizar cadastro. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 p-6 text-white items-center justify-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Cadastro Enviado!</h1>
        <p className="text-gray-400 text-center mb-8">
          Seus dados foram enviados com sucesso. Aguarde a aprovação do administrador para começar a receber corridas.
        </p>
        <Link 
          href="/mototaxista/login" 
          className="w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg hover:bg-yellow-400"
        >
          Ir para o Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-6 text-white">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/mototaxista" className="text-gray-400 hover:text-white">
          ← Voltar
        </Link>
        <h1 className="text-xl font-bold">Cadastro de Mototaxista</h1>
      </header>

      <p className="text-gray-400 mb-6 text-sm">
        Preencha seus dados para se cadastrar como mototaxista na plataforma MotoSango.
      </p>

      <form onSubmit={handleCadastro} className="flex flex-col gap-5 pb-8">
        <div className="space-y-4">
          <h2 className="text-primary font-semibold text-sm border-b border-gray-800 pb-2">Dados Pessoais</h2>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Foto 3x4 (Rosto Visível)</label>
            <input 
              type="file" 
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
            />
            {formData.foto_base64 && (
              <img src={formData.foto_base64} alt="Preview" className="mt-2 w-20 h-24 object-cover rounded-md border border-gray-600" />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Nome Completo</label>
            <input 
              type="text" 
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
              placeholder="João da Silva"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Telefone (WhatsApp)</label>
            <input 
              type="tel" 
              name="telefone"
              required
              value={formData.telefone}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">CPF</label>
            <input 
              type="text" 
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <div className="space-y-4 mt-2">
          <h2 className="text-primary font-semibold text-sm border-b border-gray-800 pb-2">Dados do Veículo e Pagamento</h2>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Modelo da Moto e Ano</label>
            <input 
              type="text" 
              name="modelo_moto"
              required
              value={formData.modelo_moto}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
              placeholder="Ex: Honda CG 160 (2020)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Placa</label>
            <input 
              type="text" 
              name="placa"
              required
              value={formData.placa}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm uppercase"
              placeholder="ABC-1234"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Chave PIX (Para receber dos clientes)</label>
            <input 
              type="text" 
              name="chave_pix"
              required
              value={formData.chave_pix}
              onChange={handleChange}
              className="w-full bg-gray-800 border-gray-700 border rounded-lg p-3 outline-none focus:border-primary text-white text-sm"
              placeholder="Sua chave PIX"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg shadow-sm hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "ENVIAR CADASTRO"}
        </button>
      </form>
    </div>
  );
}
