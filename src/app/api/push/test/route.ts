import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function GET(request: Request) {
  try {
    // 1. Configurar o Web Push com as chaves VAPID
    const vapidPublicRaw = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateRaw = process.env.VAPID_PRIVATE_KEY;

    const vapidPublic = vapidPublicRaw?.trim();
    const vapidPrivate = vapidPrivateRaw?.trim();

    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json({ error: 'Chaves VAPID não configuradas no servidor' }, { status: 500 });
    }

    // DIAGNÓSTICO SEGURO DE CHAVES (ETAPA 14.18)
    return NextResponse.json({
      diagnostico_seguro: true,
      publicKeyLength: vapidPublic.length,
      privateKeyLength: vapidPrivate.length,
      publicKeyStartsWithB: vapidPublic.startsWith('B'),
      privateKeyHasEquals: vapidPrivate.includes('='),
      privateKeyHasSpaces: /\s/.test(vapidPrivateRaw || ''),
      privateKeyFirstChar: vapidPrivate.charAt(0),
      privateKeyLastChar: vapidPrivate.charAt(vapidPrivate.length - 1),
    });

  } catch (error: any) {
    console.error('Erro no envio do push:', error);
    return NextResponse.json({ 
      error: 'Falha ao enviar notificação', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}