@AGENTS.md

# Numrica — Project Guidelines

## O que é

Vertical AdSense da Petra4. Calculadoras financeiras gratuitas em inglês — loan, mortgage, compound interest, debt payoff, ROI. Monetização via Google AdSense. Domínio: numrica.com.

## Stack

Next.js (App Router) + TypeScript + Tailwind + Vercel Analytics. Sem Supabase — conteúdo estático + SEO.

## Convenções

- Todas as páginas em inglês (público global, AdSense EN)
- Cada calculadora tem sua própria rota: `app/loan-simulator/`, `app/mortgage-calculator/`, etc.
- SEO: `metadata` em cada `page.tsx` com title/description em inglês
- `sitemap.ts` na raiz de `app/` — atualizar ao adicionar rota nova
- Sem autenticação, sem banco de dados
- Componentes reutilizáveis em `app/components/`

## AdSense

- Nunca bloquear renderização com scripts de ads
- Unidades de anúncio: inserir após conteúdo principal, nunca antes do H1
- Respeitar Core Web Vitals — nada que aumente LCP ou CLS

## Deploy

Push para `main` → auto-deploy Vercel. Sem staging configurado.
