const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 
exports.handler = async (event) => {
  const { name } = JSON.parse(event.body || '{}');
  if (!name) return { statusCode: 400, body: JSON.stringify({ error: 'Name is required' }) };
 
  const { error } = await supabase.from('players').insert([{ name, elo: 1000, wins: 0, losses: 0 }]);
  if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};