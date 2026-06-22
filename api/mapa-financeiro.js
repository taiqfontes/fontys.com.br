const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = async (req, res) => {
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

    const { dados } = body;

    if (!dados) {
      return res.status(400).json({ error: 'Dados ausentes' });
    }

    const { data, error } = await supabase
      .from('mapa_financeiro_respostas')
      .insert({
        nome: dados.nome || null,
        cpf: dados.cpf || null,
        cidade: dados.cidade || null,
        dados: dados,
        user_agent: req.headers['user-agent'] || null
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Erro ao salvar mapa financeiro' });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro inesperado no servidor' });
  }
};
