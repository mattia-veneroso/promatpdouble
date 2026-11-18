const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 
exports.handler = async (event) => {

  const { action, id, password } = JSON.parse(event.body || '{}');

  if (password !== process.env.ADMIN_PASSWORD) {

    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid owner password' }) };

  }
 
  if (action === 'deletePlayer') {

    const { error } = await supabase.from('players').delete().eq('id', id);

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

  }
 
  return { statusCode: 200, body: JSON.stringify({ success: true }) };

};

 