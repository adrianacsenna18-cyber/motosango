import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(request: Request) {
  try {
    // 1. Configurar o Web Push com as chaves VAPID
    const vapidPublicRaw = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateRaw = process.env.VAPID_PRIVATE_KEY;

    const vapidPublic = vapidPublicRaw?.trim();
    const vapidPrivate = vapidPrivateRaw?.trim();

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

    // 3. Buscar todas as inscrições ativas
    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar inscrições', details: error.message }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ 
        error: 'Nenhuma inscrição ativa encontrada para enviar notificação',
      }, { status: 404 });
    }

    // 4. Preparar payload oficial de Nova Corrida
    const payload = JSON.stringify({
      title: '🚨 Nova Corrida!',
      body: 'Você tem uma nova solicitação de corrida!',
      url: '/mototaxista/painel'
    });

    let totalEnviadas = 0;
    let totalErros = 0;
    const detalhes = [];

    // 5. Enviar push para cada inscrição encontrada
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        totalEnviadas++;
        detalhes.push({
          id: sub.id,
          driver_id: sub.driver_id,
          status: 'success'
        });
      } catch (pushError: any) {
        totalErros++;
        const statusCode = pushError.statusCode;
        
        detalhes.push({
          id: sub.id,
          driver_id: sub.driver_id,
          status: 'error',
          statusCode: statusCode,
          message: pushError.message
        });

        // 6. Desativar inscrições expiradas ou revogadas (404 ou 410)
        if (statusCode === 404 || statusCode === 410) {
          await supabaseAdmin
            .from('push_subscriptions')
            .update({ ativo: false })
            .eq('id', sub.id);
        }
      }
    }

    // 7. Retornar relatório
    return NextResponse.json({ 
      success: totalEnviadas > 0, 
      total_encontradas: subscriptions.length,
      total_enviadas: totalEnviadas,
      total_erros: totalErros,
      detalhes: detalhes
    });

  } catch (error: any) {
    console.error('Erro geral no envio do push notify-all:', error);
    return NextResponse.json({ 
      error: 'Falha ao processar notificações', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
