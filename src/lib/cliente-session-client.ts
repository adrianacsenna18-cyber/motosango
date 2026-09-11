export type ClienteSessionUser = {
  id: string;
  nome: string;
  telefone: string;
};

const LEGACY_CLIENT_STORAGE_KEY = "motosango_user";

export function syncClienteLegacyStorage(user: ClienteSessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(LEGACY_CLIENT_STORAGE_KEY, JSON.stringify(user));
}

export function clearClienteLegacyStorage() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_CLIENT_STORAGE_KEY);
}

export async function fetchClienteSession() {
  const response = await fetch("/api/cliente/session", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data?.success || !data.user?.id) {
    return null;
  }

  return data.user as ClienteSessionUser;
}
