"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionamento automático se já estiver logado (funciona como uma Splash Screen)
    if (localStorage.getItem("motosango_driver")) {
      router.push("/mototaxista/painel");
    } else if (localStorage.getItem("motosango_user")) {
      router.push("/cliente/solicitar");
    } else if (localStorage.getItem("motosango_admin")) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 z-10 pt-8 pb-24 bg-gradient-to-b from-[#111111] to-black">
        {/* Logo Oficial MotoSango */}
        <div className="w-48 h-48 -mb-4 flex items-center justify-center relative z-20">
          {/* Requer a imagem 'logo.png' na pasta 'public' */}
          <img src="/logo.png" alt="MotoSango Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        
        <h1 className="text-5xl font-black text-white italic tracking-tight relative z-20">
          Moto<span className="text-primary">Sango</span>
        </h1>
        
        <div className="flex items-center gap-2 mt-2 mb-8">
          <div className="h-[1px] w-8 bg-primary"></div>
          <p className="text-primary text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
            Seu mototáxi na palma da mão
          </p>
          <div className="h-[1px] w-8 bg-primary"></div>
        </div>

        <p className="text-center text-white text-xl font-medium mb-12 max-w-[250px] leading-snug">
          Rápido, seguro e<br />sempre perto de <span className="text-primary">você</span>.
        </p>

        {/* Icons Inferiores */}
        <div className="flex justify-between w-full max-w-xs px-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-primary">
              <Clock size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">Rápido</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-primary">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-primary">
              <MapPin size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">Perto de você</span>
          </div>
        </div>
      </div>

      {/* Fundo Amarelo (Curva Inferior Mockup) & Botões */}
      <div className="w-full bg-primary relative pt-12 pb-8 px-6 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(255,208,0,0.15)] flex flex-col items-center -mt-8 z-20">
        
        <div className="w-full max-w-sm space-y-4 relative z-30">
          <Link 
            href="/cliente/login" 
            className="block w-full py-4 text-center bg-black text-white font-bold rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform"
          >
            Sou Cliente
          </Link>
          
          <Link 
            href="/mototaxista/login" 
            className="block w-full py-4 text-center bg-transparent text-black font-bold rounded-full text-lg border-2 border-black hover:bg-black hover:text-primary transition-all"
          >
            Sou Mototaxista
          </Link>
        </div>

        <div className="mt-6">
          <Link href="/admin/login" className="text-[10px] text-black/70 font-bold hover:text-black transition-colors uppercase tracking-widest">
            Acesso Administrativo
          </Link>
        </div>
      </div>
    </div>
  );
}
