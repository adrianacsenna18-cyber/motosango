import { NextResponse } from 'next/server';
import { isMercadoPagoPixAutomationEnabled } from '@/lib/financeiro/payments';

export async function GET() {
  return NextResponse.json({
    enabled: isMercadoPagoPixAutomationEnabled(),
  });
}
