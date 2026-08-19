"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MotoBottomNav } from "@/components/layout/MotoBottomNav";
import {
  clearMotoLegacyStorage,
  fetchMotoSession,
  syncMotoLegacyStorage,
} from "@/lib/moto-session-client";

type RideSummaryRecord = {
  id: string;
  ride_id: string;
  driver_id: string;
  financial_event_type: string;
  payment_method: string;
  commission_rate_applied: string;
  gross_ride_amount: number;
  platform_commission_amount: number;
  economic_net_amount: number;
  driver_direct_receipt_amount: number;
  driver_owes_platform_amount: number;
  platform_owes_driver_amount: number;
  payment_status: string;
  settlement_status: string;
  created_at: string;
  ride: {
    id: string;
    created_at: string;
    origem: string | null;
    destino: string | null;
    valor: number | null;
    forma_pagamento: string | null;
    tipo_corrida: string | null;
    status: string | null;
  } | null;
};

type FinanceiroResponse = {
  success: boolean;
  driver_id: string;
  count: number;
  totals: {
    gross_ride_amount: number;
    economic_net_amount: number;
    platform_commission_amount: number;
    driver_direct_receipt_amount: number;
    driver_owes_platform_amount: number;
    platform_owes_driver_amount: number;
  };
  records: RideSummaryRecord[];
};

const WEEKDAY_LABELS_FULL = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function formatBRL(value: number) {
  const numeric = Number(value) || 0;
  return numeric.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function FinanceiroMoto() {
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);
  const [records, setRecords] = useState<RideSummaryRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      const sessionDriver = await fetchMotoSession();

      if (cancelled) return;

      if (!sessionDriver) {
        clearMotoLegacyStorage();
        router.push("/mototaxista/login");
        return;
      }

      syncMotoLegacyStorage(sessionDriver);
      setDriver(sessionDriver);

      try {
        const response = await fetch("/api/mototaxista/financeiro/ride-summary", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as FinanceiroResponse;

        if (!cancelled) {
          setRecords(data?.success && Array.isArray(data.records) ? data.records : []);
        }
      } catch (err) {
        console.error("Erro ao carregar financeiro:", err);
        if (!cancelled) {
          setRecords([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingRecords(false);
        }
      }
    };

    loadSession().catch(() => {
      if (cancelled) return;
      clearMotoLegacyStorage();
      router.push("/mototaxista/login");
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const { todayEarnings, todayCompletedRides, weekDays } = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    let todayEarnings = 0;
    let todayCompletedRides = 0;

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - todayStart.getDay());

    const weekMap = new Map<number, number>();
    for (let i = 0; i < 7; i += 1) {
      weekMap.set(i, 0);
    }

    records.forEach((record) => {
      const recordDate = new Date(record.created_at || (record.ride?.created_at ?? now));
      const net = Number(record.economic_net_amount) || 0;

      if (recordDate >= todayStart && recordDate < todayEnd) {
        todayEarnings += net;
        todayCompletedRides += 1;
      }

      if (recordDate >= weekStart) {
        const weekday = recordDate.getDay();
        weekMap.set(weekday, (weekMap.get(weekday) || 0) + net);
      }
    });

    const todayWeekday = todayStart.getDay();

    const weekDays: Array<{
      weekdayIndex: number;
      label: string;
      isToday: boolean;
      amount: number;
    }> = [];

    for (let i = 0; i < 7; i += 1) {
      const amount = weekMap.get(i) || 0;
      weekDays.push({
        weekdayIndex: i,
        label: WEEKDAY_LABELS_FULL[i],
        isToday: i === todayWeekday,
        amount,
      });
    }

    return {
      todayEarnings,
      todayCompletedRides,
      weekDays,
    };
  }, [records]);

  if (!driver) return null;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-20">
      <header className="bg-black border-b border-[#1A1A1A] p-6 pt-10 shadow-sm relative text-center">
        <h1 className="text-xl font-bold text-white tracking-wide">Meus Ganhos</h1>
      </header>

      <div className="p-6">
        <div className="bg-primary text-black rounded-[2rem] p-8 shadow-[0_15px_30px_rgba(255,208,0,0.15)] mb-8 border border-yellow-400/50">
          <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90">Ganhos de Hoje</p>
          <h2 className="text-5xl font-black tracking-tighter">
            {loadingRecords ? "---" : formatBRL(todayEarnings)}
          </h2>
          <p className="text-sm mt-3 font-medium opacity-80">
            {loadingRecords
              ? "Carregando..."
              : `${todayCompletedRides} corrida${todayCompletedRides === 1 ? "" : "s"} finalizada${todayCompletedRides === 1 ? "" : "s"}`}
          </p>
        </div>

        <h3 className="font-black text-white text-xl mb-5 tracking-wide">Resumo da Semana</h3>
        <div className="space-y-4">
          {loadingRecords
            ? Array.from({ length: 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#111111] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-[#222222] animate-pulse"
                >
                  <span className="text-gray-500 font-medium h-5 w-20 bg-[#222222] rounded" />
                  <span className="font-bold h-5 w-24 bg-[#222222] rounded" />
                </div>
              ))
            : weekDays.map((day) => (
                <div
                  key={day.weekdayIndex}
                  className={
                    day.isToday
                      ? "bg-[#1A1A1A] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-primary/30 border-l-4 border-l-primary relative overflow-hidden"
                      : "bg-[#111111] p-5 rounded-3xl shadow-lg flex justify-between items-center border border-[#222222]"
                  }
                >
                  {day.isToday ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                  ) : null}
                  <span
                    className={
                      day.isToday
                        ? "text-white font-bold relative z-10"
                        : "text-gray-400 font-medium"
                    }
                  >
                    {day.isToday ? `${day.label} (Hoje)` : day.label}
                  </span>
                  <span
                    className={
                      day.isToday
                        ? "font-black text-primary text-xl relative z-10"
                        : "font-bold text-white text-lg"
                    }
                  >
                    {formatBRL(day.amount)}
                  </span>
                </div>
              ))}
        </div>
      </div>

      <MotoBottomNav />
    </div>
  );
}
