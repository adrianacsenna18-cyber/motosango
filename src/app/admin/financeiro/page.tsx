"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

type PeriodOption =
  | "today"
  | "7days"
  | "30days"
  | "this_month"
  | "last_month"
  | "custom";

type OverviewRecord = {
  id: string;
  ride_id: string;
  driver_id: string;
  payment_method: string;
  gross_ride_amount: number;
  platform_commission_amount: number;
  economic_net_amount: number;
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
    forma_pagamento: string | null;
    cliente_nome: string | null;
  } | null;
  driver: {
    id: string;
    nome: string | null;
    telefone: string | null;
    chave_pix: string | null;
  } | null;
};

type OverviewTotals = {
  total_gross: number;
  total_commission: number;
  total_net: number;
  total_driver_direct_receipt: number;
  total_driver_owes: number;
  total_platform_owes: number;
  rides_count: number;
  pending_driver_owes_total: number;
  pending_platform_owes_total: number;
};

type PerDriverRow = {
  driver_id: string;
  driver_nome: string;
  driver_telefone: string | null;
  driver_chave_pix: string | null;
  rides_count: number;
  gross: number;
  commission: number;
  net: number;
  driver_owes_pending: number;
  platform_owes_pending: number;
  repassado: number;
};

type OverviewResponse = {
  success: boolean;
  filters?: { start_date?: string | null; end_date?: string | null } | null;
  counts?: { records: number };
  totals: OverviewTotals;
  per_driver: PerDriverRow[];
  records: OverviewRecord[];
};

const EPS = Number.EPSILON;
function roundMoney(v: number) {
  return Math.round((v + EPS) * 100) / 100;
}
function formatBRL(v: number) {
  const n = Number.isFinite(v) ? v : 0;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function paymentStatusLabel(s: string) {
  switch (s) {
    case "not_applicable":
      return { label: "N/A", cls: "bg-gray-800 text-gray-400 border-gray-700" };
    case "cash_received_by_driver":
      return {
        label: "Dinheiro recebido",
        cls: "bg-green-900/30 text-green-400 border-green-800/50",
      };
    case "pix_pending":
      return {
        label: "Pix pendente",
        cls: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
      };
    case "pix_paid_to_platform":
      return {
        label: "Pix na plataforma",
        cls: "bg-blue-900/30 text-blue-400 border-blue-800/50",
      };
    case "cancelled":
      return { label: "Cancelado", cls: "bg-red-900/30 text-red-400 border-red-800/50" };
    case "manual_credit":
      return {
        label: "Crédito manual",
        cls: "bg-purple-900/30 text-purple-400 border-purple-800/50",
      };
    default:
      return {
        label: s || "—",
        cls: "bg-gray-800 text-gray-300 border-gray-700",
      };
  }
}

function settlementStatusLabel(s: string) {
  switch (s) {
    case "not_applicable":
      return { label: "Aguardando", cls: "bg-gray-800 text-gray-400 border-gray-700" };
    case "driver_owes_platform":
      return {
        label: "Motorista deve",
        cls: "bg-orange-900/30 text-orange-400 border-orange-800/50",
      };
    case "driver_debt_partially_settled":
      return {
        label: "Parcialmente quitado",
        cls: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
      };
    case "driver_debt_settled":
      return {
        label: "Quitado",
        cls: "bg-green-900/30 text-green-400 border-green-800/50",
      };
    case "platform_owes_driver":
      return {
        label: "Plataforma deve",
        cls: "bg-red-900/30 text-red-400 border-red-800/50",
      };
    case "partially_released":
      return {
        label: "Parcialmente liberado",
        cls: "bg-blue-900/30 text-blue-400 border-blue-800/50",
      };
    case "fully_released":
      return {
        label: "Totalmente liberado",
        cls: "bg-green-900/30 text-green-400 border-green-800/50",
      };
    default:
      return {
        label: s || "—",
        cls: "bg-gray-800 text-gray-300 border-gray-700",
      };
  }
}

export default function AdminFinanceiro() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  const [period, setPeriod] = useState<PeriodOption>("30days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [applyToken, setApplyToken] = useState(0);

  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
  const [movementsLoading, setMovementsLoading] = useState(false);

  const [tab, setTab] = useState<"resumo" | "motoristas" | "historico" | "repasse">("resumo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === Estados de ações de liquidação ===
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  // === Estados do comprovante de repasse (upload) ===
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploadLoading, setProofUploadLoading] = useState(false);
  const [proofUploadMsg, setProofUploadMsg] = useState<string | null>(null);
  const [proofUploadErr, setProofUploadErr] = useState<string | null>(null);
  const [proof_url, setProof_url] = useState<string | null>(null);
  const [proof_filename, setProof_filename] = useState<string | null>(null);
  const [proof_uploaded_at, setProof_uploaded_at] = useState<string | null>(null);

  // Form values for actions
  const [releaseAmount, setReleaseAmount] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const adminData = localStorage.getItem("motosango_admin");
      if (!adminData) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          localStorage.removeItem("motosango_admin");
          router.push("/admin/login");
          return;
        }

        const json = await res.json().catch(() => null);
        if (!json?.success || !json?.authenticated) {
          localStorage.removeItem("motosango_admin");
          router.push("/admin/login");
          return;
        }

        if (!cancelled) setAdmin(JSON.parse(adminData));
      } catch {
        localStorage.removeItem("motosango_admin");
        router.push("/admin/login");
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const startEnd = useMemo<{ start: string | null; end: string | null }>(() => {
    const now = new Date();
    switch (period) {
      case "today": {
        return {
          start: startOfDay(now).toISOString(),
          end: endOfDay(now).toISOString(),
        };
      }
      case "7days": {
        const s = startOfDay(now);
        s.setDate(s.getDate() - 6);
        return { start: s.toISOString(), end: endOfDay(now).toISOString() };
      }
      case "30days": {
        const s = startOfDay(now);
        s.setDate(s.getDate() - 29);
        return { start: s.toISOString(), end: endOfDay(now).toISOString() };
      }
      case "this_month": {
        const s = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start: s.toISOString(), end: e.toISOString() };
      }
      case "last_month": {
        const s = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { start: s.toISOString(), end: e.toISOString() };
      }
      case "custom": {
        let s: string | null = null;
        let e: string | null = null;
        if (customStart) {
          const d = new Date(customStart + "T00:00:00");
          if (Number.isFinite(d.getTime())) s = d.toISOString();
        }
        if (customEnd) {
          const d = new Date(customEnd + "T23:59:59");
          if (Number.isFinite(d.getTime())) e = d.toISOString();
        }
        return { start: s, end: e };
      }
    }
  }, [period, customStart, customEnd, applyToken]);

  useEffect(() => {
    if (!admin) return;

    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    setMovementsLoading(true);

    const load = async () => {
      try {
        const qs = new URLSearchParams();
        if (startEnd.start) qs.set("start_date", startEnd.start);
        if (startEnd.end) qs.set("end_date", startEnd.end);
        const query = qs.toString();
        const url = `/api/admin/financeiro/overview${query ? `?${query}` : ""}`;
        const res = await fetch(url, { method: "GET", cache: "no-store", credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as OverviewResponse;
        if (!cancelled) setOverview(data);
      } catch (err: any) {
        if (!cancelled) setFetchError(err?.message || "Erro desconhecido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const loadMovements = async () => {
      try {
        const qs = new URLSearchParams();
        if (startEnd.start) qs.set("start_date", startEnd.start);
        if (startEnd.end) qs.set("end_date", startEnd.end);
        const mvUrl = `/api/admin/financeiro/movements${qs.toString() ? `?${qs.toString()}` : ""}`;
        const mvRes = await fetch(mvUrl, {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });
        if (mvRes.ok) {
          const mvData = await mvRes.json().catch(() => null);
          if (!cancelled && mvData?.success) {
            setMovements(mvData.rows || []);
            setMovementsBySummary((mvData.by_summary as Record<string, MovementProof[]>) || {});
          }
        }
      } catch (e) {
        /* falha opcional: não mostra erro para o usuário, apenas deixa sem comprovante. */
      } finally {
        if (!cancelled) setMovementsLoading(false);
      }
    };

    load().catch((e) => {
      if (!cancelled) {
        console.error(e);
        setLoading(false);
      }
    });
    loadMovements().catch((e) => {
      if (!cancelled) {
        setMovementsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [admin, startEnd]);

  if (!admin) return null;

  const totals: OverviewTotals = overview?.totals || {
    total_gross: 0,
    total_commission: 0,
    total_net: 0,
    total_driver_direct_receipt: 0,
    total_driver_owes: 0,
    total_platform_owes: 0,
    rides_count: 0,
    pending_driver_owes_total: 0,
    pending_platform_owes_total: 0,
  };
  const perDriver: PerDriverRow[] = overview?.per_driver || [];
  const records: OverviewRecord[] = overview?.records || [];

  const selectedDriverRows = selectedDriverId
    ? records.filter((r) => r.driver_id === selectedDriverId)
    : [];
  const selectedDriverPending = perDriver.find((d) => d.driver_id === selectedDriverId);

  async function refresh() {
    setApplyToken((t) => t + 1);
  }

  async function callAction(
    endpoint: string,
    payload: Record<string, any>,
    successMsg: string,
  ) {
    setActionLoading(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setActionMsg(successMsg + (data?.message ? ` (${data.message})` : ""));
      await refresh();
    } catch (err: any) {
      setActionErr(err?.message || "Erro desconhecido");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmPixIn(summaryId: string) {
    await callAction(
      "/api/admin/financeiro/confirm-pix-in",
      {
        summary_id: summaryId,
        reason: actionReason.trim() || undefined,
      },
      "Pix confirmado na plataforma.",
    );
  }

  async function handlePayCommission(driverId: string) {
    const driverRow = perDriver.find((d) => d.driver_id === driverId);
    const max = driverRow?.driver_owes_pending || 0;
    const amountStr = commissionAmount.trim();
    let amount: number;
    if (amountStr === "") {
      amount = roundMoney(max);
    } else {
      amount = roundMoney(parseFloat(amountStr.replace(",", ".")) || 0);
    }
    if (amount <= 0) {
      setActionErr("Informe um valor positivo para abater a comissão.");
      return;
    }
    // Processa por summary individual (para permitir controle fino)
    const pendentes = records.filter(
      (r) =>
        r.driver_id === driverId &&
        (r.settlement_status === "driver_owes_platform" ||
          r.settlement_status === "driver_debt_partially_settled") &&
        r.driver_owes_platform_amount > 0,
    );
    if (pendentes.length === 0) {
      setActionErr("Nenhuma comissão pendente para este mototaxista no período.");
      return;
    }
    let restante = amount;
    for (const r of pendentes) {
      if (restante <= 0) break;
      const saldoR = r.driver_owes_platform_amount;
      const aplicar = roundMoney(Math.min(restante, saldoR));
      const res = await fetch("/api/admin/financeiro/pay-commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary_id: r.id,
          amount: aplicar,
          reason: (actionReason.trim() || "Fechamento manual por admin") + ` (corrida ${r.ride_id.slice(0, 8)})`,
        }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionErr(`Erro ao abater corrida ${r.ride_id.slice(0, 8)}: ${data?.error || res.status}`);
        break;
      }
      restante = roundMoney(restante - aplicar);
    }
    if (restante > 0) {
      setActionMsg(
        `Parcialmente aplicado (${formatBRL(roundMoney(amount - restante))} / ${formatBRL(amount)}. Restante R$ ${restante.toFixed(
          2,
        )} sem saldo para abater).`,
      );
    } else {
      setActionMsg(`Comissão abatida no valor de ${formatBRL(amount)}.`);
    }
    await refresh();
  }

  async function handleReleaseToDriver(driverId: string) {
    const driverRow = perDriver.find((d) => d.driver_id === driverId);
    const max = driverRow?.platform_owes_pending || 0;
    const amountStr = releaseAmount.trim();
    let amount: number;
    if (amountStr === "") {
      amount = roundMoney(max);
    } else {
      amount = roundMoney(parseFloat(amountStr.replace(",", ".")) || 0);
    }
    if (amount <= 0) {
      setActionErr("Informe um valor positivo para repassar.");
      return;
    }
    const pendentes = records.filter(
      (r) =>
        r.driver_id === driverId &&
        r.payment_status === "pix_paid_to_platform" &&
        (r.settlement_status === "platform_owes_driver" ||
          r.settlement_status === "partially_released") &&
        r.platform_owes_driver_amount > 0,
    );
    if (pendentes.length === 0) {
      setActionErr(
        "Nenhum valor aguardando liberação para este mototaxista no período (verifique se o Pix já foi confirmado na plataforma).",
      );
      return;
    }
    let restante = amount;
    let liberadoTotal = 0;
    for (const r of pendentes) {
      if (restante <= 0) break;
      const saldoR = r.platform_owes_driver_amount;
      const aplicar = roundMoney(Math.min(restante, saldoR));
      const bodyObj: Record<string, any> = {
        summary_id: r.id,
        amount: aplicar,
        reason:
          (actionReason.trim() || "Repasse manual ao mototaxista") +
          ` (corrida ${r.ride_id.slice(0, 8)})`,
      };
      if (
        typeof proof_url === "string" &&
        proof_url.trim() !== "" &&
        typeof proof_filename === "string" &&
        proof_filename.trim() !== "" &&
        typeof proof_uploaded_at === "string" &&
        proof_uploaded_at.trim() !== ""
      ) {
        bodyObj.proof_url = proof_url.trim();
        bodyObj.proof_filename = proof_filename.trim();
        bodyObj.proof_uploaded_at = proof_uploaded_at.trim();
      }
      const res = await fetch("/api/admin/financeiro/release-to-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionErr(
          `Erro ao liberar corrida ${r.ride_id.slice(0, 8)}: ${data?.error || res.status}`,
        );
        break;
      }
      liberadoTotal = roundMoney(liberadoTotal + aplicar);
      restante = roundMoney(restante - aplicar);
    }
    if (restante > 0) {
      setActionMsg(
        `Parcialmente liberado (${formatBRL(liberadoTotal)} / ${formatBRL(amount)}. Restante R$ ${restante.toFixed(
          2,
        )} sem saldo para liberar).`,
      );
    } else {
      setActionMsg(`Repasse realizado no valor de ${formatBRL(amount)}.`);
    }
    await refresh();
  }

  async function handleUploadProof() {
    if (!proofFile) {
      setProofUploadErr("Selecione um arquivo antes de enviar.");
      return;
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    const ALLOWED = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ]);
    const mime = (proofFile.type || "").toLowerCase();
    if (!ALLOWED.has(mime)) {
      setProofUploadErr(
        "Tipo de arquivo não permitido. Envie JPG, PNG, WEBP ou PDF."
      );
      return;
    }
    if (proofFile.size > MAX_BYTES) {
      const mb = (proofFile.size / 1024 / 1024).toFixed(2);
      setProofUploadErr(
        `Arquivo muito grande (${mb} MB). Tamanho máximo permitido: 5 MB.`
      );
      return;
    }
    if (proofFile.size === 0) {
      setProofUploadErr("Arquivo selecionado está vazio.");
      return;
    }
    setProofUploadLoading(true);
    setProofUploadMsg(null);
    setProofUploadErr(null);
    try {
      const fd = new FormData();
      fd.append("file", proofFile);
      const res = await fetch("/api/admin/financeiro/upload-proof", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setProofUploadErr(
          data?.error ||
            `Falha no envio do comprovante (HTTP ${res.status}).`
        );
        return;
      }
      setProof_url(data.proof_url || null);
      setProof_filename(data.proof_filename || proofFile.name);
      setProof_uploaded_at(data.proof_uploaded_at || new Date().toISOString());
      setProofUploadMsg(
        "Comprovante enviado com sucesso! Ele será vinculado ao próximo repasse lançado."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "erro de rede";
      setProofUploadErr(`Erro ao enviar comprovante: ${msg}.`);
    } finally {
      setProofUploadLoading(false);
    }
  }

  function renderFilterBar() {
    return (
      <div className="bg-[#111111] rounded-3xl border border-[#222] p-4 md:p-5 mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "today", label: "Hoje" },
              { key: "7days", label: "7 dias" },
              { key: "30days", label: "30 dias" },
              { key: "this_month", label: "Este mês" },
              { key: "last_month", label: "Mês anterior" },
              { key: "custom", label: "Personalizado" },
            ] as { key: PeriodOption; label: string }[]
          ).map((o) => (
            <button
              key={o.key}
              onClick={() => setPeriod(o.key)}
              className={
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors " +
                (period === o.key
                  ? "bg-[#FFD000] text-black border-[#FFD000]"
                  : "bg-[#1A1A1A] text-gray-300 border-[#2a2a2a] hover:border-[#FFD000]/40 hover:text-white")
              }
            >
              {o.label}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                Data inicial
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-[#1A1A1A] text-white text-sm rounded-2xl px-4 py-2.5 border border-[#222] outline-none focus:border-[#FFD000] transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                Data final
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-[#1A1A1A] text-white text-sm rounded-2xl px-4 py-2.5 border border-[#222] outline-none focus:border-[#FFD000] transition-colors"
              />
            </div>
            <button
              onClick={() => {
                setActionMsg(null);
                setActionErr(null);
                refresh();
              }}
              className="py-2.5 px-6 bg-[#FFD000] text-black font-black rounded-full uppercase tracking-wider text-xs active:scale-[0.98] transition-transform"
            >
              Aplicar período
            </button>
          </div>
        )}

        {fetchError && (
          <p className="text-sm text-red-400 font-medium">
            Erro ao carregar dados: <span className="font-bold">{fetchError}</span>
          </p>
        )}
      </div>
    );
  }

  function renderTotalsCards() {
    const cards = [
      {
        title: "Total Bruto",
        value: formatBRL(totals.total_gross),
        sub: `${totals.rides_count} corrida${totals.rides_count === 1 ? "" : "s"}`,
        color: "text-white",
      },
      {
        title: "Comissão MotoSango (15%)",
        value: formatBRL(totals.total_commission),
        sub: "Receita plataforma",
        color: "text-[#FFD000]",
      },
      {
        title: "Líquido dos Mototaxistas",
        value: formatBRL(totals.total_net),
        sub: "Total a repassar (bruto - comissão)",
        color: "text-blue-400",
      },
      {
        title: "Mototaxistas devem (comissão)",
        value: formatBRL(totals.pending_driver_owes_total),
        sub: "Aguardando abatimento",
        color: "text-orange-400",
      },
      {
        title: "Plataforma deve (Pix)",
        value: formatBRL(totals.pending_platform_owes_total),
        sub: "Aguardando liberação",
        color: "text-green-400",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {(loading ? Array.from({ length: 5 }) : cards).map((item, i) => {
          const c = item as (typeof cards)[number] | undefined;
          return (
            <div
              key={i}
              className="bg-[#111111] p-5 md:p-6 rounded-3xl border border-[#222] hover:border-[#FFD000]/40 transition-colors"
            >
              <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
                {!c ? " " : c.title}
              </p>
              {!c ? (
                <div className="h-7 w-36 bg-[#1A1A1A] rounded animate-pulse mb-2" />
              ) : (
                <p className={`text-2xl md:text-3xl font-black ${c.color}`}>
                  {c.value}
                </p>
              )}
              {!c ? (
                <div className="h-3 w-28 bg-[#1A1A1A] rounded animate-pulse mt-2" />
              ) : (
                <p className="text-[11px] text-gray-500 mt-2 font-bold">{c.sub}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderResumo() {
    return (
      <div>
        {renderTotalsCards()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111111] rounded-3xl border border-[#222] overflow-hidden">
            <div className="p-5 border-b border-[#222] flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Top Mototaxistas</h3>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Por líquido
              </span>
            </div>
            <div className="divide-y divide-[#1A1A1A] max-h-[420px] overflow-y-auto">
              {loading && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4 space-y-2 animate-pulse">
                      <div className="h-4 w-40 bg-[#1A1A1A] rounded" />
                      <div className="h-3 w-32 bg-[#1A1A1A] rounded" />
                    </div>
                  ))}
                </>
              )}
              {!loading && perDriver.length === 0 && (
                <p className="p-6 text-center text-gray-500 text-sm">
                  Nenhum mototaxista no período selecionado.
                </p>
              )}
              {!loading &&
                [...perDriver]
                  .sort((a, b) => b.net - a.net)
                  .slice(0, 10)
                  .map((d, i) => (
                    <div key={d.driver_id} className="p-4 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-[#FFD000] text-black flex items-center justify-center text-xs font-black shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">{d.driver_nome}</p>
                          <p className="text-[11px] text-gray-500 font-bold">
                            {d.rides_count} corridas
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FFD000] font-black text-lg">
                          {formatBRL(d.net)}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-[#111111] rounded-3xl border border-[#222] overflow-hidden">
            <div className="p-5 border-b border-[#222] flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Pendências Financeiras</h3>
            </div>
            <div className="space-y-0 divide-y divide-[#1A1A1A]">
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">
                    Mototaxistas devem à plataforma (comissão)
                  </span>
                  <span className="text-orange-400 font-black text-lg">
                    {formatBRL(totals.pending_driver_owes_total)}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500/80 rounded-full"
                    style={{
                      width: `${
                        totals.total_commission > 0
                          ? Math.min(
                              100,
                              (totals.pending_driver_owes_total / totals.total_commission) * 100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">
                    Plataforma deve aos mototaxistas (Pix a liberar)
                  </span>
                  <span className="text-green-400 font-black text-lg">
                    {formatBRL(totals.pending_platform_owes_total)}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500/80 rounded-full"
                    style={{
                      width: `${
                        totals.total_net > 0
                          ? Math.min(
                              100,
                              (totals.pending_platform_owes_total / totals.total_net) * 100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">
                    Pix pendente de confirmação na plataforma
                  </span>
                  <span className="text-yellow-400 font-black text-lg">
                    {formatBRL(
                      records
                        .filter((r) => r.payment_status === "pix_pending")
                        .reduce((a, r) => a + r.economic_net_amount, 0),
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-bold mt-1">
                  Use a aba Repasse &rarr; Histórico &rarr; botão "Confirmar Pix na plataforma"
                  para marcar como recebido e gerar a pendência de liberação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderPorMotoristas() {
    return (
      <div className="bg-[#111111] rounded-3xl border border-[#222] overflow-hidden">
        <div className="p-5 border-b border-[#222] flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">Situação por Mototaxista</h3>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {perDriver.length} mototaxista{perDriver.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-[#1A1A1A] border-b border-[#222]">
              <tr>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Mototaxista
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Corridas
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Bruto
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Comissão (15%)
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Líquido
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Já repassado
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Pendente
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 bg-[#1A1A1A] rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading && perDriver.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Nenhum dado no período selecionado.
                  </td>
                </tr>
              )}
              {!loading &&
                perDriver.map((d) => (
                  <tr
                    key={d.driver_id}
                    className="hover:bg-[#1A1A1A] transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-white font-semibold">{d.driver_nome}</p>
                      {d.driver_telefone && (
                        <p className="text-xs text-gray-500 font-bold mt-0.5">
                          {d.driver_telefone}
                        </p>
                      )}
                      {d.driver_chave_pix && (
                        <p className="text-[10px] text-gray-600 mt-0.5 truncate max-w-xs" title={d.driver_chave_pix}>
                          PIX: {d.driver_chave_pix}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right text-gray-300 font-bold">{d.rides_count}</td>
                    <td className="p-4 text-right text-white font-semibold">
                      {formatBRL(d.gross)}
                    </td>
                    <td className="p-4 text-right text-orange-400 font-semibold">
                      - {formatBRL(d.commission)}
                    </td>
                    <td className="p-4 text-right text-blue-400 font-black">
                      {formatBRL(d.net)}
                    </td>
                    <td className="p-4 text-right text-green-400 font-semibold">
                      {formatBRL(d.repassado)}
                    </td>
                    <td className="p-4 text-right">
                      {d.platform_owes_pending > 0 ? (
                        <p className="text-red-400 font-black">
                          {formatBRL(d.platform_owes_pending)}
                        </p>
                      ) : d.driver_owes_pending > 0 ? (
                        <p className="text-orange-400 font-black">
                          {formatBRL(d.driver_owes_pending)}
                        </p>
                      ) : (
                        <p className="text-green-400 font-semibold">Tudo quitado</p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDriverId(d.driver_id);
                          setSelectedSummaryId(null);
                          setReleaseAmount("");
                          setCommissionAmount("");
                          setActionReason("");
                          setActionMsg(null);
                          setActionErr(null);
                          setTab("repasse");
                        }}
                        className="px-3 py-1.5 bg-[#FFD000] text-black text-xs font-bold rounded-full hover:bg-yellow-500 transition-colors"
                      >
                        Gerenciar repasse
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderHistorico() {
    return (
      <div className="bg-[#111111] rounded-3xl border border-[#222] overflow-hidden">
        <div className="p-5 border-b border-[#222] flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">Histórico Financeiro</h3>
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {records.length} registro{records.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1400px]">
            <thead className="bg-[#1A1A1A] border-b border-[#222]">
              <tr>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Data
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Mototaxista
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Corrida / Cliente
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Bruto
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Comissão
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Líquido
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Liquidação
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  📎 Comprovante
                </th>
                <th className="p-4 font-medium text-gray-400 text-xs uppercase tracking-wider text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 bg-[#1A1A1A] rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-10 text-center text-gray-500">
                    Nenhum registro financeiro no período selecionado.
                  </td>
                </tr>
              )}
              {!loading &&
                records.map((r) => {
                  const ps = paymentStatusLabel(r.payment_status);
                  const ss = settlementStatusLabel(r.settlement_status);
                  const podeConfirmarPix =
                    r.payment_status === "pix_pending" &&
                    r.settlement_status === "not_applicable";
                  const summaryMovements = movementsBySummary[r.id] || [];
                  const proofMovements = summaryMovements.filter(
                    (m: any) =>
                      m &&
                      typeof m.proof_url === "string" &&
                      m.proof_url.trim() !== "" &&
                      typeof m.proof_filename === "string" &&
                      m.proof_filename.trim() !== "" &&
                      typeof m.proof_uploaded_at === "string" &&
                      m.proof_uploaded_at.trim() !== "",
                  );
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-[#1A1A1A] transition-colors align-top"
                    >
                      <td className="p-4">
                        <p className="text-white font-semibold text-sm">
                          {new Date(r.created_at).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                          {new Date(r.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-white font-semibold text-sm">
                          {r.driver?.nome || "Mototaxista #" + r.driver_id.slice(0, 6)}
                        </p>
                        <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                          {(r.payment_method || "").toUpperCase()}
                        </p>
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {r.ride?.origem || "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            → {r.ride?.destino || "—"}
                          </p>
                          {r.ride?.cliente_nome && (
                            <p className="text-[11px] text-gray-500 font-bold mt-1 truncate" title={r.ride.cliente_nome}>
                              Cliente: {r.ride.cliente_nome}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-semibold">
                        {formatBRL(r.gross_ride_amount)}
                      </td>
                      <td className="p-4 text-right text-orange-400 font-semibold">
                        - {formatBRL(r.platform_commission_amount)}
                      </td>
                      <td className="p-4 text-right text-blue-400 font-black">
                        {formatBRL(r.economic_net_amount)}
                      </td>
                      <td className="p-4 align-top">
                        <span
                          className={
                            "inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full border " +
                            ps.cls
                          }
                        >
                          {ps.label}
                        </span>
                      </td>
                      <td className="p-4 align-top">
                        <span
                          className={
                            "inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-black rounded-full border " +
                            ss.cls
                          }
                        >
                          {ss.label}
                        </span>
                      </td>
                      <td className="p-4 align-top">
                        {movementsLoading ? (
                          <span className="text-[11px] text-gray-500 font-bold">⋯</span>
                        ) : proofMovements.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {proofMovements.map((m: any) => (
                              <div
                                key={m.id}
                                className="border border-green-900/60 bg-green-900/20 rounded-2xl px-3 py-2"
                              >
                                <p className="text-[11px] text-green-400 font-black uppercase tracking-wider">
                                  📎 Comprovante
                                </p>
                                <p className="text-xs text-gray-200 font-semibold truncate max-w-xs mt-0.5" title={m.proof_filename}>
                                  {m.proof_filename}
                                </p>
                                {m.proof_uploaded_at && (
                                  <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                                    {new Date(m.proof_uploaded_at).toLocaleDateString("pt-BR")} ·{" "}
                                    {new Date(m.proof_uploaded_at).toLocaleTimeString("pt-BR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}
                                <a
                                  href={m.proof_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-2 text-[10px] uppercase tracking-wider font-black text-yellow-400 hover:text-yellow-300 underline underline-offset-4"
                                >
                                  🔗 Ver comprovante
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-bold">
                            Sem comprovante
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right align-top">
                        <div className="flex flex-col gap-1.5 items-end">
                          {podeConfirmarPix && (
                            <button
                              onClick={() =>
                                handleConfirmPixIn(r.id)
                              }
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-yellow-900/30 border border-yellow-800/50 text-yellow-400 text-[10px] font-black uppercase rounded-full hover:bg-yellow-800/40 transition-colors disabled:opacity-60"
                            >
                              Confirmar Pix na plataforma
                            </button>
                          )}
                          {(r.settlement_status === "platform_owes_driver" ||
                            r.settlement_status === "partially_released") &&
                            r.platform_owes_driver_amount > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedSummaryId(r.id);
                                  setSelectedDriverId(r.driver_id);
                                  setReleaseAmount(r.platform_owes_driver_amount.toFixed(2));
                                  setActionReason("");
                                  setActionMsg(null);
                                  setActionErr(null);
                                  setProofFile(null);
                                  setProof_url(null);
                                  setProof_filename(null);
                                  setProof_uploaded_at(null);
                                  setProofUploadMsg(null);
                                  setProofUploadErr(null);
                                  setTab("repasse");
                                }}
                                className="px-3 py-1.5 bg-green-900/30 border border-green-800/50 text-green-400 text-[10px] font-black uppercase rounded-full hover:bg-green-800/40 transition-colors"
                              >
                                Liberar {formatBRL(r.platform_owes_driver_amount)}
                              </button>
                            )}
                          {(r.settlement_status === "driver_owes_platform" ||
                            r.settlement_status === "driver_debt_partially_settled") &&
                            r.driver_owes_platform_amount > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedSummaryId(r.id);
                                  setSelectedDriverId(r.driver_id);
                                  setCommissionAmount(r.driver_owes_platform_amount.toFixed(2));
                                  setActionReason("");
                                  setActionMsg(null);
                                  setActionErr(null);
                                  setProofFile(null);
                                  setProof_url(null);
                                  setProof_filename(null);
                                  setProof_uploaded_at(null);
                                  setProofUploadMsg(null);
                                  setProofUploadErr(null);
                                  setTab("repasse");
                                }}
                                className="px-3 py-1.5 bg-orange-900/30 border border-orange-800/50 text-orange-400 text-[10px] font-black uppercase rounded-full hover:bg-orange-800/40 transition-colors"
                              >
                                Abater comissão {formatBRL(r.driver_owes_platform_amount)}
                              </button>
                            )}
                          {r.settlement_status === "fully_released" ||
                          r.settlement_status === "driver_debt_settled" ? (
                            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">
                              Concluído
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderRepasse() {
    const driver = selectedDriverId
      ? perDriver.find((d) => d.driver_id === selectedDriverId) || null
      : null;
    const summaryRow = selectedSummaryId
      ? records.find((r) => r.id === selectedSummaryId) || null
      : null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] rounded-3xl border border-[#222] p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="font-bold text-white text-lg mb-1">
                  {selectedDriverId ? (driver ? driver.driver_nome : "Carregando...") : "Selecione um mototaxista"}
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Área de repasse e abatimento manual
                </p>
              </div>
              <select
                className="bg-[#1A1A1A] text-white text-sm rounded-2xl px-4 py-2.5 border border-[#222] outline-none focus:border-[#FFD000] transition-colors max-w-xs"
                value={selectedDriverId || ""}
                onChange={(e) => {
                  setSelectedDriverId(e.target.value || null);
                  setSelectedSummaryId(null);
                  setReleaseAmount("");
                  setCommissionAmount("");
                  setActionMsg(null);
                  setActionErr(null);
                  setProofFile(null);
                  setProof_url(null);
                  setProof_filename(null);
                  setProof_uploaded_at(null);
                  setProofUploadMsg(null);
                  setProofUploadErr(null);
                }}
              >
                <option value="">— Escolha um mototaxista —</option>
                {perDriver.map((d) => (
                  <option key={d.driver_id} value={d.driver_id}>
                    {d.driver_nome} {d.driver_telefone ? `(${d.driver_telefone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {!selectedDriverId && (
              <p className="text-sm text-gray-400 p-6 text-center bg-[#1A1A1A] rounded-2xl border border-dashed border-[#222]">
                Selecione um mototaxista acima ou clique em "Gerenciar repasse" na tabela por
                mototaxista.
              </p>
            )}

            {selectedDriverId && driver && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    Corridas
                  </p>
                  <p className="text-white font-black text-lg">{driver.rides_count}</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    Líquido do período
                  </p>
                  <p className="text-blue-400 font-black text-lg">{formatBRL(driver.net)}</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    Pix a liberar
                  </p>
                  <p className="text-green-400 font-black text-lg">
                    {formatBRL(driver.platform_owes_pending)}
                  </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#222]">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    Comissão a abater
                  </p>
                  <p className="text-orange-400 font-black text-lg">
                    {formatBRL(driver.driver_owes_pending)}
                  </p>
                </div>
              </div>
            )}

            {selectedDriverId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#222] p-5 space-y-4">
                  <div>
                    <h4 className="font-black text-white uppercase tracking-wider text-sm mb-1">
                      1. Liberar Pix ao mototaxista
                    </h4>
                    <p className="text-xs text-gray-500 font-bold">
                      Registra o repasse do valor da plataforma para o mototaxista.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                      Valor do repasse (R$)
                    </label>
                    <input
                      type="text"
                      disabled={actionLoading}
                      placeholder={
                        driver ? `Total: ${formatBRL(driver.platform_owes_pending)}` : "0,00"
                      }
                      value={releaseAmount}
                      onChange={(e) => setReleaseAmount(e.target.value)}
                      className="w-full bg-black text-white text-lg font-black rounded-2xl px-4 py-3 border border-[#222] outline-none focus:border-[#FFD000] transition-colors"
                    />
                    <p className="text-[11px] text-gray-500 mt-1 font-bold">
                      Deixe vazio para repassar o TOTAL pendente.
                    </p>
                  </div>
                  {summaryRow && summaryRow.driver_id === selectedDriverId && (
                    <p className="text-[11px] text-blue-400 font-bold">
                      Ação originada da corrida #{summaryRow.ride_id.slice(0, 8)}
                    </p>
                  )}
                  <button
                    disabled={actionLoading || !selectedDriverId}
                    onClick={() => handleReleaseToDriver(selectedDriverId!)}
                    className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-black uppercase tracking-wider text-xs rounded-full shadow-md active:scale-[0.98] transition-transform"
                  >
                    {actionLoading ? "Processando..." : "Registrar repasse ao mototaxista"}
                  </button>
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl border border-[#222] p-5 space-y-4">
                  <div>
                    <h4 className="font-black text-white uppercase tracking-wider text-sm mb-1">
                      2. Abater comissão (mototaxista pagou)
                    </h4>
                    <p className="text-xs text-gray-500 font-bold">
                      Registra que o mototaxista quitou a comissão devida à plataforma.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                      Valor abatido (R$)
                    </label>
                    <input
                      type="text"
                      disabled={actionLoading}
                      placeholder={
                        driver ? `Total: ${formatBRL(driver.driver_owes_pending)}` : "0,00"
                      }
                      value={commissionAmount}
                      onChange={(e) => setCommissionAmount(e.target.value)}
                      className="w-full bg-black text-white text-lg font-black rounded-2xl px-4 py-3 border border-[#222] outline-none focus:border-[#FFD000] transition-colors"
                    />
                    <p className="text-[11px] text-gray-500 mt-1 font-bold">
                      Deixe vazio para abater o TOTAL pendente.
                    </p>
                  </div>
                  {summaryRow && summaryRow.driver_id === selectedDriverId && (
                    <p className="text-[11px] text-orange-400 font-bold">
                      Ação originada da corrida #{summaryRow.ride_id.slice(0, 8)}
                    </p>
                  )}
                  <button
                    disabled={actionLoading || !selectedDriverId}
                    onClick={() => handlePayCommission(selectedDriverId!)}
                    className="w-full py-3 bg-orange-700 hover:bg-orange-600 disabled:opacity-60 text-white font-black uppercase tracking-wider text-xs rounded-full shadow-md active:scale-[0.98] transition-transform"
                  >
                    {actionLoading ? "Processando..." : "Confirmar abatimento de comissão"}
                  </button>
                </div>

                <div className="md:col-span-2 bg-[#1A1A1A] rounded-2xl border border-[#222] p-5">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                    Motivo / Comprovante / Observação
                  </label>
                  <input
                    type="text"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Ex: comprovante Pix E6D92C8F, ou 'pagou em dinheiro no balcão'"
                    className="w-full bg-black text-white text-sm rounded-2xl px-4 py-3 border border-[#222] outline-none focus:border-[#FFD000] transition-colors"
                  />
                </div>

                <div className="md:col-span-2 bg-[#1A1A1A] rounded-2xl border border-[#222] p-5 space-y-4">
                  <div>
                    <h4 className="font-black text-white uppercase tracking-wider text-sm mb-1">
                      3. Enviar comprovante do repasse
                    </h4>
                    <p className="text-xs text-gray-500 font-bold">
                      Faça o upload do comprovante Pix ou recibo antes de lançar o repasse.
                      Formatos permitidos: JPG, PNG, WEBP e PDF. Tamanho máximo: 5 MB.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="block w-full">
                      <span className="sr-only">Selecionar arquivo do comprovante</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setProofFile(f);
                          setProofUploadMsg(null);
                          setProofUploadErr(null);
                        }}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-[11px] file:font-black file:uppercase file:tracking-wider file:bg-[#FFD000] file:text-black hover:file:bg-[#ffe44d] transition-colors cursor-pointer"
                      />
                    </label>
                    {proofFile && (
                      <div className="flex items-center justify-between gap-3 bg-black rounded-2xl border border-[#222] px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm text-white font-semibold truncate">
                            📎 {proofFile.name}
                          </p>
                          <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                            {(proofFile.size / 1024 / 1024).toFixed(2)} MB · {proofFile.type || "arquivo"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProofFile(null);
                            setProofUploadMsg(null);
                            setProofUploadErr(null);
                          }}
                          className="text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-red-400 transition-colors px-3 py-1"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleUploadProof()}
                      disabled={proofUploadLoading || !proofFile || actionLoading}
                      className="w-full py-3 bg-[#FFD000] hover:bg-[#ffe44d] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black uppercase tracking-wider text-xs rounded-full shadow-md active:scale-[0.98] transition-transform"
                    >
                      {proofUploadLoading
                        ? "Enviando comprovante..."
                        : proofFile
                        ? `📤 Subir Comprovante (${(proofFile.size / 1024 / 1024).toFixed(2)} MB)`
                        : "📤 Subir Comprovante"}
                    </button>
                  </div>

                  {proof_url && proof_filename && (
                    <div className="mt-2 space-y-2 bg-green-900/20 border border-green-800/50 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-green-500 font-black mb-1">
                            ✅ Comprovante enviado e salvo no Storage
                          </p>
                          <p className="text-sm text-white font-semibold truncate">
                            📎 {proof_filename}
                          </p>
                          {proof_uploaded_at && (
                            <p className="text-[11px] text-green-400 font-bold mt-1">
                              Enviado em{" "}
                              {new Date(proof_uploaded_at).toLocaleString("pt-BR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </p>
                          )}
                        </div>
                        <a
                          href={proof_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="shrink-0 px-4 py-2 rounded-full bg-green-700 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          🔗 Abrir
                        </a>
                      </div>
                      <p className="text-[11px] text-green-400/90 font-bold">
                        Este comprovante será vinculado ao próximo repasse manual lançado. Para
                        trocá-lo, selecione outro arquivo e suba novamente.
                      </p>
                    </div>
                  )}

                  {proofUploadMsg && !proof_url && (
                    <p className="p-4 rounded-2xl bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-semibold">
                      ✅ {proofUploadMsg}
                    </p>
                  )}
                  {proofUploadErr && (
                    <p className="p-4 rounded-2xl bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-semibold">
                      ⚠️ {proofUploadErr}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(actionMsg || actionErr) && (
              <div className="mt-5">
                {actionMsg && (
                  <p className="p-4 rounded-2xl bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-semibold">
                    ✅ {actionMsg}
                  </p>
                )}
                {actionErr && (
                  <p className="mt-2 p-4 rounded-2xl bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-semibold">
                    ⚠️ {actionErr}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111111] rounded-3xl border border-[#222] p-5">
            <h4 className="font-black text-white uppercase tracking-wider text-sm mb-4">
              Resumo do período
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Bruto</span>
                <span className="text-white font-black">{formatBRL(totals.total_gross)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Comissão 15%</span>
                <span className="text-[#FFD000] font-black">
                  {formatBRL(totals.total_commission)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Líquido motoristas</span>
                <span className="text-blue-400 font-black">{formatBRL(totals.total_net)}</span>
              </li>
              <li className="pt-3 mt-2 border-t border-[#222] flex justify-between items-center">
                <span className="text-gray-300 font-semibold">
                  Pendencias Pix a liberar
                </span>
                <span className="text-green-400 font-black">
                  {formatBRL(totals.pending_platform_owes_total)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold">
                  Pendencias comissão a abater
                </span>
                <span className="text-orange-400 font-black">
                  {formatBRL(totals.pending_driver_owes_total)}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#111111] rounded-3xl border border-[#222] p-5">
            <h4 className="font-black text-white uppercase tracking-wider text-sm mb-4">
              Corridas pendentes
            </h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-[#1A1A1A] rounded-2xl animate-pulse"
                  />
                ))}
              {!loading && selectedDriverRows.length === 0 && (
                <p className="text-xs text-gray-500 font-bold text-center py-6">
                  {selectedDriverId
                    ? "Selecione outro período ou não existem corridas para este motorista."
                    : "Selecione um mototaxista para ver suas corridas."}
                </p>
              )}
              {!loading &&
                selectedDriverRows.map((r) => {
                  const ps = paymentStatusLabel(r.payment_status);
                  const ss = settlementStatusLabel(r.settlement_status);
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedSummaryId(r.id);
                        if (r.platform_owes_driver_amount > 0) {
                          setReleaseAmount(r.platform_owes_driver_amount.toFixed(2));
                        }
                        if (r.driver_owes_platform_amount > 0) {
                          setCommissionAmount(r.driver_owes_platform_amount.toFixed(2));
                        }
                      }}
                      className={
                        "w-full text-left rounded-2xl p-3 border transition-colors " +
                        (selectedSummaryId === r.id
                          ? "bg-[#FFD000]/10 border-[#FFD000]"
                          : "bg-[#1A1A1A] border-[#222] hover:border-[#FFD000]/40")
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0">
                          <p className="text-[11px] text-gray-500 font-bold uppercase">
                            {new Date(r.created_at).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-white text-sm font-semibold truncate max-w-[220px]">
                            {r.ride?.origem || r.ride_id.slice(0, 10)}
                          </p>
                        </div>
                        <span className="text-blue-400 font-black text-sm">
                          {formatBRL(r.economic_net_amount)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={
                            "inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded-full border " +
                            ps.cls
                          }
                        >
                          {ps.label}
                        </span>
                        <span
                          className={
                            "inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded-full border " +
                            ss.cls
                          }
                        >
                          {ss.label}
                        </span>
                      </div>
                      {r.platform_owes_driver_amount > 0 && (
                        <p className="mt-2 text-[10px] text-green-400 font-bold">
                          Liberar: {formatBRL(r.platform_owes_driver_amount)}
                        </p>
                      )}
                      {r.driver_owes_platform_amount > 0 && (
                        <p className="mt-2 text-[10px] text-orange-400 font-bold">
                          Abater: {formatBRL(r.driver_owes_platform_amount)}
                        </p>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex fixed inset-0 z-50 bg-black font-sans overflow-hidden w-full h-full text-white">
      {/* Sidebar desktop */}
      <aside className="w-64 bg-[#0A0A0A] text-white hidden md:flex flex-col fixed h-full z-20 border-r border-[#222]">
        <div className="p-6 border-b border-[#222]">
          <img src="/logo.png" alt="MotoSango" className="h-8 object-contain mb-1" />
          <p className="text-xs text-gray-400">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#111111]"
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#111111]"
          >
            🏍️ Mototaxistas
          </button>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#111111]"
          >
            💰 Mensalidades
          </button>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#111111]"
          >
            🚖 Corridas
          </button>
          <button
            className="w-full text-left px-4 py-3 rounded-lg transition-colors bg-[#FFD000] text-black font-bold shadow-[0_0_15px_rgba(255,208,0,0.2)]"
          >
            💸 Financeiro
          </button>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#111111]"
          >
            ⚙️ Configurações
          </button>
        </nav>
        <div className="p-4 border-t border-[#222]">
          <button
            onClick={async () => {
              if (confirm("Deseja realmente sair do painel administrador?")) {
                try {
                  await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
                } catch {}
                localStorage.removeItem("motosango_admin");
                router.push("/");
              }
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full bg-black">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between bg-[#0A0A0A] border border-[#222] text-white p-4 rounded-3xl mb-6 shadow-md">
          <img src="/logo.png" alt="MotoSango Admin" className="h-6 object-contain" />
          <div className="flex items-center gap-2">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as any)}
              className="bg-[#1A1A1A] text-white text-sm rounded-xl px-3 py-2 outline-none border border-[#333]"
            >
              <option value="resumo">📊 Resumo</option>
              <option value="motoristas">🏍️ Por Mototaxista</option>
              <option value="historico">📜 Histórico</option>
              <option value="repasse">💸 Repasse</option>
            </select>
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mb-6 bg-[#111111] rounded-2xl border border-[#222] p-3 space-y-1">
            {[
              { l: "Dashboard", t: undefined },
              { l: "Financeiro", t: null },
            ].map((i) => (
              <button
                key={i.l}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (i.t !== undefined) router.push("/admin/dashboard");
                }}
                className={
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors " +
                  (i.t === null
                    ? "bg-[#FFD000] text-black font-bold"
                    : "text-gray-200 hover:bg-[#1A1A1A]")
                }
              >
                {i.l}
              </button>
            ))}
          </div>
        )}

        <header className="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Financeiro</h2>
            <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-wider">
              Visão geral, por mototaxista, histórico e repasses manuais
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Olá, Admin</span>
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-[#FFD000]">
              👤
            </div>
            <button
              onClick={() => {
                if (confirm("Deseja realmente sair do painel administrador?")) {
                  localStorage.removeItem("motosango_admin");
                  router.push("/");
                }
              }}
              className="md:hidden ml-1 text-red-400 hover:text-red-300 p-2"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Tabs desktop */}
        <div className="hidden md:flex flex-wrap gap-2 mb-6">
          {(
            [
              { k: "resumo", l: "📊 Resumo Financeiro" },
              { k: "motoristas", l: "🏍️ Por Mototaxista" },
              { k: "historico", l: "📜 Histórico Financeiro" },
              { k: "repasse", l: "💸 Repasse ao Mototaxista" },
            ] as { k: typeof tab; l: string }[]
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => {
                setTab(t.k);
                setActionMsg(null);
                setActionErr(null);
              }}
              className={
                "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors " +
                (tab === t.k
                  ? "bg-[#FFD000] text-black border-[#FFD000] shadow-[0_0_15px_rgba(255,208,0,0.2)]"
                  : "bg-[#111111] text-gray-300 border-[#222] hover:border-[#FFD000]/40 hover:text-white")
              }
            >
              {t.l}
            </button>
          ))}
        </div>

        {renderFilterBar()}

        {tab === "resumo" && renderResumo()}
        {tab === "motoristas" && renderPorMotoristas()}
        {tab === "historico" && renderHistorico()}
        {tab === "repasse" && renderRepasse()}
      </main>
    </div>
  );
}
