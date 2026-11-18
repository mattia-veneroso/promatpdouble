const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 
exports.handler = async () => {
  const { data: players, error: pErr } = await supabase.from('players').select('*').order('elo', { ascending: false });
  const { data: matches, error: mErr } = await supabase.from('matches').select('*').order('created_at', { ascending: false }).limit(50);
 
  if (pErr || mErr) return { statusCode: 500, body: JSON.stringify({ error: (pErr || mErr).message }) };
  return { statusCode: 200, body: JSON.stringify({ players, matches }) };
};