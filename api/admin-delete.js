const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

function checkAuth(req) {
  const auth = req.headers['authorization'] || '';
  const user = process.env.ADMIN_USER || '';
  const pass = process.env.ADMIN_PASSWORD || '';
  const expected = 'Basic ' + Buffer.from(user + ':' + pass).toString('base64');
  return auth === expected;
}

module.exports = async (req, res) => {
  if (!checkAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Fontys Admin"');
    res.status(401).json({ error: 'Autenticacao necessaria.' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo nao permitido' });
    return;
  }

  try {
    const { type, id } = req.body || {};
    if (!type || !id) {
      res.status(400).json({ error: 'Parametros ausentes' });
      return;
    }

    const table = type === 'diagnostico' ? 'diagnostico_respostas'
                : type === 'mapa' ? 'mapa_financeiro_respostas'
                : null;

    if (!table) {
      res.status(400).json({ error: 'Tipo invalido' });
      return;
    }

    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      console.error('Erro ao apagar:', error);
      res.status(500).json({ error: 'Erro ao apagar o registro' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro inesperado ao apagar:', err);
    res.status(500).json({ error: 'Erro inesperado no servidor' });
  }
};
