import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Euribor variável vs taxa fixa: simulação real de 20 anos — Numrica',
  description:
    'Simulação de crédito habitação de 200.000 euros a 30 anos: taxa variável (Euribor + spread) vs taxa fixa, com 4 cenários de Euribor e ponto de equilíbrio.',
  alternates: {
    canonical: 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa',
    languages: {
      'pt-PT': 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa',
      'en-US': 'https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage',
    },
  },
  openGraph: {
    title: 'Euribor variável vs taxa fixa: simulação real de 20 anos',
    description: 'Qual custa menos em 30 anos? Simulação com €200k e 4 cenários Euribor.',
    url: 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa',
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
    .table-wrap { overflow-x: auto; margin: 32px 0; }
    table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; }
    thead th { background: #1a1a2e; color: #fff; padding: 10px 14px; text-align: left; font-weight: 600; }
    tbody tr:nth-child(even) { background: #f8f9fb; }
    tbody td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; color: #374151; }
    tbody td:first-child { font-weight: 600; color: #1a1a2e; }
    .row-highlight td { background: #f0fdf4 !important; }
    .chart { margin: 36px 0; font-family: sans-serif; }
    .chart-title { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 18px; }
    .bar-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .bar-label { width: 170px; font-size: 13px; color: #6b7280; flex-shrink: 0; text-align: right; }
    .bar-track { flex: 1; background: #f3f4f6; border-radius: 4px; height: 28px; position: relative; }
    .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 10px; }
    .bar-value { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; }
    .cta { background: #1a1a2e; color: #fff; padding: 26px 28px; border-radius: 10px; margin: 48px 0; }
    .cta p { color: #d1d5db; margin: 0 0 14px; font-size: 15px; font-family: sans-serif; }
    .cta a { color: #22c55e; font-weight: bold; font-size: 15px; }
    .disclaimer { color: #9ca3af; font-size: 13px; font-family: sans-serif; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    em { font-style: italic; }
    strong { font-weight: 700; }`

const articleBody = `<p class="meta">Numrica · Crédito habitação · 8 min de leitura</p>

<h1>Euribor variável vs taxa fixa: simulação real de 20 anos</h1>

<p>A maioria das pessoas escolhe o tipo de taxa do crédito habitação com base na prestação do primeiro mês. Quando a Euribor está baixa, a taxa variável parece obviamente melhor. Quando está alta, a taxa fixa ganha por defeito. O problema é que essa lógica ignora os vinte ou trinta anos que se seguem — e o histórico da Euribor mostra que ela não fica parada.</p>

<p>Entre 2022 e 2024, a Euribor a 6 meses subiu de valores negativos para perto de 4%. Quem assinou um crédito habitação em 2021 com Euribor a -0,5% viu a sua prestação aumentar em 400 a 600 euros mensais em menos de dois anos. Quem tinha taxa fixa a 1,8% dormiu tranquilo.</p>

<p>A questão real não é qual taxa é mais baixa hoje. É qual taxa custa menos ao longo de toda a vida do crédito — e isso depende de quanto a Euribor vai subir, ficar ou descer nos próximos vinte anos. Como ninguém sabe, a decisão racional passa por simular os cenários antes de assinar.</p>

<h2>O cenário de referência</h2>

<div class="highlight">
  <p><strong>Montante:</strong> 200.000 euros</p>
  <p><strong>Prazo:</strong> 30 anos</p>
  <p><strong>Taxa variável:</strong> Euribor 6m + spread de 1% (total efectivo depende da Euribor corrente)</p>
  <p><strong>Taxa fixa:</strong> 3,5% ao ano — prestação constante durante todo o prazo</p>
</div>

<p>Com taxa fixa a 3,5%, a prestação mensal é de <strong>898 euros</strong> durante 360 meses. Total pago: 323.280 euros. Juros totais: 123.280 euros. Sem surpresas.</p>

<p>Com taxa variável, a prestação depende da Euribor em cada período de revisão (a 6 meses, neste exemplo). Para simular correctamente, é necessário escolher um cenário de Euribor para os próximos 30 anos — e isso não existe. O que existe são três cenários plausíveis.</p>

<h2>Os três cenários da Euribor — e o que cada um significa para a sua prestação</h2>

<p>Para cada cenário abaixo, o spread é 1%. A prestação variável é calculada com base na taxa total (Euribor + spread) aplicada ao capital em dívida naquele momento.</p>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Cenário Euribor 6m</th>
        <th>Taxa total</th>
        <th>Prestacao mensal</th>
        <th>Juros totais (30 anos)</th>
        <th>vs taxa fixa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2,0% (Euribor baixa)</td>
        <td>3,0%</td>
        <td>843 euros</td>
        <td>~103.500 euros</td>
        <td>Poupa ~19.800 euros</td>
      </tr>
      <tr class="row-highlight">
        <td>2,5% (Euribor moderada)</td>
        <td>3,5%</td>
        <td>898 euros</td>
        <td>~123.300 euros</td>
        <td>Empate</td>
      </tr>
      <tr>
        <td>3,0% (Euribor elevada)</td>
        <td>4,0%</td>
        <td>955 euros</td>
        <td>~143.800 euros</td>
        <td>Paga +20.500 euros</td>
      </tr>
      <tr>
        <td>3,5% (Euribor muito alta)</td>
        <td>4,5%</td>
        <td>1.013 euros</td>
        <td>~164.700 euros</td>
        <td>Paga +41.400 euros</td>
      </tr>
    </tbody>
  </table>
</div>

<p>O ponto de equilíbrio está precisamente na Euribor a 2,5% com spread de 1% — que iguala a taxa fixa de 3,5%. Abaixo desse nível, a variável vence. Acima, perde. A linha de corte é simples de calcular: <em>se a Euribor média ao longo da vida do crédito for inferior a (taxa fixa menos spread), a variável ganha.</em></p>

<h2>O ponto de inflexão: quando a taxa fixa se torna mais barata</h2>

<p>O erro mais comum na comparação de taxas é olhar apenas para o momento da contratação. A taxa fixa parece mais cara quando a Euribor está baixa porque, nesse momento, ela está acima da taxa variável corrente. Mas a prestação fixa não muda. A variável, sim.</p>

<p>No ciclo 2022–2024, a Euribor a 6 meses passou de -0,5% para 3,9% em menos de 24 meses. Um crédito contratado em 2020 com Euribor + 1% tinha taxa efectiva de 0,5% — prestação de cerca de 570 euros por cada 200.000 euros a 30 anos. Em 2023, o mesmo crédito tinha taxa efectiva de 4,9% — prestação de cerca de 1.060 euros. Uma diferença de 490 euros mensais, ou 5.880 euros por ano.</p>

<p>Quem tivesse contratado taxa fixa a 2,5% em 2020 pagava uma prestação de 790 euros — mais cara no início, mas estável durante todo o ciclo de subida. O breakeven em relação à variável aconteceu algures em 2022, quando a Euribor ultrapassou 1,5%.</p>

<p>Visualmente, a comparação fica clara:</p>

<div class="chart">
  <div class="chart-title">Juros totais pagos em 30 anos — 200.000 euros (taxa fixada vs Euribor + 1%)</div>
  <div class="bar-row">
    <div class="bar-label">Euribor media 3,5%</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:100%; background:#dc2626;">
        <span class="bar-value">~164.700 euros · variavel</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Euribor media 3,0%</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:87%; background:#f97316;">
        <span class="bar-value">~143.800 euros · variavel</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Taxa fixa 3,5%</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:75%; background:#1a1a2e;">
        <span class="bar-value">~123.300 euros · fixo</span>
      </div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Euribor media 2,0%</div>
    <div class="bar-track">
      <div class="bar-fill" style="width:63%; background:#22c55e;">
        <span class="bar-value">~103.500 euros · variavel</span>
      </div>
    </div>
  </div>
</div>

<h2>O que a simulacao nao consegue capturar — e o que voce deve considerar</h2>

<p>Nenhuma simulação prevê a Euribor com precisão. O que a simulação faz é tornar explícito o custo de cada aposta. Se contratar taxa variável, está implicitamente a apostar que a Euribor média dos próximos 30 anos ficará abaixo do valor que torna a fixa equivalente. Se contratar taxa fixa, está a pagar um prémio de previsibilidade — e a eliminar o risco de subidas expressivas.</p>

<p>Há outros factores que a prestação mensal não reflecte directamente:</p>

<p><strong>Capacidade de absorver variação.</strong> Uma subida de 300 euros mensais na prestação é insuportável para quem tem margem de poupança reduzida. A taxa fixa elimina esse risco, independentemente do cenário de juros. Para famílias com endividamento próximo do limite do Banco de Portugal (taxa de esforço máxima de 40%), a previsibilidade tem valor financeiro real.</p>

<p><strong>Portabilidade e amortizacao antecipada.</strong> A lei portuguesa permite amortizar antecipadamente crédito habitação com comissão limitada (0,5% para taxa variável, 2% para taxa fixa em período de vigência). Se tenciona amortizar parcialmente ao longo do crédito — com herança, poupança acumulada, venda de activo — a taxa variável tem menor penalização.</p>

<p><strong>Renegociacao e transferencia.</strong> Créditos com taxa variável são habitualmente mais fáceis de transferir entre bancos, porque o spread é o componente negociável. Com taxa fixa, a penalização de amortização antecipada pode travar a transferência nos primeiros anos.</p>

<h2>Como usar a calculadora para simular os seus numeros</h2>

<p>Os valores acima são representativos, mas o seu crédito tem parâmetros diferentes: montante, prazo, spread negociado, MTIC. A <a href="https://numrica.com/mortgage-calculator">calculadora de hipoteca do Numrica</a> é gratuita e permite simular diferentes cenários com os vossos números reais — comparando prestação mensal, total de juros e impacto de amortizações extraordinárias em segundos, sem necessidade de registo.</p>

<p>O exercício útil não é tentar adivinhar a Euribor. É calcular qual o nível médio de Euribor a partir do qual a taxa fixa oferecida pelo vosso banco se torna mais barata — e decidir se consideram esse nível provável ou improvável nos próximos 20 a 30 anos.</p>

<h2>A decisão racional</h2>

<p>Não existe resposta universalmente certa entre taxa variável e taxa fixa. O que existe é uma análise que a maioria das pessoas não faz antes de assinar.</p>

<p>Se a Euribor média ao longo da vida do crédito ficar abaixo de (taxa fixa oferecida menos o vosso spread), a variável sai mais barata. Se ficar acima, a fixa ganha. O ponto de equilíbrio é calculável em segundos. O histórico da Euribor desde 1999 inclui períodos de 0% e períodos perto de 5% — ambos os cenários aconteceram dentro da janela temporal de um único crédito habitação a 30 anos.</p>

<p>Contratar taxa fixa é comprar seguro contra a subida da Euribor. Contratar taxa variável é aceitar esse risco em troca de potencial poupança. Nenhuma das duas é errada. O erro é não saber exactamente quanto está a pagar por esse seguro — ou quanto está a arriscar ao não o contratar.</p>

<div class="cta">
  <p>Simule o seu crédito habitação com os vossos números exactos — sem registo.</p>
  <a href="https://numrica.com/mortgage-calculator">→ Abrir a calculadora de hipoteca</a>
</div>

<p class="disclaimer">Os valores apresentados são ilustrativos e calculados com base em amortização francesa (prestação constante), sem considerar seguros obrigatórios, MTIC ou outros encargos associados ao crédito habitação. A Euribor é uma taxa de referência sujeita a variação. Este artigo tem finalidade informativa e não constitui aconselhamento financeiro ou recomendação de produto bancário. Consulte o vosso banco e/ou um intermediário de crédito autorizado pelo Banco de Portugal antes de tomar decisões.</p>


<div style="margin:48px 0 0;padding:28px 24px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
  <p style="font-size:14px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin:0 0 16px;font-family:sans-serif;">You might also like</p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/variable-rate-vs-fixed-rate-mortgage" style="color:#22c55e;text-decoration:underline;font-size:15px;">Variable Rate vs Fixed Rate Mortgage</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/15-vs-30-year-mortgage" style="color:#22c55e;text-decoration:underline;font-size:15px;">15-Year vs 30-Year Mortgage</a></p>
  <p style="margin:0 0 10px;"><a href="https://numrica.com/blog/mortgage-refinancing-explained" style="color:#22c55e;text-decoration:underline;font-size:15px;">Mortgage Refinancing Explained</a></p>
</div>

<div class="disclaimer" style="margin-top:24px;border-top:none;padding-top:0;">
<strong>Sobre o autor:</strong> Pedro Roriz é professor de finanças empresariais e contabilidade de gestão no IPOG, uma das principais escolas de negócios do Brasil, com mais de 15.000 alunos formados. Fundou a TAG Business Solutions em 2016, consultoria de CFO-as-a-service com operações estabelecidas em Portugal e no Brasil. É também o criador do Numrica.com, plataforma gratuita de calculadoras financeiras.
</div>`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: 'Euribor variável vs taxa fixa: simulação real de 20 anos',
      description: 'Simulação de crédito habitação de 200.000 euros a 30 anos: Euribor variável vs taxa fixa, com quatro cenários de Euribor e ponto de equilíbrio exacto.',
      datePublished: '2026-05-21',
      dateModified: '2026-05-21',
      url: 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa',
      inLanguage: 'pt-PT',
      author: {
        '@type': 'Person',
        name: 'Pedro Roriz',
        url: 'https://pedrororiz.com',
        jobTitle: 'Professor de Finanças Empresariais',
        worksFor: [
          { '@type': 'Organization', name: 'IPOG' },
          { '@type': 'Organization', name: 'TAG Business Solutions' },
        ],
        knowsAbout: ['finanças empresariais', 'crédito habitação', 'Euribor', 'taxa fixa', 'amortização'],
      },
      publisher: { '@type': 'Organization', name: 'Numrica', url: 'https://numrica.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://numrica.com/blog/euribor-variavel-vs-taxa-fixa' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Numrica', item: 'https://numrica.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://numrica.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Euribor variável vs taxa fixa: simulação real de 20 anos' },
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
