const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 
exports.handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { winner1_id, winner2_id, loser1_id, loser2_id, w1_delta, w2_delta, l1_delta, l2_delta, total_points } = body;
 
  const { error: matchErr } = await supabase.from('matches').insert([{
    winner1_id, winner2_id, loser1_id, loser2_id, w1_delta, w2_delta, l1_delta, l2_delta, total_points
  }]);
  if (matchErr) return { statusCode: 500, body: JSON.stringify({ error: matchErr.message }) };
 
  const updates = [
    { id: winner1_id, delta: w1_delta, win: 1, loss: 0 },
    { id: winner2_id, delta: w2_delta, win: 1, loss: 0 },
    { id: loser1_id,  delta: l1_delta, win: 0, loss: 1 },
    { id: loser2_id,  delta: l2_delta, win: 0, loss: 1 }
  ];
 
  for (const u of updates) {
    const { data: p } = await supabase.from('players').select('elo, wins, losses').eq('id', u.id).single();
    if (p) {
      await supabase.from('players').update({
        elo: Number(p.elo) + u.delta,
        wins: (p.wins || 0) + u.win,
        losses: (p.losses || 0) + u.loss
      }).eq('id', u.id);
    }
  }
 
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};