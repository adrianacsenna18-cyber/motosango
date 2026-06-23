"use client";
export const dynamic = 'force-dynamic';
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

    let cleanTelefone = formData.telefone.replace(/\D/g, "");

    // Remove o 55 inicial caso o usuário tenha digitado
    if (cleanTelefone.startsWith("55") && cleanTelefone.length >= 12) {
      cleanTelefone = cleanTelefone.substring(2);
    }

    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      alert("Informe o telefone com DDD.");
      setLoading(false);
      return;
    }

    // Formata para o padrão: +55 DD NNNNN-NNNN
    const ddd = cleanTelefone.substring(0, 2);
    const numero = cleanTelefone.substring(2);
    const formattedTelefone = numero.length === 9 
      ? `+55 ${ddd} ${numero.substring(0, 5)}-${numero.substring(5)}`
      : `+55 ${ddd} ${numero.substring(0, 4)}-${numero.substring(4)}`;

    const dataToSubmit = {
      ...formData,
      telefone: formattedTelefone,
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
      <div className="flex flex-col min-h-screen bg-black p-6 text-white items-center justify-center">
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="w-32 h-32 mb-4 flex items-center justify-center relative z-20">
            <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            ✓
          </div>
          <h1 className="text-2xl font-black italic tracking-tight mb-2 text-center text-white">Cadastro Enviado!</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Seus dados foram enviados com sucesso. Aguarde a aprovação do administrador para começar a receber corridas.
          </p>
          <Link 
            href="/mototaxista/login" 
            className="w-full py-4 bg-primary text-black font-bold text-center rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="w-full max-w-sm flex flex-col items-center pb-8">
        
        {/* Logo Oficial MotoSango */}
        <div className="w-24 h-24 mb-4 mt-4 flex items-center justify-center relative z-20">
          <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>

        <div className="bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,208,0,0.3)]">
          Área do Mototaxista
        </div>

        <h1 className="text-2xl font-black text-white italic tracking-tight mb-2 text-center relative z-20">
          Seja um <span className="text-primary">Parceiro</span>
        </h1>
        
        <p className="text-gray-400 mb-8 text-center text-sm">
          Preencha seus dados para se cadastrar.
        </p>

        <form onSubmit={handleCadastro} className="flex flex-col gap-6 w-full">
          
          {/* Seção 1: Dados Pessoais */}
          <div className="space-y-5 bg-[#111111] p-5 rounded-3xl border border-white/5">
            <h2 className="text-primary font-bold text-sm text-center tracking-wider uppercase mb-2">Dados Pessoais</h2>
            
            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Foto 3x4 (Rosto Visível)</label>
              <input 
                type="file" 
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-black hover:file:bg-yellow-400"
              />
              {formData.foto_base64 && (
                <div className="flex justify-center mt-3">
                  <img src={formData.foto_base64} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-primary shadow-[0_0_15px_rgba(255,208,0,0.2)]" />
                </div>
              )}
            </div>

            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Nome Completo</label>
              <input 
                type="text" 
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Telefone (WhatsApp)</label>
              <input 
                type="tel" 
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">CPF</label>
              <input 
                type="text" 
                name="cpf"
                required
                value={formData.cpf}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Seção 2: Dados do Veículo */}
          <div className="space-y-5 bg-[#111111] p-5 rounded-3xl border border-white/5">
            <h2 className="text-primary font-bold text-sm text-center tracking-wider uppercase mb-2">Veículo e Pagamento</h2>
            
            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Modelo da Moto e Ano</label>
              <input 
                type="text" 
                name="modelo_moto"
                required
                value={formData.modelo_moto}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
                placeholder="Ex: Honda CG 160 (2020)"
              />
            </div>

            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Placa</label>
              <input 
                type="text" 
                name="placa"
                required
                value={formData.placa}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm uppercase"
                placeholder="ABC-1234"
              />
            </div>

            <div className="w-full text-center">
              <label className="block text-center text-xs font-medium text-gray-400 mb-2">Chave PIX (Para Receber)</label>
              <input 
                type="text" 
                name="chave_pix"
                required
                value={formData.chave_pix}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] text-white text-center border border-white/10 rounded-2xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors text-sm"
                placeholder="Sua chave PIX"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full py-4 bg-primary text-black font-bold text-center rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wide"
          >
            {loading ? "Enviando..." : "Finalizar Cadastro"}
          </button>
          
          <Link href="/mototaxista/login" className="text-gray-500 text-sm text-center hover:text-primary transition-colors">
            Já é parceiro? <span className="text-white font-bold">Entrar</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
