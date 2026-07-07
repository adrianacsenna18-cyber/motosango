import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // Tenta obter de process.env, útil para produção (Vercel) e fallback no dev local se o Next.js mapear.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jeulwmhsiftstikszoku.supabase.co';
    // Em produção, isso virá de process.env.SUPABASE_SERVICE_ROLE_KEY
    // Para nosso teste local, vamos usar uma string hardcoded temporariamente baseada na chave do projeto (a que não tem RLS).
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_QUb7JP_TwRgxJ9JlMoZMBg_yl-zBvgz';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Erro de configuração do servidor" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { login, senha } = await request.json();

    if (!login || !senha) {
      return NextResponse.json(
        { error: "Login e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("admin")
      .select("login") // Do not select senha or pix_admin here, just verify existence
      .eq("login", login)
      .eq("senha", senha)
      .limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Credenciais incorretas" },
        { status: 401 }
      );
    }

    // Login bem-sucedido, retornamos apenas um objeto seguro
    return NextResponse.json({ 
      success: true, 
      user: { login: data[0].login } 
    });
    
  } catch (error: any) {
    console.error("Erro na API de login do admin:", error.message || error);
    return NextResponse.json(
      { error: "Erro interno do servidor: " + (error.message || "Desconhecido") },
      { status: 500 }
    );
  }
}
