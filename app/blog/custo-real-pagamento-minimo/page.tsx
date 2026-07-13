import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O custo real dos pagamentos mínimos: o que o seu extrato não mostra — Numrica',
  description:
    'Um saldo de R$5.000 no cartão de crédito, pago apenas no mínimo à taxa do rotativo, pode custar R$10.000 em juros antes de ser quitado. Aqui está a matemática — e o que R$200 a mais por mês realmente fazem.',
  keywords: ['pagamento mínimo cartão', 'juros rotativo cartão de crédito', 'custo pagamento mínimo', 'quitar cartão de crédito'],
  alternates: {
    canonical: 'https://numrica.com/blog/custo-real-pagamento-minimo',
    languages: {
      'pt-BR': 'https://numrica.com/blog/custo-real-pagamento-minimo',
      'en-US': 'https://numrica.com/blog/real-cost-minimum-payments',
    },
  },
  openGraph: {
    title: 'O custo real dos pagamentos mínimos: o que o seu extrato não mostra',
    description:
      'Um saldo de R$5.000 no cartão de crédito, pago apenas no mínimo à taxa do rotativo, pode custar R$10.000 em juros.',
    url: 'https://numrica.com/blog/custo-real-pagamento-minimo',
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
    .bar-label { width: 130px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; }
    .bar-value { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; }
    .bar-extra { font-size: 12px; color: #6b7280; margin-left: 8px; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }`

const articleBody = `<p class="meta">Numrica · Finanças pessoais · 6 min de leitura</p>

<h1>O custo real dos pagamentos mínimos: o que o seu extrato não mostra</h1>

<p>A maioria das pessoas olha para o número errado no extrato do cartão de crédito. O pagamento mínimo parece administrável. Esse número é projetado para parecer administrável — porque um pagamento que você consegue fazer é um pagamento que você vai continuar fazendo, mês após mês, ano após ano, enquanto os juros do rotativo trabalham silenciosamente contra você.</p>

<p>Aqui está o número que realmente importa: um saldo de R$5.000 no cartão de crédito, à taxa de 10% ao mês do crédito rotativo, pago apenas no mínimo de 15% da fatura, custa aproximadamente <strong>R$10.000 em juros</strong> antes de ser quitado. Você toma R$5.000 emprestado e devolve quase R$15.000. Leva cerca de 10 anos. Isso não é exagero — é a estrutura matemática do rotativo brasileiro funcionando exatamente como foi desenhada.</p>

<h2>Como o pagamento mínimo é calculado no Brasil</h2>

<p>No Brasil, o pagamento mínimo da fatura do cartão de crédito é regulamentado: deve ser de no mínimo 15% do valor total da fatura. Na prática, muitos bancos usam 15% do saldo devedor total como base de cálculo, o que inclui tanto o principal quanto os juros acumulados do mês anterior. O detalhe crítico é a taxa do crédito rotativo — a taxa que incide quando você não paga a fatura integral. As taxas do rotativo no Brasil estão entre as mais altas do mundo, chegando a 10%, 12% e até 15% ao mês em algumas instituições financeiras, dependendo do perfil do cliente e do produto.</p>

<p>O mecanismo funciona assim: você tem uma fatura de R$5.000. A taxa de juros do rotativo é 10% ao mês. No primeiro mês, incidem R$500 de juros sobre o saldo. O pagamento mínimo de 15% seria R$750. Você paga R$750, dos quais R$500 cobrem apenas os juros — sobram R$250 para abater o principal. Novo saldo: R$4.750. No segundo mês, a lógica se repete sobre esse saldo menor. À medida que o saldo cai, o pagamento mínimo cai junto. Você continua pagando, o saldo continua caindo, mas devagar o suficiente para que os juros totais se acumulem a um valor próximo ao dobro do que você deve hoje.</p>

<h2>O que pagamentos extras realmente fazem</h2>

<p>Adicionar um valor fixo acima do mínimo todos os meses muda o resultado de forma dramática. Sobre o mesmo saldo de R$5.000 a 10% ao mês:</p>

<div class="chart">
  <div class="chart-title">Total de juros pagos — R$5.000 a 10% ao mês</div>
  <div class="bar-row">
    <div class="bar-label">Mínimo apenas</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:100%; background:#1a1a2e;">
        <span class="bar-value">R$10.000 juros · 10 anos</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">+ R$200/mês</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:37%; background:#22c55e;">
        <span class="bar-value">R$3.700 · 16 meses</span>
      </div>
      <span class="bar-extra" style="position:absolute; left:39%; top:7px;">economiza R$6.300</span>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">+ R$500/mês</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:27.5%; background:#22c55e;">
        <span class="bar-value">R$2.750 · 9 meses</span>
      </div>
      <span class="bar-extra" style="position:absolute; left:29.5%; top:7px;">economiza R$7.250</span>
    </div>
  </div>
</div>

<p>R$200 a mais por mês transforma 10 anos de pagamento em 16 meses e economiza R$6.300 em juros. R$500 a mais elimina a dívida em 9 meses. O ponto crítico: esses não são números aproximados — são o resultado direto de um modelo de amortização aplicado à estrutura real do rotativo. A diferença entre pagar apenas o mínimo e pagar um pouco mais é, literalmente, a diferença entre anos e meses.</p>

<h2>A cascata: o que acontece quando uma dívida desaparece</h2>

<p>Se você tem mais de uma dívida — cartão de crédito, empréstimo pessoal, financiamento — a matemática fica ainda mais poderosa quando você entende o que acontece depois que a primeira é quitada. Quando uma dívida some, o valor do pagamento mínimo não volta para o consumo. Você redireciona para a próxima. Um mínimo de R$750, liberado do cartão de crédito, aplicado sobre um empréstimo pessoal de R$15.000 a 3% ao mês reduz o prazo desse empréstimo em vários meses. Esse pagamento liberado, por sua vez, vai para a próxima conta. A última dívida recebe a força combinada de todos os mínimos que você liberou, mais o valor extra com que você começou. Um problema que parecia ter sete anos pode se resolver em dois ou três.</p>

<p>Essa lógica é o núcleo dos métodos avalanche e bola de neve — dois nomes para o mesmo princípio fundamental: pagamentos concentrados em cascata. A escolha entre os métodos é secundária ao simples ato de calcular os números. A maioria das pessoas não calcula, porque os números são desconfortáveis. Mas saber a data exata em que você vai quitar a dívida é substancialmente menos desconfortável do que ainda estar carregando o mesmo saldo daqui a cinco anos.</p>

<h2>Três coisas para fazer agora</h2>

<p><strong>Pare de tratar o mínimo como o pagamento.</strong> O mínimo é um piso definido pelo banco, não um plano definido por você. Decida quanto você consegue realisticamente pagar por mês — mesmo que sejam R$100 ou R$200 a mais do que o mínimo — e trate esse valor como um compromisso fixo. A taxa do rotativo brasileiro não perdoa hesitação.</p>

<p><strong>Calcule seus números exatos.</strong> Os valores acima usam uma única dívida a uma taxa específica. Sua situação é diferente — saldos diferentes, taxas diferentes, mínimos diferentes. O <a href="https://numrica.com/debt-payoff">planejador de quitação de dívidas da Numrica</a> permite que você insira todas as suas dívidas, escolha uma estratégia (avalanche ou bola de neve), defina um valor extra de pagamento e veja o mês exato em que você ficará livre de dívidas. Leva três minutos e não exige cadastro.</p>

<p><strong>Concentre o pagamento extra em uma dívida de cada vez.</strong> Dividir pagamentos extras entre várias contas desacelera tudo. Escolha uma estratégia, aponte o valor extra para um alvo único e mantenha por 12 meses consecutivos antes de reavaliar. A cascata não começa enquanto a primeira dívida não for quitada — e quitar a primeira dívida exige concentração, não distribuição.</p>

<p>O banco já modelou sua trajetória de pagamentos mínimos. Eles construíram o produto em torno dessa trajetória. O pagamento mínimo não é uma concessão — é um modelo de receita. A boa notícia: o mesmo efeito dos juros compostos que trabalha contra você no mínimo trabalha a seu favor no momento em que você começa a pagar além do mínimo. A matemática não tem lado.</p>

<div class="cta">
  <p>Veja sua data exata de quitação — sem cadastro necessário.</p>
  <a href="https://numrica.com/debt-payoff">→ Abrir o planejador de quitação de dívidas</a>
</div>

<p class="disclaimer">Os resultados são ilustrativos. Taxas do rotativo, pagamentos mínimos e saldos reais variam por instituição e modalidade de crédito. Este artigo é educacional e não constitui aconselhamento financeiro. Consulte um profissional qualificado antes de tomar decisões sobre gestão de dívidas.</p>


<div style="margin:48px 0 0;padding:28px 24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
  <p style="font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin:0 0 16px;font-family:sans-serif;">You might also like</p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/avalanche-vs-bola-de-neve" style="color:#22c55e;text-decoration:underline;font-size:15px;">Avalanche vs Bola de Neve</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/how-to-get-out-of-credit-card-debt" style="color:#22c55e;text-decoration:underline;font-size:15px;">How to Get Out of Credit Card Debt</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/minimum-payment-five-credit-cards" style="color:#22c55e;text-decoration:underline;font-size:15px;">Minimum Payments on Five Credit Cards</a></p>
</div>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>Sobre o autor:</strong> Pedro Roriz é professor de finanças corporativas e contabilidade gerencial no IPOG, uma das maiores escolas de negócios do Brasil, com mais de 15.000 alunos formados. Fundou a TAG Business Solutions em 2016 — empresa de BPO financeiro e CFO-as-a-service com operações no Brasil e em Portugal. É também o criador da Numrica.com.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: 'O custo real dos pagamentos mínimos: o que o seu extrato não mostra',
      description:
        'Um saldo de R$5.000 no cartão de crédito, pago apenas no mínimo à taxa do rotativo, pode custar R$10.000 em juros antes de ser quitado.',
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/custo-real-pagamento-minimo',
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
        knowsAbout: ['finanças corporativas', 'pagamento mínimo', 'rotativo cartão de crédito', 'quitação de dívidas', 'amortização'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/custo-real-pagamento-minimo' },
      translationOfWork: { '@type': 'BlogPosting', url: 'https://numrica.com/blog/real-cost-minimum-payments' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'O custo real dos pagamentos mínimos' },
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
