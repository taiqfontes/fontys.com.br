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

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  } catch (e) { return d; }
}

// Transforma qualquer objeto em uma lista de definicao (dl) legivel
function renderObject(obj, depth) {
  depth = depth || 0;
  if (obj === null || obj === undefined || obj === '') return '<span class="empty">-</span>';
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '<span class="empty">-</span>';
    return '<div class="obj-array">' + obj.map(function(item, i) {
      return '<div class="arr-item"><div class="arr-idx">#' + (i + 1) + '</div>' + renderObject(item, depth + 1) + '</div>';
    }).join('') + '</div>';
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '<span class="empty">-</span>';
    return '<dl class="obj-dl' + (depth > 0 ? ' nested' : '') + '">' + keys.map(function(k) {
      const label = esc(k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2'));
      return '<dt>' + label + '</dt><dd>' + renderObject(obj[k], depth + 1) + '</dd>';
    }).join('') + '</dl>';
  }
  return '<span>' + esc(obj) + '</span>';
}

function page(diagnosticos, mapas) {
  const diagRows = diagnosticos.map(function(d) {
    return '' +
    '<tr class="data-row"><td>' + esc(fmtDate(d.created_at)) + '</td>' +
    '<td><b>' + (esc(d.nome) || '-') + '</b></td>' +
    '<td>' + (esc(d.perfil_dominante) || '-') + '</td>' +
    '<td>' + (d.maturidade_score != null ? d.maturidade_score : '-') + '</td>' +
    '<td>' + (d.saude_score != null ? d.saude_score : '-') + '</td>' +
    '<td><button class="btn-ver" onclick="toggle(\'d-' + d.id + '\')">Ver detalhes</button> <a class="btn-docx" href="/api/admin-export?type=diagnostico&id=' + d.id + '">Baixar DOCX</a></td></tr>' +
    '<tr class="detail-row" id="d-' + d.id + '" style="display:none"><td colspan="6">' + renderObject(d.respostas) + '</td></tr>';
  }).join('');

  const mapaRows = mapas.map(function(m) {
    return '' +
    '<tr class="data-row"><td>' + esc(fmtDate(m.created_at)) + '</td>' +
    '<td><b>' + (esc(m.nome) || '-') + '</b></td>' +
    '<td>' + (esc(m.cpf) || '-') + '</td>' +
    '<td>' + (esc(m.cidade) || '-') + '</td>' +
    '<td><button class="btn-ver" onclick="toggle(\'m-' + m.id + '\')">Ver detalhes</button> <a class="btn-docx" href="/api/admin-export?type=mapa&id=' + m.id + '">Baixar DOCX</a></td></tr>' +
    '<tr class="detail-row" id="m-' + m.id + '" style="display:none"><td colspan="5">' + renderObject(m.dados) + '</td></tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<title>Fontys - Painel Admin</title>' +
  '<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' +
  '<style>' +
  ':root{--navy:#0B1F3A;--navy-deep:#071427;--gold:#B89B5E;--cream:#F6F4EF;--slate:#586273;--line:rgba(11,31,58,.12);}' +
  '*{box-sizing:border-box;}' +
  'body{margin:0;font-family:Inter,sans-serif;background:var(--cream);color:#1C2430;}' +
  'header{background:var(--navy-deep);color:#fff;padding:24px 28px;}' +
  'header h1{font-family:Fraunces,serif;font-size:22px;margin:0 0 4px;}' +
  'header p{margin:0;color:rgba(255,255,255,.6);font-size:13px;}' +
  '.wrap{max-width:1180px;margin:0 auto;padding:28px;}' +
  '.tabs{display:flex;gap:10px;margin-bottom:20px;}' +
  '.tab-btn{font-family:Inter,sans-serif;font-weight:600;font-size:14px;padding:10px 20px;border-radius:100px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--navy);}' +
  '.tab-btn.active{background:var(--navy);color:#fff;border-color:var(--navy);}' +
  '.panel{display:none;}' +
  '.panel.active{display:block;}' +
  '.count{font-size:13px;color:var(--slate);margin-bottom:14px;}' +
  'input.search{width:100%;max-width:320px;padding:10px 14px;border-radius:10px;border:1px solid var(--line);font-size:14px;margin-bottom:14px;font-family:Inter,sans-serif;}' +
  'table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 0 rgba(11,31,58,.04);}' +
  'thead th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--slate);padding:12px 16px;border-bottom:1px solid var(--line);}' +
  'tbody td{padding:12px 16px;font-size:14px;border-bottom:1px solid var(--line);vertical-align:top;}' +
  '.data-row:hover{background:#fafafa;}' +
  '.btn-ver{font-family:Inter,sans-serif;font-size:12.5px;font-weight:600;color:var(--navy);background:#E3EBF6;border:none;padding:7px 14px;border-radius:100px;cursor:pointer;}' +
  '.btn-docx{font-family:Inter,sans-serif;font-size:12.5px;font-weight:600;color:#1B1404;background:var(--gold);border:none;padding:7px 14px;border-radius:100px;cursor:pointer;text-decoration:none;display:inline-block;}' +
  '.detail-row td{background:#FAFAF7;}' +
  '.obj-dl{display:grid;grid-template-columns:220px 1fr;gap:6px 14px;margin:0;font-size:13px;}' +
  '.obj-dl.nested{margin-top:4px;border-left:2px solid var(--line);padding-left:12px;}' +
  '.obj-dl dt{color:var(--slate);font-weight:600;text-transform:capitalize;}' +
  '.obj-dl dd{margin:0;}' +
  '.arr-item{border:1px solid var(--line);border-radius:8px;padding:10px;margin:6px 0;background:#fff;}' +
  '.arr-idx{font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;margin-bottom:4px;}' +
  '.empty{color:#999;}' +
  '</style></head><body>' +
  '<header><h1>Fontys - Painel Administrativo</h1><p>Respostas do Diagnostico Financeiro e do Mapa Financeiro</p></header>' +
  '<div class="wrap">' +
  '<div class="tabs">' +
  '<button class="tab-btn active" id="tabDiag" onclick="showTab(\'diag\')">Diagnostico Financeiro (' + diagnosticos.length + ')</button>' +
  '<button class="tab-btn" id="tabMapa" onclick="showTab(\'mapa\')">Mapa Financeiro (' + mapas.length + ')</button>' +
  '</div>' +
  '<div class="panel active" id="panelDiag">' +
  '<input class="search" id="searchDiag" placeholder="Buscar por nome..." oninput="filterTable(\'tableDiag\',this.value)">' +
  '<table id="tableDiag"><thead><tr><th>Data</th><th>Nome</th><th>Perfil</th><th>Maturidade</th><th>Saude</th><th></th></tr></thead><tbody>' +
  diagRows + '</tbody></table></div>' +
  '<div class="panel" id="panelMapa">' +
  '<input class="search" id="searchMapa" placeholder="Buscar por nome..." oninput="filterTable(\'tableMapa\',this.value)">' +
  '<table id="tableMapa"><thead><tr><th>Data</th><th>Nome</th><th>CPF</th><th>Cidade</th><th></th></tr></thead><tbody>' +
  mapaRows + '</tbody></table></div>' +
  '</div>' +
  '<script>' +
  'function showTab(t){' +
  'document.getElementById("panelDiag").classList.toggle("active",t==="diag");' +
  'document.getElementById("panelMapa").classList.toggle("active",t==="mapa");' +
  'document.getElementById("tabDiag").classList.toggle("active",t==="diag");' +
  'document.getElementById("tabMapa").classList.toggle("active",t==="mapa");' +
  '}' +
  'function toggle(id){var el=document.getElementById(id);el.style.display = el.style.display==="none"?"table-row":"none";}' +
  'function filterTable(tableId,q){' +
  'q=q.toLowerCase();' +
  'var rows=document.getElementById(tableId).querySelectorAll("tbody tr.data-row");' +
  'rows.forEach(function(r){' +
  'var match = r.innerText.toLowerCase().indexOf(q) !== -1;' +
  'r.style.display = match ? "" : "none";' +
  'var detail = r.nextElementSibling;' +
  'if(detail && detail.classList.contains("detail-row")){ if(!match) detail.style.display="none"; }' +
  '});' +
  '}' +
  '</script>' +
  '</body></html>';
}

module.exports = async (req, res) => {
  if (!checkAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Fontys Admin"');
    res.status(401).send('Autenticacao necessaria.');
    return;
  }

  try {
    const [diagResult, mapaResult] = await Promise.all([
      supabase.from('diagnostico_respostas').select('*').order('created_at', { ascending: false }),
      supabase.from('mapa_financeiro_respostas').select('*').order('created_at', { ascending: false })
    ]);

    if (diagResult.error) console.error('Erro ao buscar diagnosticos:', diagResult.error);
    if (mapaResult.error) console.error('Erro ao buscar mapas:', mapaResult.error);

    const html = page(diagResult.data || [], mapaResult.data || []);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error('Erro inesperado no admin:', err);
    res.status(500).send('Erro ao carregar painel admin.');
  }
};
