const { createClient } = require('@supabase/supabase-js');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle
} = require('docx');

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

function humanize(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, c => c.toUpperCase());
}

function fmtDate(d) {
  try { return new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); }
  catch (e) { return String(d); }
}

const NAVY = '0B1F3A';
const GOLD = 'B89B5E';
const SLATE = '586273';

function pTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    spacing: { after: 60 },
    children: [new TextRun({ text, color: NAVY, bold: true })]
  });
}

function pSubtitle(text) {
  return new Paragraph({
    spacing: { after: 300 },
    children: [new TextRun({ text, color: SLATE, size: 22 })]
  });
}

function pHeading(text, level) {
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, color: NAVY, bold: true })]
  });
}

function pKV(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + ': ', bold: true, color: NAVY }),
      new TextRun({ text: (value === null || value === undefined || value === '') ? '—' : String(value) })
    ]
  });
}

function cell(text, opts) {
  opts = opts || {};
  return new TableCell({
    width: { size: opts.width || 50, type: WidthType.PERCENTAGE },
    children: [new Paragraph({ children: [new TextRun({ text: String(text == null ? '—' : text), bold: !!opts.bold, color: opts.bold ? NAVY : undefined })] })],
    shading: opts.header ? { fill: 'E3EBF6' } : undefined
  });
}

// Converte um objeto qualquer (aninhado) em uma lista de elementos docx (paragraphs/tables)
function objectToDocxElements(obj, level) {
  level = level || 1;
  const elements = [];
  if (obj === null || obj === undefined) return elements;

  if (Array.isArray(obj)) {
    if (obj.length === 0) { elements.push(pKV('', '—')); return elements; }
    const allPrimitive = obj.every(o => typeof o !== 'object' || o === null);
    if (allPrimitive) {
      obj.forEach((item, i) => elements.push(pKV('Item ' + (i + 1), item)));
      return elements;
    }
    obj.forEach((item, i) => {
      elements.push(pHeading('Item ' + (i + 1), Math.min(level + 1, 2)));
      elements.push(...objectToDocxElements(item, level + 1));
    });
    return elements;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) { elements.push(pKV('', '—')); return elements; }
    keys.forEach(k => {
      const val = obj[k];
      const label = humanize(k);
      if (val !== null && typeof val === 'object') {
        elements.push(pHeading(label, Math.min(level + 1, 2)));
        elements.push(...objectToDocxElements(val, level + 1));
      } else {
        elements.push(pKV(label, val));
      }
    });
    return elements;
  }

  elements.push(pKV('', obj));
  return elements;
}

function buildDiagnosticoDoc(d) {
  const children = [];
  children.push(pTitle('Diagnóstico Financeiro'));
  children.push(pSubtitle('Fontys Inteligência Financeira  ·  ' + fmtDate(d.created_at)));

  children.push(pHeading('Resumo', 1));
  children.push(pKV('Nome', d.nome));
  children.push(pKV('Perfil dominante', d.perfil_dominante));
  children.push(pKV('Maturidade financeira', (d.maturidade_score != null ? d.maturidade_score + ' pontos' : '—') + (d.maturidade_label ? ' — ' + d.maturidade_label : '')));
  children.push(pKV('Saúde financeira', (d.saude_score != null ? d.saude_score + ' pontos' : '—') + (d.saude_label ? ' — ' + d.saude_label : '')));

  const respostas = d.respostas || {};

  if (respostas.scores) {
    children.push(pHeading('Pontuação por perfil', 1));
    const rows = [new TableRow({ children: [cell('Perfil', { header: true, bold: true }), cell('Pontuação', { header: true, bold: true })] })];
    Object.entries(respostas.scores).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
      rows.push(new TableRow({ children: [cell(humanize(k)), cell(v)] }));
    });
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  }

  if (respostas.resAbertas && Object.keys(respostas.resAbertas).length) {
    children.push(pHeading('Respostas abertas', 1));
    Object.entries(respostas.resAbertas).forEach(([k, v]) => {
      children.push(pKV(humanize(k), v));
    });
  }

  if (respostas.resFechadas && Object.keys(respostas.resFechadas).length) {
    children.push(pHeading('Respostas de múltipla escolha', 1));
    children.push(...objectToDocxElements(respostas.resFechadas, 1));
  }

  return children;
}

function buildMapaDoc(m) {
  const children = [];
  children.push(pTitle('Mapa Financeiro'));
  children.push(pSubtitle('Fontys Inteligência Financeira  ·  ' + fmtDate(m.created_at)));

  children.push(pHeading('Identificação', 1));
  children.push(pKV('Nome', m.nome));
  children.push(pKV('CPF', m.cpf));
  children.push(pKV('Cidade', m.cidade));

  const dados = m.dados || {};
  const jaExibidos = ['nome', 'cpf', 'cidade'];
  const restante = {};
  Object.keys(dados).forEach(k => { if (!jaExibidos.includes(k)) restante[k] = dados[k]; });

  children.push(pHeading('Detalhes completos', 1));
  children.push(...objectToDocxElements(restante, 1));

  return children;
}

module.exports = async (req, res) => {
  if (!checkAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Fontys Admin"');
    res.status(401).send('Autenticacao necessaria.');
    return;
  }

  try {
    const { type, id } = req.query;
    if (!type || !id) {
      res.status(400).send('Parametros ausentes.');
      return;
    }

    let children, filename;

    if (type === 'diagnostico') {
      const { data, error } = await supabase.from('diagnostico_respostas').select('*').eq('id', id).single();
      if (error || !data) { res.status(404).send('Registro nao encontrado.'); return; }
      children = buildDiagnosticoDoc(data);
      filename = 'diagnostico-' + (data.nome || 'fontys').replace(/[^a-zA-Z0-9]+/g, '-') + '.docx';
    } else if (type === 'mapa') {
      const { data, error } = await supabase.from('mapa_financeiro_respostas').select('*').eq('id', id).single();
      if (error || !data) { res.status(404).send('Registro nao encontrado.'); return; }
      children = buildMapaDoc(data);
      filename = 'mapa-financeiro-' + (data.nome || 'fontys').replace(/[^a-zA-Z0-9]+/g, '-') + '.docx';
    } else {
      res.status(400).send('Tipo invalido.');
      return;
    }

    const doc = new Document({
      sections: [{ properties: {}, children }]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    res.status(200).send(buffer);
  } catch (err) {
    console.error('Erro ao gerar docx:', err);
    res.status(500).send('Erro ao gerar o documento.');
  }
};
