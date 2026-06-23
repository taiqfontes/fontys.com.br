const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = async (req, res) => {
  // CORS básico (mesmo domínio, mas deixamos liberado por segurança de configuração)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const body = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisição inválido' });
    }

    const { nome, perfilDominante, maturidade, saude, respostas } = body;

    const { data, error } = await supabase
      .from('diagnostico_respostas')
      .insert({
        nome: nome || null,
        perfil_dominante: perfilDominante || null,
        maturidade_score: maturidade?.score ?? null,
        maturidade_label: maturidade?.label ?? null,
        saude_score: saude?.score ?? null,
        saude_label: saude?.label ?? null,
        respostas: respostas || {},
        user_agent: req.headers['user-agent'] || null
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Erro ao salvar diagnóstico' });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro inesperado no servidor' });
  }
};
