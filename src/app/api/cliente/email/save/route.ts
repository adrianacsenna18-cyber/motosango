import { NextRequest, NextResponse } from 'next/server';
import { requireClienteSession } from '@/lib/cliente-auth';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const sessionResult = await requireClienteSession();
    if (!sessionResult.authorized) {
      return sessionResult.response ?? NextResponse.json(
        { error: 'Sessão inválida ou expirada.' },
        { status: 401 },
      );
    }

    const userId = sessionResult.session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário da sessão inválido.' },
        { status: 401 },
      );
    }

    let body: { email?: unknown };
    try {
      body = (await req.json()) as { email?: unknown };
    } catch {
      return NextResponse.json(
        { error: 'Body JSON inválido.' },
        { status: 400 },
      );
    }

    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    if (!rawEmail) {
      return NextResponse.json(
        { error: 'O e-mail é obrigatório para continuar.' },
        { status: 400 },
      );
    }
    if (!EMAIL_RE.test(rawEmail)) {
      return NextResponse.json(
        { error: 'Informe um e-mail válido.' },
        { status: 400 },
      );
    }

    const email = rawEmail.toLowerCase();

    const admin = getAdminSupabaseClient();
    const { error: updateErr } = await admin
      .from('users')
      .update({ email })
      .eq('id', userId);

    if (updateErr) {
      console.error('[cliente/email/save] Erro ao salvar email:', updateErr.message || updateErr);
      return NextResponse.json(
        { error: 'Não foi possível salvar o e-mail. Tente novamente.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (err: unknown) {
    console.error('[cliente/email/save] Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno ao salvar e-mail.' },
      { status: 500 },
    );
  }
}
