import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Numrica',
  description:
    'Financial education articles from Pedro Roriz — debt payoff strategies, mortgage mechanics, compound interest, and personal finance for Tier 1 audiences.',
  alternates: { canonical: 'https://numrica.com/blog' },
}

const posts = [
  {
    slug: 'real-cost-minimum-payments',
    title: "The real cost of minimum payments: what your monthly statement doesn't show you",
    excerpt:
      "A $5,400 credit card balance at 24.99% APR, paid on minimums only, costs you $4,300 in interest before it's gone. Here is the number that actually matters.",
    date: 'May 21, 2026',
    readTime: '6 min read',
    lang: 'EN',
  },
  {
    slug: 'custo-real-pagamento-minimo',
    title: 'O custo real dos pagamentos mínimos: o que o seu extrato não mostra',
    excerpt:
      'Um saldo de R$5.000 no rotativo a 10% ao mês, pago apenas no mínimo, pode custar R$10.000 em juros antes de ser quitado. Aqui está a matemática — e o que R$200 a mais por mês realmente fazem.',
    date: '21 de maio de 2026',
    readTime: '6 min de leitura',
    lang: 'PT-BR',
  },
  {
    slug: 'debt-avalanche-vs-snowball',
    title: 'Debt avalanche vs debt snowball: which method saves more money?',
    excerpt:
      'Most people with three debts do not know which to pay first. That indecision has a measurable cost — between 20% and over 100% of the original debt balance in extra interest.',
    date: 'May 21, 2026',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'avalanche-vs-bola-de-neve',
    title: 'Avalanche vs bola de neve: qual método paga menos juros?',
    excerpt:
      'A maioria das pessoas com três dívidas simultâneas não sabe qual pagar primeiro. Essa indecisão tem um custo que pode representar entre 20% e mais de 100% do valor original das dívidas.',
    date: '21 de maio de 2026',
    readTime: '7 min de leitura',
    lang: 'PT-BR',
  },
  {
    slug: 'variable-rate-vs-fixed-rate-mortgage',
    title: 'Variable rate vs fixed rate mortgage: what 20 years of data actually shows',
    excerpt:
      'Most borrowers choose their mortgage rate type based on the initial monthly payment. That is the wrong basis for a 25-year decision. Three scenarios, one simulation.',
    date: 'May 21, 2026',
    readTime: '7 min read',
    lang: 'EN',
  },
  {
    slug: 'euribor-variavel-vs-taxa-fixa',
    title: 'Euribor variável vs taxa fixa: simulação real de 20 anos',
    excerpt:
      'A maioria das pessoas escolhe o regime de taxa do crédito habitação com base na prestação inicial. Essa é a decisão errada.',
    date: '21 de maio de 2026',
    readTime: '7 min de leitura',
    lang: 'PT-PT',
  },
]

export default function BlogIndex() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 0' }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 12px',
            fontFamily: 'Georgia, serif',
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#6b7280',
            margin: '0 0 40px',
            fontFamily: 'sans-serif',
            lineHeight: 1.6,
          }}
        >
          Financial education from Pedro Roriz — professor, consultant, and founder of Numrica.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: 11,
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontFamily: 'sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {post.lang}
                </span>
              </div>

              <h2 style={{ margin: '0 0 10px', fontSize: 18, lineHeight: 1.4 }}>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    color: '#1a1a2e',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {post.title}
                </Link>
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: 15,
                  lineHeight: 1.6,
                  margin: '0 0 14px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {post.excerpt}
              </p>

              <p
                style={{
                  color: '#9ca3af',
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  margin: 0,
                }}
              >
                {post.date} · {post.readTime}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
