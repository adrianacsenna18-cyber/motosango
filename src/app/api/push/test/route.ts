import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverIdParam = searchParams.get('driver_id');

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

    // 3. Buscar inscrições ativas (todas, ou filtradas por driver_id se fornecido)
    let query = supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (driverIdParam) {
      query = query.eq('driver_id', driverIdParam);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar inscrições', details: error.message }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ 
        error: 'Nenhuma inscrição ativa encontrada para teste',
        filtro_driver_id: driverIdParam || 'Nenhum'
      }, { status: 404 });
    }

    // 4. Preparar payload
    const payload = JSON.stringify({
      title: 'MotoSango',
      body: 'Teste de notificação push funcionando.',
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
          user_agent: sub.user_agent,
          status: 'success'
        });
      } catch (pushError: any) {
        totalErros++;
        const statusCode = pushError.statusCode;
        
        detalhes.push({
          id: sub.id,
          driver_id: sub.driver_id,
          user_agent: sub.user_agent,
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
    console.error('Erro no envio do push:', error);
    return NextResponse.json({ 
      error: 'Falha ao enviar notificação', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}