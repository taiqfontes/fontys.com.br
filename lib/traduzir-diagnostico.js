const {
  PERFIS, NOME_SESSAO, PERGUNTAS, MATURIDADE_PERGUNTAS, SAUDE_PERGUNTAS
} = require('./perguntas-diagnostico.js');

// Traduz a chave "S1-0" (resAbertas/resFechadas) em { sessao, pergunta }
function lookupSessaoPergunta(key, tipo) {
  const [sessao, idxStr] = key.split('-');
  const idx = parseInt(idxStr, 10);
  const bloco = PERGUNTAS[sessao];
  if (!bloco) return { sessaoNome: sessao, pergunta: key, item: null };
  const item = tipo === 'abertas' ? (bloco.abertas || [])[idx] : (bloco.fechadas || [])[idx];
  const sessaoNome = NOME_SESSAO[sessao] || sessao;
  const pergunta = item ? (item.texto || item.q || key) : key;
  return { sessaoNome, pergunta, item };
}

// Retorna uma lista de { grupo, pergunta, resposta } pronta pra exibir/exportar
function traduzirRespostasDiagnostico(respostas) {
  respostas = respostas || {};
  const linhas = [];

  Object.entries(respostas.resAbertas || {}).forEach(([key, valor]) => {
    const { sessaoNome, pergunta } = lookupSessaoPergunta(key, 'abertas');
    linhas.push({ grupo: sessaoNome, pergunta, resposta: valor || '(não respondido)' });
  });

  Object.entries(respostas.resFechadas || {}).forEach(([key, idxResposta]) => {
    const { sessaoNome, pergunta, item } = lookupSessaoPergunta(key, 'fechadas');
    const opcao = item && item.opcoes ? item.opcoes[idxResposta] : null;
    linhas.push({ grupo: sessaoNome, pergunta, resposta: opcao ? opcao.t : '(não respondido)' });
  });

  Object.entries(respostas.resMaturidade || {}).forEach(([idx, idxResposta]) => {
    const item = MATURIDADE_PERGUNTAS[parseInt(idx, 10)];
    if (!item) return;
    const opcao = item.opcoes[idxResposta];
    linhas.push({ grupo: 'Maturidade Financeira', pergunta: item.tema, resposta: opcao ? opcao.t : '(não respondido)' });
  });

  Object.entries(respostas.resSaude || {}).forEach(([idx, idxResposta]) => {
    const item = SAUDE_PERGUNTAS[parseInt(idx, 10)];
    if (!item) return;
    const opcao = item.opcoes[idxResposta];
    linhas.push({ grupo: 'Saúde Financeira', pergunta: item.q || item.tema, resposta: opcao ? opcao.t : '(não respondido)' });
  });

  return linhas;
}

function nomePerfil(codigo) {
  if (!codigo) return null;
  const p = PERFIS[codigo];
  return p ? p.nome : codigo;
}

module.exports = { traduzirRespostasDiagnostico, nomePerfil };
