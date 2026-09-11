"use client";

import { useState } from "react";
import { Smartphone, ArrowRight } from "lucide-react";
import InstalarPwaModal from "@/components/site/InstalarPwaModal";

export default function InstalarPwaSection() {
  const [isModalAberto, setIsModalAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalAberto(true)}
        className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FFC400] text-black font-black rounded-full text-base sm:text-lg hover:bg-[#FFD43B] transition-all shadow-xl shadow-[#FFC400]/22 animate-pulseYellow"
      >
        <Smartphone className="w-4 h-4" />
        Como instalar
        <ArrowRight className="w-4 h-4" />
      </button>

      <InstalarPwaModal
        aberto={isModalAberto}
        onClose={() => setIsModalAberto(false)}
      />
    </>
  );
}
