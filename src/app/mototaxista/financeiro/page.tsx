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
  const HISTORY_PAGE_SIZE = 20;
  const router = useRouter();
  const [driver, setDriver] = useState<any>(null);
  const [records, setRecords] = useState<RideSummaryRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [driverOwesPlatform, setDriverOwesPlatform] = useState<number>(0);
  const [platformOwesDriver, setPlatformOwesDriver] = useState<number>(0);
  const [historyPeriod, setHistoryPeriod] = useState<"today" | "7days" | "30days" | "custom">("30days");
  const [historyCustomStart, setHistoryCustomStart] = useState<string>("");
  const [historyCustomEnd, setHistoryCustomEnd] = useState<string>("");
  const [historyRecords, setHistoryRecords] = useState<RideSummaryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyToken, setHistoryToken] = useState<number>(0);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historyTotalCount, setHistoryTotalCount] = useState<number>(0);

  type MovementProof = {
    id: string;
    summary_id: string;
    ride_id: string;
    driver_id: string;
    movement_type: string;
    movement_code: string;
    amount: number;
    created_at: string;
    proof_url: string | null;
    proof_filename: string | null;
    proof_uploaded_at: string | null;
  };
  const [movements, setMovements] = useState<MovementProof[]>([]);
  const [movementsBySummary, setMovementsBySummary] = useState<Record<string, MovementProof[]>>({});
  const [movementsLoading, setMovementsLoading] = useState<boolean>(false);
  const [historyMovements, setHistoryMovements] = useState<MovementProof[]>([]);
  const [historyMovementsBySummary, setHistoryMovementsBySummary] = useState<
    Record<string, MovementProof[]>
  >({});
  const [historyMovementsLoading, setHistoryMovementsLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const sessionDriver = await fetchMotoSession();

        if (!sessionDriver) {
          clearMotoLegacyStorage();
          router.push("/mototaxista/login");
          return;
        }

        syncMotoLegacyStorage(sessionDriver);
        if (!cancelled) setDriver(sessionDriver);

        const doLoadFinanceiro = async () => {
          try {
            const response = await fetch("/api/mototaxista/financeiro/ride-summary", {
              method: "GET",
              cache: "no-store",
              credentials: "include",
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const data = (await response.json()) as FinanceiroResponse;

            if (!cancelled) {
              setRecords(data?.success && Array.isArray(data.records) ? data.records : []);
              setDriverOwesPlatform(Number(data?.totals?.driver_owes_platform_amount) || 0);
              setPlatformOwesDriver(Number(data?.totals?.platform_owes_driver_amount) || 0);
            }
          } catch (err) {
            console.error("Erro ao carregar financeiro:", err);
            if (!cancelled) {
              setRecords([]);
              setDriverOwesPlatform(0);
              setPlatformOwesDriver(0);
            }
          } finally {
            if (!cancelled) {
              setLoadingRecords(false);
            }
          }
        };

        const doLoadMovements = async () => {
          setMovementsLoading(true);
          try {
            const mvRes = await fetch("/api/mototaxista/financeiro/movements", {
              method: "GET",
              cache: "no-store",
              credentials: "include",
            });
            if (mvRes.ok) {
              const mvData = await mvRes.json().catch(() => null);
              if (!cancelled && mvData?.success) {
                setMovements(mvData.rows || []);
                setMovementsBySummary(
                  (mvData.by_summary as Record<string, MovementProof[]>) || {},
                );
              }
            }
          } catch (e) {
            /* falha opcional: não exibir erro, apenas sem comprovantes */
          } finally {
            if (!cancelled) setMovementsLoading(false);
          }
        };

        Promise.all([
          doLoadFinanceiro().catch(() => {
            if (!cancelled) setLoadingRecords(false);
          }),
          doLoadMovements().catch(() => {
            if (!cancelled) setMovementsLoading(false);
          }),
        ]).catch(() => {
          if (!cancelled) {
            setLoadingRecords(false);
            setMovementsLoading(false);
          }
        });
      } catch (err) {
        console.error("Erro ao inicializar sessão do financeiro:", err);
        if (!cancelled) {
          setLoadingRecords(false);
        }
      }
    };

    loadSession().catch((err) => {
      if (cancelled) return;
      console.error("Erro crítico em loadSession (financeiro):", err);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!driver) return;

    let cancelled = false;

    const loadHistory = async () => {
      setLoadingHistory(true);
        const now = new Date();
        let startDateStr: string | undefined;
        let endDateStr: string | undefined;

        if (historyPeriod === "today") {
          const start = startOfDay(now);
          startDateStr = start.toISOString();
        } else if (historyPeriod === "7days") {
          const start = startOfDay(now);
          start.setDate(start.getDate() - 6);
          startDateStr = start.toISOString();
        } else if (historyPeriod === "30days") {
          const start = startOfDay(now);
          start.setDate(start.getDate() - 29);
          startDateStr = start.toISOString();
        } else if (historyPeriod === "custom") {
          if (historyCustomStart) {
            const d = new Date(historyCustomStart + "T00:00:00");
            if (!Number.isNaN(d.getTime())) startDateStr = d.toISOString();
          }
          if (historyCustomEnd) {
            const d = new Date(historyCustomEnd + "T23:59:59");
            if (!Number.isNaN(d.getTime())) endDateStr = d.toISOString();
          }
        }

        const params = new URLSearchParams();
        if (startDateStr) params.set("start_date", startDateStr);
        if (endDateStr) params.set("end_date", endDateStr);
        const offset = (historyPage - 1) * HISTORY_PAGE_SIZE;
        params.set("limit", String(HISTORY_PAGE_SIZE));
        params.set("offset", String(offset));

        const qs = params.toString();
        const url = `/api/mototaxista/financeiro/ride-summary${qs ? `?${qs}` : ""}`;

        const mvParams = new URLSearchParams();
        if (startDateStr) mvParams.set("start_date", startDateStr);
        if (endDateStr) mvParams.set("end_date", endDateStr);
        const mvUrl = `/api/mototaxista/financeiro/movements${mvParams.toString() ? `?${mvParams.toString()}` : ""}`;

        setHistoryMovementsLoading(true);

        const doFetchHistory = async () => {
          const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = (await response.json()) as FinanceiroResponse;
          if (!cancelled) {
            setHistoryRecords(data?.success && Array.isArray(data.records) ? data.records : []);
            setHistoryTotalCount(Number(data?.count) || 0);
          }
        };

        const doFetchHistoryMovements = async () => {
          try {
            const mvRes = await fetch(mvUrl, {
              method: "GET",
              cache: "no-store",
              credentials: "include",
            });
            if (mvRes.ok) {
              const mvData = await mvRes.json().catch(() => null);
              if (!cancelled && mvData?.success) {
                setHistoryMovements(mvData.rows || []);
                setHistoryMovementsBySummary(
                  (mvData.by_summary as Record<string, MovementProof[]>) || {},
                );
              }
            }
          } catch (e) {
            /* falha opcional */
          } finally {
            if (!cancelled) setHistoryMovementsLoading(false);
          }
        };

        try {
          await Promise.all([
            doFetchHistory(),
            doFetchHistoryMovements(),
          ]);
        } catch (err) {
          console.error("Erro ao carregar histórico filtrado:", err);
          if (!cancelled) {
            setHistoryRecords([]);
            setHistoryTotalCount(0);
          }
        } finally {
          if (!cancelled) {
            setLoadingHistory(false);
            setHistoryMovementsLoading(false);
          }
        }
    };

    loadHistory().catch((err) => {
      if (cancelled) return;
      console.error("Erro crítico em loadHistory:", err);
      setLoadingHistory(false);
    });

    return () => {
      cancelled = true;
    };
  }, [driver, historyPeriod, historyCustomStart, historyCustomEnd, historyToken, historyPage, HISTORY_PAGE_SIZE]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyPeriod, historyCustomStart, historyCustomEnd, historyToken]);

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

        <h3 className="font-black text-white text-xl mb-5 mt-12 tracking-wide">Saldos Pendentes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loadingRecords ? (
            <>
              <div className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-[#222222] animate-pulse">
                <div className="h-4 w-40 bg-[#222222] rounded mb-4" />
                <div className="h-8 w-32 bg-[#222222] rounded" />
              </div>
              <div className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-[#222222] animate-pulse">
                <div className="h-4 w-40 bg-[#222222] rounded mb-4" />
                <div className="h-8 w-32 bg-[#222222] rounded" />
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-red-900/30 border-l-4 border-l-red-500">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Você deve ao MotoSango</p>
                <p className={`font-black text-2xl ${driverOwesPlatform > 0 ? "text-red-400" : "text-gray-400"}`}>
                  {formatBRL(driverOwesPlatform)}
                </p>
              </div>
              <div className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-green-900/30 border-l-4 border-l-green-500">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">MotoSango deve a você</p>
                <p className={`font-black text-2xl ${platformOwesDriver > 0 ? "text-green-400" : "text-gray-400"}`}>
                  {formatBRL(platformOwesDriver)}
                </p>
              </div>
            </>
          )}
        </div>

        <h3 className="font-black text-white text-xl mb-5 mt-12 tracking-wide">Histórico de Corridas</h3>

        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: "today", label: "Hoje" },
              { key: "7days", label: "Últimos 7 dias" },
              { key: "30days", label: "Últimos 30 dias" },
              { key: "custom", label: "Personalizado" },
            ].map((opt) => {
              const active = historyPeriod === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setHistoryPeriod(opt.key as typeof historyPeriod)}
                  className={
                    "py-2.5 px-3 rounded-2xl font-bold text-xs uppercase tracking-wider border transition-all " +
                    (active
                      ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,208,0,0.25)]"
                      : "bg-[#111111] text-gray-300 border-[#222222] hover:border-primary/40 hover:text-white")
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {historyPeriod === "custom" && (
            <div className="bg-[#111111] p-4 rounded-3xl border border-[#222222] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Data inicial</label>
                  <input
                    type="date"
                    value={historyCustomStart}
                    onChange={(e) => setHistoryCustomStart(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white text-sm rounded-2xl px-4 py-2.5 border border-[#222222] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">Data final</label>
                  <input
                    type="date"
                    value={historyCustomEnd}
                    onChange={(e) => setHistoryCustomEnd(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white text-sm rounded-2xl px-4 py-2.5 border border-[#222222] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryToken((t) => t + 1)}
                className="w-full py-3 bg-primary text-black font-black rounded-full uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(255,208,0,0.2)] active:scale-[0.98] transition-transform"
              >
                Aplicar período
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {loadingHistory
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-[#222222] animate-pulse space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-[#222222] rounded" />
                    <div className="h-4 w-14 bg-[#222222] rounded" />
                  </div>
                  <div className="h-4 w-full bg-[#222222] rounded" />
                  <div className="h-4 w-11/12 bg-[#222222] rounded" />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="h-4 bg-[#222222] rounded" />
                    <div className="h-4 bg-[#222222] rounded" />
                    <div className="h-4 bg-[#222222] rounded" />
                  </div>
                </div>
              ))
            : historyRecords.length === 0
              ? (
                  <div className="bg-[#111111] p-8 rounded-3xl shadow-lg border border-[#222222] text-center">
                    <p className="text-gray-400 font-medium text-sm">Nenhuma corrida encontrada no período selecionado.</p>
                    <p className="text-gray-600 text-xs mt-2">Tente outro intervalo de datas.</p>
                  </div>
                )
              : historyRecords.map((record) => {
                  const recordDate = new Date(record.created_at || (record.ride?.created_at ?? Date.now()));
                  const dateLabel = recordDate.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const timeLabel = recordDate.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const origem = record.ride?.origem || "—";
                  const origemDisplay = typeof origem === 'string' && origem.startsWith('Lat:')
                    ? "📍 Localização atual"
                    : origem;
                  const destino = record.ride?.destino || "—";
                  const paymentLabel =
                    record.payment_method === "dinheiro"
                      ? "Dinheiro"
                      : record.payment_method === "pix"
                        ? "Pix"
                        : record.payment_method || "—";
                  const summaryMovements = historyMovementsBySummary[record.id] || [];
                  const proofMovements = summaryMovements.filter(
                    (m: MovementProof) =>
                      m &&
                      typeof m.proof_url === "string" &&
                      m.proof_url.trim() !== "" &&
                      typeof m.proof_filename === "string" &&
                      m.proof_filename.trim() !== "" &&
                      typeof m.proof_uploaded_at === "string" &&
                      m.proof_uploaded_at.trim() !== "",
                  );

                  return (
                    <div
                      key={record.id}
                      className="bg-[#111111] p-5 rounded-3xl shadow-lg border border-[#222222]"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-xs font-medium">{dateLabel} às {timeLabel}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#1A1A1A] text-gray-300 border border-[#222222]">
                          {paymentLabel}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          <span className="text-gray-300 text-sm font-medium line-clamp-2 break-words">{origemDisplay}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          <span className="text-gray-300 text-sm font-medium line-clamp-2 break-words">{destino}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1A1A1A]">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Valor da corrida</p>
                          <p className="text-white font-bold text-sm">{formatBRL(record.gross_ride_amount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Comissão MotoSango</p>
                          <p className="text-red-400 font-bold text-sm">- {formatBRL(record.platform_commission_amount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Seu líquido</p>
                          <p className="text-primary font-black text-sm">{formatBRL(record.economic_net_amount)}</p>
                        </div>
                      </div>

                      {proofMovements.length > 0 ? (
                        <div className="mt-5 pt-4 border-t border-[#1A1A1A] space-y-3">
                          {proofMovements.map((m: MovementProof) => (
                            <div
                              key={m.id}
                              className="rounded-2xl border border-green-900/60 bg-green-900/15 px-4 py-3"
                            >
                              <p className="text-[10px] uppercase tracking-widest text-green-400 font-black mb-1.5">
                                📎 Comprovante de repasse
                              </p>
                              <p className="text-xs text-gray-200 font-semibold truncate mb-1 max-w-full" title={m.proof_filename || undefined}>
                                Arquivo: {m.proof_filename}
                              </p>
                              {m.proof_uploaded_at && (
                                <p className="text-[10px] text-gray-500 font-bold mb-2">
                                  Enviado em: {new Date(m.proof_uploaded_at).toLocaleDateString("pt-BR")} ·{" "}
                                  {new Date(m.proof_uploaded_at).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                              {typeof m.amount === "number" && m.amount > 0 && (
                                <p className="text-[11px] text-green-300 font-bold mb-2">
                                  Valor liberado: {formatBRL(m.amount)}
                                </p>
                              )}
                              <a
                                href={m.proof_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-black text-primary hover:text-yellow-300 underline underline-offset-4"
                              >
                                🔗 Ver comprovante
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
        </div>

        {(() => {
          const totalPages = Math.max(1, Math.ceil(historyTotalCount / HISTORY_PAGE_SIZE));
          const hasPrevious = historyPage > 1;
          const hasNext = historyPage < totalPages;

          return (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={!hasPrevious || loadingHistory}
                onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                className={
                  "py-3 px-5 rounded-full font-black text-xs uppercase tracking-wider border transition-all flex-1 " +
                  (hasPrevious && !loadingHistory
                    ? "bg-[#111111] text-white border-[#222222] hover:border-primary/50 hover:text-primary active:scale-[0.98]"
                    : "bg-[#111111] text-gray-600 border-[#222222] cursor-not-allowed opacity-60")
                }
              >
                ← Anterior
              </button>
              <div className="text-center shrink-0 px-3">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Página</span>
                <span className="text-white font-black text-sm">
                  {historyPage} <span className="text-gray-500 font-medium">de {totalPages}</span>
                </span>
              </div>
              <button
                type="button"
                disabled={!hasNext || loadingHistory}
                onClick={() => setHistoryPage((p) => p + 1)}
                className={
                  "py-3 px-5 rounded-full font-black text-xs uppercase tracking-wider border transition-all flex-1 " +
                  (hasNext && !loadingHistory
                    ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,208,0,0.2)] hover:brightness-105 active:scale-[0.98]"
                    : "bg-[#111111] text-gray-600 border-[#222222] cursor-not-allowed opacity-60")
                }
              >
                Próxima →
              </button>
            </div>
          );
        })()}
      </div>

      <MotoBottomNav />
    </div>
  );
}
