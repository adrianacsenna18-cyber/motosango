'use client';

import { useEffect, useMemo, useState } from 'react';

export type MercadoPagoPixBoxData = {
  mp_payment_id?: string | null;
  mp_status?: string | null;
  mp_status_detail?: string | null;
  mp_external_reference?: string | null;
  qr_code_base64?: string | null;
  qr_code_text?: string | null;
  pix_expires_at_iso?: string | null;
  is_expired?: boolean;
  created_at_iso?: string | null;
};

type Props = {
  data: MercadoPagoPixBoxData;
};

function formatExpirationLabel(expiresAtIso: string | null | undefined, isExpired?: boolean): string {
  if (isExpired) return 'Expirado';
  if (!expiresAtIso) return '';
  const date = new Date(expiresAtIso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date.toLocaleString();
  }
}

function useRemainingCountdown(expiresAtIso: string | null | undefined): {
  expired: boolean;
  label: string;
} {
  const baseResult = useMemo(() => {
    if (!expiresAtIso) return { expired: true, label: '' };
    const target = new Date(expiresAtIso).getTime();
    if (Number.isNaN(target)) return { expired: true, label: '' };
    return { expired: false, target };
  }, [expiresAtIso]);

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (baseResult.expired) return;
    const target = baseResult.target as number;
    if (now >= target) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [baseResult, now]);

  return useMemo(() => {
    if (baseResult.expired) return { expired: true, label: '' };
    const target = baseResult.target as number;
    const diffMs = target - now;
    if (diffMs <= 0) return { expired: true, label: '' };
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const padded = (n: number) => String(n).padStart(2, '0');
    if (hours > 0) {
      return { expired: false, label: `${padded(hours)}:${padded(minutes)}:${padded(seconds)}` };
    }
    return { expired: false, label: `${padded(minutes)}:${padded(seconds)}` };
  }, [baseResult, now]);
}

export function MercadoPagoPixBox({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const countdown = useRemainingCountdown(data.pix_expires_at_iso);
  const expired = Boolean(data.is_expired) || countdown.expired;
  const expirationLabel = formatExpirationLabel(data.pix_expires_at_iso, expired);

  const status = (data.mp_status || '').toLowerCase();
  const isApproved = status === 'approved' || status === 'accredited';

  const handleCopy = async () => {
    if (!data.qr_code_text) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.qr_code_text);
      } else {
        const el = document.createElement('textarea');
        el.value = data.qr_code_text;
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(el);
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const qrSrc = data.qr_code_base64
    ? data.qr_code_base64.startsWith('data:')
      ? data.qr_code_base64
      : `data:image/png;base64,${data.qr_code_base64}`
    : null;

  return (
    <div className="w-full rounded-xl border border-primary/70 bg-primary dark:bg-primary p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-black tracking-wide uppercase">
            Pagamento Pix
          </h3>
          <p className="text-xs text-black/70">
            {isApproved
              ? 'Pagamento recebido.'
              : expired
                ? 'O prazo para pagamento expirou.'
                : 'Escaneie o QR Code ou copie o código abaixo.'}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            isApproved
              ? 'bg-green-100 text-green-700'
              : expired
                ? 'bg-red-100 text-red-700'
                : 'bg-black text-white'
          }`}
        >
          {isApproved ? 'PAGO' : expired ? 'EXPIRADO' : 'PENDENTE'}
        </span>
      </div>

      {qrSrc && !expired && (
        <div className="flex justify-center mb-3">
          <div className="bg-primary p-3 rounded-xl shadow-sm border border-black/10">
            <img
              src={qrSrc}
              alt="QR Code Pix Mercado Pago"
              width={200}
              height={200}
              className="w-44 h-44 object-contain"
            />
          </div>
        </div>
      )}

      {data.qr_code_text && !expired && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs text-black/80 bg-white/60 rounded-md p-2 border border-black/10 break-all">
            <span className="font-semibold shrink-0 mt-0.5">Pix copia e cola:</span>
            <span className="font-mono leading-relaxed">{data.qr_code_text}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold px-6 py-2.5 hover:bg-black/90 active:bg-black/95 transition"
          >
            {copied ? 'Copiado!' : 'Copiar código Pix'}
          </button>
        </div>
      )}

      {expirationLabel && (
        <div className="mt-3 text-[11px] text-black/70 flex items-center justify-between">
          <span>Validade:</span>
          <span className="font-medium">
            {expirationLabel}
            {!expired && countdown.label ? ` (${countdown.label})` : ''}
          </span>
        </div>
      )}
    </div>
  );
}

export default MercadoPagoPixBox;
