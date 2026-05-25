const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jeulwmhsiftstikszoku.supabase.co', 'sb_publishable_QUb7JP_TwRgxJ9JlMoZMBg_yl-zBvgz');

async function clean() {
  const { data: drivers } = await supabase.from('drivers').select('*');
  if (drivers) {
    for (const d of drivers) {
      const cleanCpf = d.cpf.replace(/\D/g, '');
      const cleanTel = d.telefone.replace(/\D/g, '');
      await supabase.from('drivers').update({ cpf: cleanCpf, telefone: cleanTel }).eq('id', d.id);
    }
  }
  
  const { data: users } = await supabase.from('users').select('*');
  if (users) {
    for (const u of users) {
      const cleanTel = u.telefone.replace(/\D/g, '');
      await supabase.from('users').update({ telefone: cleanTel }).eq('id', u.id);
    }
  }
  console.log('Dados formatados com sucesso!');
}
clean();