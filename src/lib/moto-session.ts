const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const MOTO_SESSION_COOKIE = "motosango_moto_session";
export const MOTO_SESSION_DURATION_SECONDS = 60 * 60 * 12;

export type MotoSessionUser = {
  id: string;
  nome: string;
  telefone: string;
};

export type MotoSessionPayload = {
  user: MotoSessionUser;
  role: "mototaxista";
  iat: number;
  exp: number;
};

function getMotoSessionSecret() {
  return (
    process.env.MOTO_SESSION_SECRET ||
    process.env.CLIENTE_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    ""
  );
}

function toBase64UrlFromBytes(bytes: Uint8Array) {
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function toBase64UrlFromString(value: string) {
  return toBase64UrlFromBytes(encoder.encode(value));
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function importSigningKey() {
  const secret = getMotoSessionSecret();

  if (!secret) {
    throw new Error(
      "MOTO_SESSION_SECRET, CLIENTE_SESSION_SECRET ou ADMIN_SESSION_SECRET não configurado.",
    );
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signValue(value: string) {
  const key = await importSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return toBase64UrlFromBytes(new Uint8Array(signature));
}

export function isMotoSessionConfigured() {
  return Boolean(getMotoSessionSecret());
}

export function getMotoSessionExpiresAt() {
  return new Date(Date.now() + MOTO_SESSION_DURATION_SECONDS * 1000);
}

export async function createMotoSessionToken(user: MotoSessionUser) {
  const expiresAt = getMotoSessionExpiresAt();
  const payload: MotoSessionPayload = {
    user,
    role: "mototaxista",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const encodedPayload = toBase64UrlFromString(JSON.stringify(payload));
  const signature = await signValue(encodedPayload);

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt,
  };
}

export async function verifyMotoSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  try {
    const expectedSignature = await signValue(encodedPayload);

    if (signature !== expectedSignature) {
      return null;
    }

    const rawPayload = decoder.decode(fromBase64Url(encodedPayload));
    const payload = JSON.parse(rawPayload) as MotoSessionPayload;

    if (
      payload.role !== "mototaxista" ||
      !payload.user?.id ||
      !payload.user?.nome ||
      !payload.user?.telefone
    ) {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
