export type MotoSessionDriver = {
  id: string;
  nome: string;
  telefone: string;
  foto_base64?: string | null;
  modelo_moto?: string | null;
  placa?: string | null;
  chave_pix?: string | null;
  cpf?: string | null;
  status_online?: boolean | null;
  aprovado_admin?: boolean | null;
  bloqueado_mensalidade?: boolean | null;
  status_plano?: string | null;
  pagamento_em_analise?: boolean | null;
  vencimento_mensalidade?: string | null;
  vencimento_plano?: string | null;
  mensalidade_valor?: number | null;
};

const LEGACY_MOTO_STORAGE_KEY = "motosango_driver";

export function syncMotoLegacyStorage(driver: MotoSessionDriver) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(LEGACY_MOTO_STORAGE_KEY, JSON.stringify(driver));
}

export function clearMotoLegacyStorage() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_MOTO_STORAGE_KEY);
}

export async function fetchMotoSession() {
  const response = await fetch("/api/mototaxista/session", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data?.success || !data.driver?.id) {
    return null;
  }

  return data.driver as MotoSessionDriver;
}
