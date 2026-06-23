// Gerado a partir das perguntas do Diagnostico Financeiro (perfil-financeiro/index.html)
// Mantenha sincronizado se as perguntas do formulario mudarem.

const PERFIS = {
  guardiao:     { nome:"Guardião",     crenca:"Dinheiro traz segurança.", forte:"Constrói patrimônio com consistência e dificilmente se endivida.", risco:"Excesso de cautela pode significar oportunidades perdidas e experiências deixadas de lado." },
  hedonista:    { nome:"Hedonista",    crenca:"Eu mereço aproveitar a vida.", forte:"Vive o presente com intensidade e constrói memórias e experiências valiosas.", risco:"Impulsividade e dificuldade em poupar podem levar a um ciclo de endividamento recorrente." },
  estrategista: { nome:"Estrategista", crenca:"Tudo precisa de um plano.", forte:"Organização, disciplina e boa capacidade de execução do que planeja.", risco:"Excesso de controle pode gerar ansiedade quando a realidade escapa do planejado." },
  conquistador: { nome:"Conquistador", crenca:"O dinheiro deve trabalhar para mim.", forte:"Visão estratégica de longo prazo e foco genuíno em crescimento patrimonial.", risco:"Excesso de confiança pode levar à busca por retornos irreais e à subestimação de riscos." },
  sobrevivente: { nome:"Sobrevivente", crenca:"Preciso dar um jeito de chegar ao fim do mês.", forte:"Grande adaptabilidade e resiliência diante de cenários financeiros difíceis.", risco:"Tendência a um ciclo constante de escassez, com pouca margem para planejar o futuro." },
  cuidador:     { nome:"Cuidador",     crenca:"Minha missão é cuidar dos outros.", forte:"Generosidade e senso de responsabilidade com quem ama.", risco:"Sobrecarga financeira e ausência de reserva própria por priorizar sempre terceiros." },
  explorador:   { nome:"Explorador",   crenca:"Dinheiro é uma ferramenta para criar oportunidades.", forte:"Capacidade de gerar riqueza através de criatividade e risco calculado.", risco:"Mistura entre finanças pessoais e do negócio, e exposição a riscos excessivos." },
  desconectado: { nome:"Desconectado", crenca:"Dinheiro não é tão importante.", forte:"Menor nível de estresse relacionado a questões financeiras no dia a dia.", risco:"Falta de controle e maior vulnerabilidade a surpresas financeiras desagradáveis." }
};

const SESSOES = ["S1","S2","S3","S4"];
const NOME_SESSAO = { S1:"Comportamento", S2:"Consciência", S3:"Construção", S4:"Continuidade" };
const DESC_SESSAO = {
  S1: "Como você age com dinheiro no dia a dia.",
  S2: "O que você acredita e sente sobre dinheiro.",
  S3: "Como você organiza sua vida financeira.",
  S4: "Como você pensa o futuro e o patrimônio."
};

const PERGUNTAS = {
  S1: {
    abertas: [
      { texto:"Descreva a última vez que você comprou algo por impulso.", ajuda:"Faz muito tempo ou foi recentemente? O que você comprou? Quanto gastou, aproximadamente?" },
      { texto:"Quando o dinheiro está curto no fim do mês, o que normalmente você faz primeiro?" },
      { texto:"Existe alguém na sua vida que influenciou diretamente a forma como você lida com dinheiro hoje? Como?" }
    ],
    fechadas: [
      { q:"Se você ganhasse sozinho na Mega da Virada (prêmio líquido de aproximadamente R$700 milhões), o que faria com esse dinheiro?", opcoes:[
        {t:"Guardaria a maior parte — imprevistos sempre aparecem", p:"guardiao"},
        {t:"Investiria buscando o melhor retorno possível", p:"conquistador"},
        {t:"Usaria para colocar as contas em dia e respirar", p:"sobrevivente"},
        {t:"Daria mais qualidade de vida para quem amo", p:"cuidador"}
      ]},
      { q:"Quando deseja comprar algo que não estava nos planos:", opcoes:[
        {t:"Compro logo — a vida é curta pra ficar segurando vontade", p:"hedonista"},
        {t:"Espero um pouco pra ver se ainda quero depois", p:"guardiao"},
        {t:"Vejo se cabe no orçamento antes de decidir", p:"estrategista"},
        {t:"Penso se dá pra ganhar dinheiro com isso depois", p:"explorador"}
      ]},
      { q:"Quando recebe seu salário ou sua renda mensal, qual é a primeira coisa que você pensa?", opcoes:[
        {t:"Quanto já consigo guardar ou investir", p:"guardiao"},
        {t:"Quem eu preciso ajudar ou pagar primeiro", p:"cuidador"},
        {t:"Pago tudo no primeiro dia e sobrevivo no cartão até o próximo salário", p:"sobrevivente"},
        {t:"O que eu posso fazer de bom pra mim com esse dinheiro", p:"hedonista"}
      ]},
      { q:"Qual frase mais parece com você no dia a dia com dinheiro?", opcoes:[
        {t:"Sem anotar e organizar, vira bagunça rapidinho", p:"estrategista"},
        {t:"Vivo o presente, o futuro eu resolvo quando chegar", p:"hedonista"},
        {t:"Tô sempre tentando não furar o mês", p:"sobrevivente"},
        {t:"Tô sempre de olho numa forma de ganhar mais", p:"explorador"}
      ]},
      { q:"Quando encontra uma promoção muito boa pra algo que você não estava nem pensando em comprar:", opcoes:[
        {t:"Só compro se já era algo que eu já queria antes", p:"guardiao"},
        {t:"Compro — boa oferta dessas não aparece sempre", p:"hedonista"},
        {t:"Calculo se realmente vale a pena antes de decidir", p:"estrategista"},
        {t:"Penso se dá pra revender ou lucrar com isso depois", p:"conquistador"}
      ]},
      { q:"Quando tem que tomar uma decisão financeira importante com a família:", opcoes:[
        {t:"Penso no que é mais seguro pra todo mundo no futuro", p:"guardiao"},
        {t:"Penso no que vai deixar minha família mais feliz agora", p:"cuidador"},
        {t:"Fico tenso, é muita coisa pra decidir com pouco dinheiro", p:"sobrevivente"},
        {t:"Deixo a outra pessoa decidir, não é muito minha praia", p:"desconectado"}
      ]},
      { q:"Como você costuma terminar o mês?", opcoes:[
        {t:"Sei exatamente pra onde foi cada real", p:"estrategista"},
        {t:"Bem, sempre sobra um pouco pra guardar", p:"guardiao"},
        {t:"No aperto, sempre aparece algo que desorganiza tudo", p:"sobrevivente"},
        {t:"Sem muita noção, não fico de olho de perto", p:"desconectado"}
      ]},
      { q:"Como você decide sobre lazer (viagem, jantar fora, sair com amigos)?", opcoes:[
        {t:"Faço questão de viver bem — vida é pra aproveitar", p:"hedonista"},
        {t:"Só saio depois que as contas tão garantidas", p:"guardiao"},
        {t:"Quase não sobra dinheiro pra esse tipo de coisa", p:"sobrevivente"},
        {t:"Gasto principalmente pra deixar quem eu amo feliz", p:"cuidador"}
      ]}
    ]
  },
  S2: {
    abertas: [
      { texto:"Qual foi a lição mais marcante (boa ou ruim) que sua família te passou sobre dinheiro?" },
      { texto:"Se o dinheiro não fosse um problema, o que mudaria primeiro na sua vida?" },
      { texto:"Como você se sente atualmente em relação às suas dívidas?" }
    ],
    fechadas: [
      { q:"Com qual destes ditados populares sobre dinheiro você mais concorda?", opcoes:[
        {t:"\"Quem guarda, tem.\"", p:"guardiao"},
        {t:"\"Caixão não tem gaveta.\"", p:"hedonista"},
        {t:"\"Grão em grão, a galinha enche o papo.\"", p:"estrategista"},
        {t:"\"Dinheiro chama dinheiro.\"", p:"conquistador"},
        {t:"\"O cobertor é curto.\"", p:"sobrevivente"},
        {t:"\"Dinheiro é bom quando serve para cuidar dos nossos.\"", p:"cuidador"},
        {t:"\"Quem não arrisca, não petisca.\"", p:"explorador"},
        {t:"\"Dinheiro não traz felicidade.\"", p:"desconectado"}
      ]},
      { q:"O que mais te motiva quando pensa em melhorar sua vida financeira?", opcoes:[
        {t:"Ter segurança e nunca depender de ninguém", p:"guardiao"},
        {t:"Ter uma vida boa e poder aproveitar mais", p:"hedonista"},
        {t:"Construir um patrimônio de verdade", p:"conquistador"},
        {t:"Não sentir mais o aperto de não ter dinheiro suficiente", p:"sobrevivente"}
      ]},
      { q:"Quando pensa em pessoas muito ricas, o que vem à cabeça?", opcoes:[
        {t:"Devem ter passado por muita dificuldade até chegar lá", p:"sobrevivente"},
        {t:"Souberam tomar boas decisões e fizeram o dinheiro crescer", p:"conquistador"},
        {t:"Criaram algo do zero e foram além do que todo mundo esperava", p:"explorador"},
        {t:"Não é algo que me chama muito atenção", p:"desconectado"}
      ]},
      { q:"Pra você dormir tranquilo financeiramente, o que mais importa?", opcoes:[
        {t:"Ter uma reserva guardada, longe de qualquer risco", p:"guardiao"},
        {t:"Ter um plano claro e saber que tô seguindo ele", p:"estrategista"},
        {t:"Saber que quem depende de mim tá protegido", p:"cuidador"},
        {t:"Ter uma renda que entra mesmo sem eu trabalhar", p:"conquistador"}
      ]},
      { q:"De onde vem a forma como você lida com dinheiro hoje?", opcoes:[
        {t:"Medo de passar pelas dificuldades que já vivi ou vi de perto", p:"sobrevivente"},
        {t:"Vontade de dar uma vida melhor pra quem eu amo", p:"cuidador"},
        {t:"Exemplos de gente que cresceu e eu quis seguir", p:"conquistador"},
        {t:"Nunca parei muito pra pensar nisso, sinceramente", p:"desconectado"}
      ]},
      { q:"Pensando na sua vida financeira daqui a 10 anos, o que você mais deseja?", opcoes:[
        {t:"Tranquilidade total — sem sustos, sem aperto", p:"guardiao"},
        {t:"Ter liberdade pra viver do meu jeito", p:"hedonista"},
        {t:"Ver meu patrimônio crescendo, ano após ano", p:"conquistador"},
        {t:"Que dinheiro pare de ocupar tanto a minha cabeça", p:"desconectado"}
      ]},
      { q:"Quando alguém próximo passa por uma dificuldade financeira, o que você costuma fazer?", opcoes:[
        {t:"Ajudo, mesmo que isso aperte o meu próprio orçamento", p:"cuidador"},
        {t:"Vejo se realmente tenho como ajudar antes de topar", p:"guardiao"},
        {t:"Queria ajudar, mas minha situação também não tá fácil", p:"sobrevivente"},
        {t:"Prefiro não me meter em dinheiro de outra pessoa", p:"desconectado"}
      ]},
      { q:"O que você mais gostaria de fazer se tivesse mais dinheiro?", opcoes:[
        {t:"Viver experiências que hoje eu não me permito", p:"hedonista"},
        {t:"Garantir o futuro de quem eu amo", p:"cuidador"},
        {t:"Investir pesado e construir patrimônio de verdade", p:"conquistador"},
        {t:"Montar ou expandir um negócio próprio", p:"explorador"}
      ]}
    ]
  },
  S3: {
    abertas: [
      { texto:"O que mais dificulta você manter uma vida financeira organizada? Seja honesto." },
      { texto:"Quais despesas da sua vida hoje são inegociáveis?" },
      { texto:"Se você pudesse mudar uma coisa na sua relação com dívidas ou gastos, o que seria? O que te impede de mudar hoje?" }
    ],
    fechadas: [
      { q:"Como você lida com seu orçamento mensal hoje?", opcoes:[
        {t:"Tenho controle bem detalhado — categorias, limites, revisão", p:"estrategista"},
        {t:"Tenho uma ideia geral e me preocupo em manter uma reserva", p:"guardiao"},
        {t:"Vivo ajustando conforme aparece, raramente sobra margem", p:"sobrevivente"},
        {t:"Não acompanho. Meu cônjuge é quem cuida dessa parte", p:"desconectado"}
      ]},
      { q:"Como você lida (ou lidaria) com uma dívida?", opcoes:[
        {t:"Faço um plano com prazo certo e sigo até quitar", p:"estrategista"},
        {t:"Renegocio pra pesar menos no dia a dia e viver melhor", p:"hedonista"},
        {t:"Vejo se vale trocar por uma dívida mais barata", p:"conquistador"},
        {t:"Vou pagando o que dá, é mais uma coisa pesando na lista", p:"sobrevivente"}
      ]},
      { q:"Qual frase mais parece com você em relação à sua reserva financeira?", opcoes:[
        {t:"Reserva é prioridade — o resto vem depois", p:"guardiao"},
        {t:"Prefiro investir tudo, dinheiro parado não cresce", p:"conquistador"},
        {t:"Mal consigo pensar em reserva com tanta coisa pra pagar", p:"sobrevivente"},
        {t:"Não tenho reserva, nunca foi algo que organizei", p:"desconectado"}
      ]},
      { q:"Sua relação com planilha, app ou qualquer forma de controle financeiro:", opcoes:[
        {t:"Uso com disciplina, gosto de ver os números organizados", p:"estrategista"},
        {t:"Já tentei, mas é difícil manter quando a vida aperta", p:"sobrevivente"},
        {t:"Gosto de testar formas novas de organizar e fazer render", p:"explorador"},
        {t:"Não uso, não é minha praia esse tipo de controle", p:"desconectado"}
      ]},
      { q:"Como estão seus investimentos hoje?", opcoes:[
        {t:"Prefiro algo seguro, mesmo rendendo menos", p:"guardiao"},
        {t:"Tenho uma estratégia com metas e prazos definidos", p:"estrategista"},
        {t:"Busco ativamente opções com retorno maior", p:"conquistador"},
        {t:"Não invisto em nada. Nunca sobra dinheiro pra isso", p:"sobrevivente"}
      ]},
      { q:"Quando você recebe o 13º, um bônus ou algum dinheiro extra, o que costuma fazer?", opcoes:[
        {t:"Vai direto pra reserva ou investimento", p:"guardiao"},
        {t:"Quito dívidas com esse dinheiro", p:"conquistador"},
        {t:"Já tá praticamente gasto antes mesmo de receber", p:"sobrevivente"},
        {t:"Aproveito pra comprar algo que eu quero", p:"hedonista"}
      ]},
      { q:"Como é a relação entre o que você ganha e o que gasta?", opcoes:[
        {t:"Separo uma parte fixa pra quem depende de mim antes de qualquer coisa", p:"cuidador"},
        {t:"Sigo percentuais por categoria pra ser mais eficiente", p:"estrategista"},
        {t:"Tento maximizar o que vai pra investimento", p:"conquistador"},
        {t:"Tenho fontes de renda variadas, então isso muda bastante", p:"explorador"}
      ]},
      { q:"Você sabe exatamente quanto entra e quanto sai da sua vida financeira todo mês?", opcoes:[
        {t:"Sei com precisão, acompanho de forma sistemática", p:"estrategista"},
        {t:"Tenho uma noção geral, o suficiente pra manter a reserva", p:"guardiao"},
        {t:"Não sei exato, e isso me angustia bastante", p:"sobrevivente"},
        {t:"Não sei. Meu cônjuge ou outra pessoa cuida disso", p:"desconectado"}
      ]}
    ]
  },
  S4: {
    abertas: [
      { texto:"O que aconteceria com sua esposa/marido, filhos e demais dependentes financeiramente se você não pudesse mais trabalhar?" },
      { texto:"Existe algum investimento que você sempre quis fazer, mas ainda não fez? O que te impede?" },
      { texto:"Qual é sua visão sobre herança?", ajuda:"Acredita que os filhos merecem receber patrimônio? Devem construir o próprio caminho? Pretende deixar patrimônio ou aproveitar tudo em vida?" }
    ],
    fechadas: [
      { q:"Quando pensa em investir, o que mais pesa na sua decisão?", opcoes:[
        {t:"Segurança — preciso saber que não vou perder o que coloquei", p:"guardiao"},
        {t:"Retorno — quero o melhor rendimento possível", p:"conquistador"},
        {t:"Simplicidade — algo que funcione sem eu ficar acompanhando", p:"desconectado"},
        {t:"Poder criar algo próprio com esse dinheiro", p:"explorador"}
      ]},
      { q:"Sua relação com seguro (vida, saúde, etc.):", opcoes:[
        {t:"Tenho os essenciais, é parte do meu plano", p:"guardiao"},
        {t:"Vejo como parte de uma estratégia maior", p:"estrategista"},
        {t:"Ainda não tenho, sei que devo mas não priorizei", p:"conquistador"},
        {t:"Não tenho. Acho bobagem ou nunca vi necessidade", p:"desconectado"}
      ]},
      { q:"Como você pensa o momento em que vai poder parar de trabalhar?", opcoes:[
        {t:"Construindo reservas que me deem tranquilidade total", p:"guardiao"},
        {t:"Hoje não consigo nem imaginar esse momento", p:"sobrevivente"},
        {t:"Provavelmente vou depender só do INSS ou aposentadoria pública", p:"sobrevivente"},
        {t:"Através de negócios que funcionem sem mim", p:"explorador"}
      ]},
      { q:"O que mais te dá tranquilidade pensando no futuro financeiro?", opcoes:[
        {t:"Saber que quem depende de mim vai estar protegido", p:"cuidador"},
        {t:"Ter um plano claro e estar seguindo ele", p:"estrategista"},
        {t:"Ver meu patrimônio crescendo", p:"conquistador"},
        {t:"Ter fontes de renda diferentes e não depender de uma só coisa", p:"explorador"}
      ]},
      { q:"Pensando em proteção financeira pro longo prazo, você prioriza:", opcoes:[
        {t:"Uma reserva de emergência bem robusta", p:"guardiao"},
        {t:"Diversificar entre diferentes tipos de investimento", p:"estrategista"},
        {t:"Multiplicar capital — ele mesmo se torna a proteção", p:"conquistador"},
        {t:"Não penso muito nisso, vivo mais o agora", p:"desconectado"}
      ]},
      { q:"O que você mais quer construir financeiramente?", opcoes:[
        {t:"Ter certeza de que nada vai me pegar de surpresa", p:"guardiao"},
        {t:"Ver meu patrimônio crescer de forma consistente", p:"conquistador"},
        {t:"Garantir que quem eu amo vai estar bem, mesmo sem mim", p:"cuidador"},
        {t:"Sinceramente, hoje eu só penso em sobreviver o mês", p:"sobrevivente"}
      ]},
      { q:"Qual destas frases mais parece com você em relação ao futuro financeiro?", opcoes:[
        {t:"\"Vai que eu preciso amanhã.\"", p:"guardiao"},
        {t:"\"Eu mereço aproveitar.\"", p:"hedonista"},
        {t:"\"Preciso me organizar melhor.\"", p:"estrategista"},
        {t:"\"Como faço esse dinheiro crescer?\"", p:"conquistador"},
        {t:"\"Preciso fechar esse mês primeiro.\"", p:"sobrevivente"},
        {t:"\"Primeiro resolvo a vida deles.\"", p:"cuidador"},
        {t:"\"Tem alguma oportunidade aqui.\"", p:"explorador"},
        {t:"\"Depois eu vejo isso.\"", p:"desconectado"}
      ]},
      { q:"Hoje, qual destas frases descreve melhor onde você está?", opcoes:[
        {t:"Ainda não comecei, a prioridade agora é estabilizar o básico", p:"sobrevivente"},
        {t:"Estou construindo, dentro de um plano que sigo", p:"estrategista"},
        {t:"Já estou multiplicando ativamente através de investimentos", p:"conquistador"},
        {t:"Tenho negócios e fontes diversas, não dependo de uma coisa só", p:"explorador"}
      ]}
    ]
  }
};

// ============================================================
// MATURIDADE FINANCEIRA (mantido igual)
// ============================================================
const MATURIDADE_PERGUNTAS = [
  { tema:"Orçamento", opcoes:[
    {t:"Não possuo nenhum orçamento", v:0},
    {t:"Tenho uma ideia geral, mas não formalizado", v:5},
    {t:"Tenho um orçamento estruturado e atualizado", v:10}
  ]},
  { tema:"Controle de gastos", opcoes:[
    {t:"Não acompanho meus gastos", v:0},
    {t:"Acompanho esporadicamente", v:5},
    {t:"Acompanho todo mês de forma sistemática", v:10}
  ]},
  { tema:"Reserva de emergência", opcoes:[
    {t:"Não tenho reserva", v:0},
    {t:"Tenho reserva de até 3 meses de gastos", v:5},
    {t:"Tenho reserva de 6 meses ou mais", v:10}
  ]},
  { tema:"Investimentos", opcoes:[
    {t:"Não tenho nada investido", v:0},
    {t:"Tenho alguma aplicação básica (poupança, CDB)", v:5},
    {t:"Tenho uma estratégia de investimento definida", v:10}
  ]},
  { tema:"Planejamento de metas", opcoes:[
    {t:"Não tenho metas financeiras", v:0},
    {t:"Tenho objetivos genéricos em mente", v:5},
    {t:"Tenho metas definidas com valores e prazos", v:10}
  ]},
  { tema:"Proteção financeira", opcoes:[
    {t:"Não tenho seguros ou proteção", v:0},
    {t:"Tenho alguma proteção parcial", v:5},
    {t:"Tenho proteção adequada (vida, saúde, renda)", v:10}
  ]}
];

function getMaturidadeLabel(score) {
  if (score <= 20) return {label:"Caótico", desc:"Sem estrutura financeira. Ponto de partida do processo."};
  if (score <= 40) return {label:"Reativo", desc:"Existe alguma consciência, mas a gestão é emergencial."};
  if (score <= 60) return {label:"Organizado", desc:"Há controle básico, mas falta consistência e estratégia."};
  if (score <= 80) return {label:"Estruturado", desc:"Boa base construída. Próximo passo: otimização e crescimento."};
  return {label:"Patrimonial", desc:"Alta maturidade. Foco em multiplicação e legado."};
}

const SAUDE_PERGUNTAS = [
  { tema:"Capacidade de poupança", q:"Ao final do mês, você costuma:", opcoes:[
    {t:"Ficar no negativo", v:0},
    {t:"Zerar — não sobra nada", v:3},
    {t:"Sobrar algo, mas sem consistência", v:6},
    {t:"Poupar regularmente um valor definido", v:10}
  ]},
  { tema:"Endividamento", q:"Como está sua situação de dívidas hoje?", opcoes:[
    {t:"Tenho dívidas que comprometem mais de 30% da minha renda", v:0},
    {t:"Tenho dívidas, mas está sob controle", v:4},
    {t:"Não tenho dívidas significativas", v:7},
    {t:"Estou completamente livre de dívidas", v:10}
  ]},
  { tema:"Reserva de emergência", q:"Sua reserva de emergência cobre:", opcoes:[
    {t:"Nenhum mês", v:0},
    {t:"Até 1 mês", v:3},
    {t:"2 a 3 meses", v:6},
    {t:"6 meses ou mais", v:10}
  ]},
  { tema:"Patrimônio", q:"Como descreveria seu patrimônio atual?", opcoes:[
    {t:"Não tenho patrimônio", v:0},
    {t:"Tenho bens, mas sem clareza do valor", v:3},
    {t:"Conheço e monitoro meu patrimônio", v:7},
    {t:"Tenho patrimônio crescendo de forma planejada", v:10}
  ]},
  { tema:"Proteção financeira", q:"Você está protegido contra imprevistos financeiros?", opcoes:[
    {t:"Não tenho nenhuma proteção", v:0},
    {t:"Tenho proteção mínima", v:3},
    {t:"Tenho proteção razoável", v:6},
    {t:"Tenho proteção completa e adequada", v:10}
  ]},
  { tema:"Dependência de crédito", q:"Com que frequência usa crédito para fechar o mês?", opcoes:[
    {t:"Frequentemente — é parte da minha rotina", v:0},
    {t:"Às vezes, quando aperta", v:3},
    {t:"Raramente", v:7},
    {t:"Nunca uso crédito para fechar o mês", v:10}
  ]},
  { tema:"Fluxo de caixa", q:"Você sabe exatamente quanto entra e sai na sua vida financeira?", opcoes:[
    {t:"Não faço ideia", v:0},
    {t:"Tenho uma ideia aproximada", v:3},
    {t:"Sei razoavelmente bem", v:7},
    {t:"Sei com precisão, acompanho regularmente", v:10}
  ]}
];

function getSaudeLabel(score) {
  if (score <= 20) return {label:"Crítica", desc:"Situação de alto risco. Intervenção urgente necessária."};
  if (score <= 40) return {label:"Frágil", desc:"Base instável. Alta vulnerabilidade a imprevistos."};
  if (score <= 60) return {label:"Estável", desc:"Situação controlada, mas sem margem de segurança."};
  if (score <= 80) return {label:"Saudável", desc:"Boa situação. Foco em crescimento e proteção."};
  return {label:"Excelente", desc:"Finanças sólidas. Prioridade: otimização e legado."};
}

module.exports = { PERFIS, SESSOES, NOME_SESSAO, PERGUNTAS, MATURIDADE_PERGUNTAS, SAUDE_PERGUNTAS, getMaturidadeLabel, getSaudeLabel };
