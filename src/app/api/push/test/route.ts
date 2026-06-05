import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function GET(request: Request) {
  try {
    // 1. Configurar o Web Push com as chaves VAPID
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY?.trim();

    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json({ error: 'Chaves VAPID não configuradas no servidor' }, { status: 500 });
    }

    webpush.setVapidDetails(
      'mailto:contato@motosango.com.br',
      vapidPublic,
      vapidPrivate
    );

    // 2. Conectar ao Supabase com Service Role para ignorar RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Buscar apenas UMA inscrição ativa para teste
    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar inscrição', details: error.message }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'Nenhuma inscrição ativa encontrada para teste' }, { status: 404 });
    }

    const sub = subscriptions[0];

    // 4. Montar o objeto PushSubscription no formato exigido pela biblioteca
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    };

    // 5. Enviar a notificação push
    const payload = JSON.stringify({
      title: 'MotoSango',
      body: 'Teste de notificação push funcionando.',
      url: '/mototaxista/painel'
    });

    await webpush.sendNotification(pushSubscription, payload);

    return NextResponse.json({ 
      success: true, 
      message: 'Notificação enviada com sucesso!',
      driver_id: sub.driver_id 
    });

  } catch (error: any) {
    console.error('Erro no envio do push:', error);
    return NextResponse.json({ 
      error: 'Falha ao enviar notificação', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}