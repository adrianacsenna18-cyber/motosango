import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { driver_id, subscription } = await request.json();

    if (!driver_id || !subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Usar a Service Role Key para ignorar RLS e inserir com segurança
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { keys, endpoint } = subscription;

    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({
        driver_id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: request.headers.get('user-agent') || 'unknown',
        ativo: true
      }, {
        onConflict: 'endpoint' // Atualiza se o endpoint já existir
      });

    if (error) {
      console.error('Erro ao salvar inscrição no Supabase:', error);
      return NextResponse.json({ error: 'Erro ao salvar no banco de dados' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro geral na API subscribe:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}