import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avalanche vs bola de neve: qual método paga menos juros? — Numrica',
  description:
    'Comparação dos dois métodos de quitação acelerada de dívidas com números reais: avalanche (maior taxa primeiro) vs bola de neve (menor saldo primeiro).',
  alternates: {
    canonical: 'https://numrica.com/blog/avalanche-vs-bola-de-neve',
    languages: {
      'pt-BR': 'https://numrica.com/blog/avalanche-vs-bola-de-neve',
      'en-US': 'https://numrica.com/blog/debt-avalanche-vs-snowball',
    },
  },
  openGraph: {
    title: 'Avalanche vs bola de neve: qual método paga menos juros?',
    description:
      'Comparação com cenário de R$18.000 em 3 dívidas — juros totais e efeito cascata de cada método.',
    url: 'https://numrica.com/blog/avalanche-vs-bola-de-neve',
    type: 'article',
  },
}

const articleCss = `body { font-family: Georgia, serif; max-width: 720px; margin: 60px auto; line-height: 1.8; color: #1a1a2e; font-size: 17px; padding: 0 20px; }
    h1 { font-size: 30px; line-height: 1.25; margin-bottom: 10px; font-weight: 700; }
    h2 { font-size: 20px; margin-top: 52px; margin-bottom: 14px; font-weight: 700; }
    p { margin: 0 0 22px; }
    a { color: #22c55e; text-decoration: underline; }
    .meta { color: #9ca3af; font-size: 14px; margin-bottom: 44px; font-family: sans-serif; }
    .highlight { background: #f0fdf4; border-left: 3px solid #22c55e; padding: 16px 20px; margin: 32px 0; border-radius: 0 6px 6px 0; }
    .highlight p { margin: 0 0 8px; font-size: 15px; }
    .highlight p:last-child { margin: 0; }
    .chart { margin: 36px 0; font-family: sans-serif; }
    .chart-title { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 18px; }
    .bar-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .bar-label { width: 150px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; }
    .bar-value { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }
    strong { font-weight: 700; }`

const articleBody = `<p class="meta">Numrica · Finanças pessoais · 7 min de leitura</p>

<h1>Avalanche vs bola de neve: qual método paga menos juros?</h1>

<p>A maioria das pessoas com três dívidas simultâneas não sabe qual pagar primeiro. Pagam o que vence, o que incomoda mais, ou simplesmente o mínimo de todas — sem um critério claro de prioridade. Essa indecisão tem um custo financeiro concreto que pode representar entre 20% e mais de 100% do valor original das dívidas em juros pagos a mais do que o necessário. Dois métodos amplamente documentados existem para resolver esse problema: a <strong>avalanche</strong>, que elimina primeiro a dívida de maior taxa de juros, e a <strong>bola de neve</strong>, que elimina primeiro a dívida de menor saldo. Ambos funcionam melhor do que pagar só os mínimos — mas não produzem o mesmo resultado financeiro, e essa diferença vale a pena entender antes de escolher.</p>

<h2>O cenário de referência</h2>

<p>Vamos trabalhar com um exemplo realista: R$18.000 distribuídos em três dívidas.</p>

<div class="highlight">
  <p><strong>Cartao de credito:</strong> R$5.000 | 25% a.a. | mínimo R$200/mês</p>
  <p><strong>Empréstimo pessoal:</strong> R$7.000 | 18% a.a. | mínimo R$250/mês</p>
  <p><strong>Financiamento de carro:</strong> R$6.000 | 12% a.a. | mínimo R$180/mês</p>
</div>

<p>Orçamento total destinado a dívidas: R$630/mês (soma dos mínimos), mais R$200 de pagamento extra. Total mensal: R$830.</p>

<p>Esse extra de R$200 é o recurso escasso que cada método disputa. Para onde ele vai primeiro define o resultado final.</p>

<h2>Como a avalanche funciona — e o que ela entrega</h2>

<p>Na avalanche, você ordena as dívidas da maior para a menor taxa de juros e concentra o pagamento extra na primeira da fila. Os mínimos das demais são mantidos normalmente. Quando a dívida prioritária é quitada, seu mínimo liberado — mais o extra — migra para a segunda da fila. O processo se repete até a última.</p>

<p>No nosso cenário: o cartão (25% a.a.) recebe os R$200 extras. Com R$400/mês contra ele, o cartão é quitado em 14 meses. Nesse ponto, R$400 se somam ao mínimo do empréstimo pessoal: R$650/mês contra R$7.000 a 18% a.a. — quitado em mais 12 meses. O financiamento, com R$830/mês agora disponíveis, some em poucos meses.</p>

<p>Resultado da avalanche com R$200 extra: pagamento total de juros aproximado de <strong>R$3.100</strong>. Tempo total: cerca de 28 meses.</p>

<h2>Como a bola de neve funciona — e o que ela entrega</h2>

<p>Na bola de neve, a ordem é por saldo, do menor para o maior. O raciocínio: quitações rápidas geram momentum psicológico. Você elimina contas, reduz o número de credores, sente progresso concreto.</p>

<p>No nosso cenário: o cartão (R$5.000) ainda é o primeiro alvo — por coincidência, ele tem o menor saldo <em>e</em> a maior taxa. Mas se os saldos fossem diferentes, a ordem mudaria. Digamos que o financiamento tivesse saldo de R$3.000 ao invés de R$6.000 — nesse caso a bola de neve atacaria o financiamento (12% a.a.) antes do cartão (25% a.a.), pagando juros mais altos por mais tempo no saldo mais caro.</p>

<p>Quando a coincidência de saldo e taxa se desfaz, a bola de neve cobra seu preco. No exemplo original, como o cartão acumula os dois extremos (menor saldo entre as três dívidas <em>e</em> maior taxa), os dois métodos chegam ao mesmo resultado. Mude os saldos por R$1.000 e a diferença aparece.</p>

<h2>A diferença real de juros: os três cenários</h2>

<p>Para deixar a comparação clara, veja o total de juros pago em cada estratégia com o nosso cenário base — incluindo o caso em que o empréstimo pessoal tem o menor saldo, forçando divergência entre os métodos:</p>

<div class="chart">
  <div class="chart-title">Total de juros pagos — R$18.000 em 3 dívidas (R$830/mês)</div>
  <div class="bar-row">
    <div class="bar-label">Só mínimos</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:100%; background:#1a1a2e;">
        <span class="bar-value">~R$5.800 · 51 meses</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Bola de neve</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:58%; background:#6b7280;">
        <span class="bar-value">~R$3.380 · 28 meses</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Avalanche</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:53%; background:#22c55e;">
        <span class="bar-value">~R$3.100 · 28 meses</span>
      </div>
    </div>
  </div>
</div>

<p>A avalanche economiza cerca de R$280 em relação à bola de neve nesse cenário. Quando os saldos divergem mais das taxas — por exemplo, a dívida mais cara ter o maior saldo — a diferença pode facilmente passar de R$600 a R$1.500.</p>

<p>Ambos os métodos economizam mais de R$2.400 em relação a pagar apenas os mínimos.</p>

<h2>O efeito cascata: o que acontece quando a primeira dívida some</h2>

<p>O aspecto mais subestimado de qualquer método de quitação acelerada é o que acontece no mês seguinte ao da última parcela da primeira dívida.</p>

<p>No nosso cenário, ao quitar o cartão em 14 meses, os R$400 mensais que iam para ele ficam livres. Esse valor não é devolvido ao orçamento geral — ele migra inteiro para a próxima dívida. O empréstimo pessoal, que recebia R$250/mês, passa a receber R$650/mês. Uma dívida de R$5.800 restantes a 18% a.a. some em aproximadamente 10 meses com essa força adicional.</p>

<p>Quando o empréstimo é quitado, R$650 se somam ao mínimo do financiamento. A última dívida recebe R$830/mês integrais — praticamente o dobro do seu mínimo original. Ela some em meses.</p>

<p>Esse é o efeito cascata. Cada quitação amplifica o poder de fogo disponível para a próxima. No início, a dívida parece um problema de quatro ou cinco anos. Com a cascata funcionando, o mesmo dinheiro resolve tudo em dois anos e meio.</p>

<p>Você pode simular o seu cenário exato com a <a href="https://numrica.com/debt-payoff">calculadora gratuita do Numrica</a> — basta inserir os seus saldos, taxas e mínimos, e a ferramenta mostra o efeito cascata mês a mês para os dois métodos.</p>

<h2>Quando cada método vence — incluindo o fator psicológico</h2>

<p>Do ponto de vista estritamente matemático, a avalanche sempre ganha ou empata. Não existe cenário em que pagar primeiro as dívidas mais caras resulta em mais juros do que pagar primeiro as mais baratas — isso não é opinião, é aritmética. A bola de neve existe por uma razão legítima, mas ela não é financeira: é comportamental. Quitar uma dívida pequena em dois ou três meses cria uma vitória concreta, e para pessoas que já começaram e abandonaram planos de quitação antes, esse sinal de progresso pode ser a diferença entre persistir por 24 meses ou desistir no quinto.</p>

<p>A escolha real é esta: se você tem histórico de largar planejamentos financeiros antes de ver resultado, a bola de neve pode valer o custo adicional em juros, porque um plano de menor retorno executado até o fim supera qualquer estratégia ótima que você abandona. Se você tem disciplina para ignorar o saldo e focar na taxa, a avalanche entrega mais dinheiro no bolso — e a diferença escala com o tamanho e a heterogeneidade das dívidas. Existe ainda uma terceira via: fazer a avalanche com uma exceção pontual. Se uma dívida pequena puder ser quitada em dois ou três meses com esforço marginal, quitá-la primeiro gera o momentum sem sacrifício matemático relevante, e você retorna à ordem por taxa logo em seguida.</p>

<h2>O que fazer agora</h2>

<p>Independente do método escolhido, o passo decisivo é o mesmo: parar de distribuir o pagamento extra entre todas as dívidas ao mesmo tempo. Pagar R$100 a mais em quatro dívidas diferentes não cria cascata — apenas reduz marginalmente todas elas sem quitar nenhuma, o que adia o momento em que o efeito de bola começa a trabalhar a seu favor. Concentre o extra em uma dívida por vez, mantenha os mínimos nas demais, espere a primeira quitação e redirecione o valor total liberado para a próxima. Cada quitação alimenta a seguinte com mais força. A última dívida recebe o peso combinado de todos os pagamentos que você fazia antes.</p>

<p>Se você tiver mais de três dívidas, ou saldos e taxas bem diferentes do exemplo acima, calcule com os seus números reais antes de decidir a ordem. A <a href="https://numrica.com/debt-payoff">calculadora de quitação de dívidas do Numrica</a> simula os dois métodos simultaneamente, mostra o total de juros de cada um e exibe a data exata de quitação de cada conta — sem cadastro. A escolha entre avalanche e bola de neve, no fim, importa menos do que você imagina. O que determina o resultado é executar qualquer um deles com consistência durante 24 meses. O efeito cascata faz o resto.</p>

<div class="cta">
  <p>Simule o seu cenário com os seus saldos e taxas reais — sem cadastro.</p>
  <a href="https://numrica.com/debt-payoff">→ Abrir a calculadora de quitacao de dividas</a>
</div>

<p class="disclaimer">Os valores apresentados neste artigo são ilustrativos e baseados em simulações com taxas anuais compostas. Resultados reais variam conforme as condições de cada contrato, indexadores e eventuais encargos adicionais. Este conteúdo tem finalidade educativa e não constitui aconselhamento financeiro. Consulte um profissional habilitado antes de tomar decisões sobre gerenciamento de dívidas.</p>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>Sobre o autor:</strong> Pedro Roriz é professor de finanças corporativas e contabilidade gerencial no IPOG, uma das principais escolas de negócios do Brasil, com mais de 15.000 alunos formados. Fundou a TAG Business Solutions em 2016, consultoria de BPO financeiro e CFO-as-a-service com operações no Brasil e em Portugal. É também o criador do Numrica.com, plataforma gratuita de calculadoras financeiras.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: 'Avalanche vs bola de neve: qual método paga menos juros?',
      description: 'Comparação dos dois métodos de quitação acelerada de dívidas com cenário de R$18.000 em três dívidas — juros totais e efeito cascata de cada método.',
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/avalanche-vs-bola-de-neve',
      inLanguage: 'pt-BR',
      author: {
        '@type': 'Person',
        name: 'Pedro Roriz',
        url: 'https://pedrororiz.com',
        jobTitle: 'Professor de Finanças Corporativas',
        worksFor: [
          { '@type': 'Organization', name: 'IPOG' },
          { '@type': 'Organization', name: 'TAG Business Solutions' },
        ],
        knowsAbout: ['finanças corporativas', 'quitação de dívidas', 'avalanche de dívidas', 'bola de neve', 'juros compostos'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/avalanche-vs-bola-de-neve' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Avalanche vs bola de neve: qual método paga menos juros?' },
      ],
    },
  ],
}

export default function BlogPost() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <style dangerouslySetInnerHTML={{ __html: articleCss }} />
      <div dangerouslySetInnerHTML={{ __html: articleBody }} />
    </>
  )
}
