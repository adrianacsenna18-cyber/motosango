"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User } from "lucide-react";

export function ClienteBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link href="/cliente/solicitar" className={`flex flex-col items-center gap-1 ${pathname.includes('/solicitar') ? 'text-primary' : 'text-gray-400'}`}>
        <Home size={24} className={pathname.includes('/solicitar') ? 'fill-primary text-primary' : ''} />
        <span className="text-[10px] font-medium">Início</span>
      </Link>
      <Link href="/cliente/historico" className={`flex flex-col items-center gap-1 ${pathname.includes('/historico') ? 'text-primary' : 'text-gray-400'}`}>
        <Clock size={24} />
        <span className="text-[10px] font-medium">Histórico</span>
      </Link>
      <Link href="/cliente/perfil" className={`flex flex-col items-center gap-1 ${pathname.includes('/perfil') ? 'text-primary' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-medium">Perfil</span>
      </Link>
    </div>
  );
}