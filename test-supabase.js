const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jeulwmhsiftstikszoku.supabase.co', 'sb_publishable_QUb7JP_TwRgxJ9JlMoZMBg_yl-zBvgz');

async function test() {
  const { data, error } = await supabase.from('admin').select('*');
  console.log('Admin fetch result:', { data, error });
}
test();