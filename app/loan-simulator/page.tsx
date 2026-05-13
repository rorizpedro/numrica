'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LabelList, LineChart, Line, ResponsiveContainer,
} from 'recharts'
import * as XLSX from 'xlsx'
import {
  calculate, annualToMonthly, monthlyToAnnual, formatDate,
  type LoanParams, type AmortizationType, type GraceType, type PeriodRow, type LoanSchedule,
} from '@/app/loan-simulator/lib/calculator'

// ─── Google Ads conversion tracking ──────────────────────────────────────────
// Replace these with your real conversion labels from Google Ads:
//   CONV_EXCEL    → label for "Export Excel" conversion action
//   CONV_BOOKCALL → label for "Book a Call" conversion action
const GOOGLE_ADS_ID = 'AW-XXXXXXXXX'
const CONV_EXCEL = 'YYYYYYYY'
const CONV_BOOKCALL = 'ZZZZZZZZ'
// AdSense ad slot IDs (from your AdSense account → Ads → By ad unit):
const AD_SLOT_TOP = '1111111111'   // between summary and debt runoff chart
const AD_SLOT_BTM = '2222222222'   // between amortization table and footer CTA
// AdSense publisher ID:
const ADSENSE_CLIENT = 'ca-pub-1573463799478833'

declare global { interface Window { gtag?: (...args: unknown[]) => void; adsbygoogle?: unknown[] } }

function gtagConversion(label: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${label}` })
  }
}

function AdUnit({ slot: _slot }: { slot: string }) {
  // Placeholder until AdSense ad units are created and real slot IDs are available
  return null
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

type Lang = 'en' | 'pt' | 'es'

const T = {
  en: {
    brand: 'Numrica', title: 'Loan Amortization Calculator',
    compareSystems: 'Compare systems', scenarioAnalysis: 'Scenario analysis', exportExcel: 'Export Excel',
    currency: 'Currency', loanAmount: 'Loan Amount', interestRate: 'Interest Rate',
    perMonth: '/ month', perYear: '/ year', perYear2: 'per year', perMonth2: 'per month',
    periods: 'Periods (months)', startDate: 'Start Date',
    gracePeriod: 'Grace Period (months)', graceType: 'Grace Type',
    gracePartial: 'Partial — pay interest only', graceTotal: 'Total — capitalize interest',
    amortSystem: 'Amortization System', gradientRate: 'Gradient Rate (% / month)',
    debtRunoff: 'Debt Runoff', debtRunoffSub: 'Remaining balance + principal + interest by period',
    byMonth: 'Month', byYear: 'Year',
    remainingBalance: 'Remaining Balance', principal: 'Principal', interest: 'Interest', installment: 'Installment',
    totalPaid: 'Total Paid', totalInterest: 'Total Interest', firstPayment: 'First Payment', lastPayment: 'Last Payment',
    totalCostSub: 'of loan amount (total interest / principal)',
    amortSchedule: 'Amortization Schedule', periods2: 'periods', grace2: 'grace',
    date: 'Date', openingBalance: 'Opening Balance', amortization: 'Amortization',
    closingBalance: 'Closing Balance',
    systemComparison: 'System Comparison', installmentsOverTime: 'Installments over time',
    altRate: 'Alternative Rate (% / month)', altPeriods: 'Alternative Periods (months)',
    current: 'Current', alternative: 'Alternative',
    ctaTitle: 'Need help restructuring your debt?',
    ctaSub: 'I work with companies on financial strategy, debt optimization, and CFO-as-a-Service.',
    ctaBtn: 'Schedule a call →',
    freeExport: 'Free Export', getExcel: 'Get your Excel file',
    modalSub: 'Enter your email and we\'ll send the full amortization schedule straight to your inbox.',
    nameLabel: 'Name (optional)', namePlaceholder: 'John Smith',
    emailLabel: 'Your email', emailPlaceholder: 'you@company.com',
    downloadBtn: 'Send to my email →', preparingDownload: 'Sending...', cancel: 'Cancel',
    modalSuccess: 'Check your inbox! Your schedule is on its way.',
    grace: 'G', total: 'TOTAL',
    totalPaidSub: 'total paid', interestSub: 'interest', firstToLast: 'first → last',
    noResults: 'Enter loan parameters to see results',
    bookCall: 'Book a Call', bookCallSub: 'Tell me what you\'re looking for and we\'ll get in touch.',
    bookCallGoals: 'What are you looking for?', bookCallCollateral: 'About collateral',
    lowerInstallment: 'Reduce monthly installment', lowerRate: 'Reduce interest rate', reprofileDebt: 'Reprofile debt',
    collateralAlienated: 'Encumbered asset', collateralFree: 'Unencumbered asset', suretyBond: 'Surety bond',
    nameRequired: 'Name', emailRequired: 'Email',
    collateralValueLabel: 'Estimated asset value', collateralValuePlaceholder: 'e.g. 500000',
    bookCallCTA: 'Reserve your slot →', bookCallSuccess: 'Done! Opening the calendar now.',
    descSAC: 'SAC: constant amortization, decreasing installments. Best for predictable principal paydown and lower total interest.',
    descPRICE: 'Price: constant installments throughout the loan. Simplest cash flow planning — same payment every month.',
    descGRADIENTE: 'Gradient: installments grow by a fixed rate each period. Useful when revenue is expected to grow over time.',
    descAMERICANO: 'Bullet: interest-only payments until the final period, when the full principal is repaid. Common in bridge financing.',
    types: { SAC: 'SAC — Constant Amortization', PRICE: 'Price — Constant Installment', GRADIENTE: 'Gradient — Growing Installments', AMERICANO: 'Bullet (American)' },
  },
  pt: {
    brand: 'Numrica', title: 'Calculadora de Amortização',
    compareSystems: 'Comparar sistemas', scenarioAnalysis: 'Análise de cenários', exportExcel: 'Exportar Excel',
    currency: 'Moeda', loanAmount: 'Valor do empréstimo', interestRate: 'Taxa de juros',
    perMonth: '/ mês', perYear: '/ ano', perYear2: 'ao ano', perMonth2: 'ao mês',
    periods: 'Períodos (meses)', startDate: 'Data de início',
    gracePeriod: 'Carência (meses)', graceType: 'Tipo de carência',
    gracePartial: 'Parcial — paga só os juros', graceTotal: 'Total — capitaliza os juros',
    amortSystem: 'Sistema de amortização', gradientRate: 'Taxa de gradiente (% / mês)',
    debtRunoff: 'Runoff da Dívida', debtRunoffSub: 'Saldo devedor + amortização + juros por período',
    byMonth: 'Mês', byYear: 'Ano',
    remainingBalance: 'Saldo Devedor', principal: 'Amortização', interest: 'Juros', installment: 'Parcela',
    totalPaid: 'Total Pago', totalInterest: 'Total de Juros', firstPayment: 'Primeira Parcela', lastPayment: 'Última Parcela',
    totalCostSub: 'do valor do empréstimo (total de juros / principal)',
    amortSchedule: 'Tabela de Amortização', periods2: 'períodos', grace2: 'carência',
    date: 'Data', openingBalance: 'Saldo Inicial', amortization: 'Amortização',
    closingBalance: 'Saldo Final',
    systemComparison: 'Comparação de Sistemas', installmentsOverTime: 'Parcelas ao longo do tempo',
    altRate: 'Taxa alternativa (% / mês)', altPeriods: 'Prazo alternativo (meses)',
    current: 'Atual', alternative: 'Alternativo',
    ctaTitle: 'Precisa reestruturar sua dívida?',
    ctaSub: 'Trabalho com empresas em estratégia financeira, otimização de dívidas e CFO as a Service.',
    ctaBtn: 'Agendar uma conversa →',
    freeExport: 'Exportação gratuita', getExcel: 'Receba seu arquivo Excel',
    modalSub: 'Digite seu e-mail e enviaremos a tabela completa de amortização direto para a sua caixa de entrada.',
    nameLabel: 'Nome (opcional)', namePlaceholder: 'João da Silva',
    emailLabel: 'Seu e-mail', emailPlaceholder: 'voce@empresa.com',
    downloadBtn: 'Enviar para meu e-mail →', preparingDownload: 'Enviando...', cancel: 'Cancelar',
    modalSuccess: 'Verifique sua caixa de entrada! Sua tabela já está a caminho.',
    grace: 'C', total: 'TOTAL',
    totalPaidSub: 'total pago', interestSub: 'juros', firstToLast: 'primeira → última',
    noResults: 'Preencha os parâmetros para ver os resultados',
    bookCall: 'Agendar conversa', bookCallSub: 'Me diga o que você está buscando e entraremos em contato com você.',
    bookCallGoals: 'O que você está buscando?', bookCallCollateral: 'Sobre garantias',
    lowerInstallment: 'Reduzir a parcela mensal', lowerRate: 'Reduzir a taxa de juros', reprofileDebt: 'Reperfilar a dívida',
    collateralAlienated: 'Bem alienado', collateralFree: 'Bem desalienado', suretyBond: 'Carta fiança',
    nameRequired: 'Nome', emailRequired: 'E-mail',
    collateralValueLabel: 'Valor estimado do bem', collateralValuePlaceholder: 'Ex.: 500000',
    bookCallCTA: 'Reservar seu horário →', bookCallSuccess: 'Pronto! Abrindo o calendário agora.',
    descSAC: 'SAC: amortização constante, parcelas decrescentes. Ideal para previsibilidade no abatimento do principal e menor custo total.',
    descPRICE: 'Price: parcelas constantes durante todo o prazo. Planejamento de fluxo de caixa mais simples — mesmo valor todo mês.',
    descGRADIENTE: 'Gradiente: as parcelas crescem a uma taxa fixa por período. Indicado quando a receita deve crescer ao longo do tempo.',
    descAMERICANO: 'Americano (Bullet): paga apenas juros durante o prazo e quita o principal no final. Comum em financiamentos de curto prazo.',
    types: { SAC: 'SAC — Amortização Constante', PRICE: 'Price — Parcela Constante', GRADIENTE: 'Gradiente — Parcelas Crescentes', AMERICANO: 'Americano (Bullet)' },
  },
  es: {
    brand: 'Numrica', title: 'Calculadora de Amortización',
    compareSystems: 'Comparar sistemas', scenarioAnalysis: 'Análisis de escenarios', exportExcel: 'Exportar Excel',
    currency: 'Moneda', loanAmount: 'Monto del préstamo', interestRate: 'Tasa de interés',
    perMonth: '/ mes', perYear: '/ año', perYear2: 'al año', perMonth2: 'al mes',
    periods: 'Períodos (meses)', startDate: 'Fecha de inicio',
    gracePeriod: 'Período de gracia (meses)', graceType: 'Tipo de gracia',
    gracePartial: 'Parcial — paga solo intereses', graceTotal: 'Total — capitaliza intereses',
    amortSystem: 'Sistema de amortización', gradientRate: 'Tasa de gradiente (% / mes)',
    debtRunoff: 'Runoff de Deuda', debtRunoffSub: 'Saldo restante + amortización + intereses por período',
    byMonth: 'Mes', byYear: 'Año',
    remainingBalance: 'Saldo Restante', principal: 'Amortización', interest: 'Interés', installment: 'Cuota',
    totalPaid: 'Total Pagado', totalInterest: 'Total Intereses', firstPayment: 'Primera Cuota', lastPayment: 'Última Cuota',
    totalCostSub: 'del monto prestado (total intereses / principal)',
    amortSchedule: 'Tabla de Amortización', periods2: 'períodos', grace2: 'gracia',
    date: 'Fecha', openingBalance: 'Saldo Inicial', amortization: 'Amortización',
    closingBalance: 'Saldo Final',
    systemComparison: 'Comparación de Sistemas', installmentsOverTime: 'Cuotas a lo largo del tiempo',
    altRate: 'Tasa alternativa (% / mes)', altPeriods: 'Plazo alternativo (meses)',
    current: 'Actual', alternative: 'Alternativo',
    ctaTitle: '¿Necesita reestructurar su deuda?',
    ctaSub: 'Trabajo con empresas en estrategia financiera, optimización de deuda y CFO as a Service.',
    ctaBtn: 'Agendar una reunión →',
    freeExport: 'Exportación gratuita', getExcel: 'Recibe tu archivo Excel',
    modalSub: 'Ingresa tu correo y te enviaremos la tabla completa de amortización directamente a tu bandeja de entrada.',
    nameLabel: 'Nombre (opcional)', namePlaceholder: 'Juan García',
    emailLabel: 'Tu correo', emailPlaceholder: 'tu@empresa.com',
    downloadBtn: 'Enviar a mi correo →', preparingDownload: 'Enviando...', cancel: 'Cancelar',
    modalSuccess: '¡Revisa tu bandeja de entrada! Tu tabla ya está en camino.',
    grace: 'G', total: 'TOTAL',
    totalPaidSub: 'total pagado', interestSub: 'interés', firstToLast: 'primera → última',
    noResults: 'Ingrese los parámetros para ver los resultados',
    bookCall: 'Agendar reunión', bookCallSub: 'Cuéntame qué buscas y nos pondremos en contacto contigo.',
    bookCallGoals: '¿Qué estás buscando?', bookCallCollateral: 'Sobre garantías',
    lowerInstallment: 'Reducir la cuota mensual', lowerRate: 'Reducir la tasa de interés', reprofileDebt: 'Reprofilar la deuda',
    collateralAlienated: 'Bien gravado', collateralFree: 'Bien libre de gravamen', suretyBond: 'Carta fianza',
    nameRequired: 'Nombre', emailRequired: 'Correo electrónico',
    collateralValueLabel: 'Valor estimado del bien', collateralValuePlaceholder: 'Ej.: 500000',
    bookCallCTA: 'Reservar su turno →', bookCallSuccess: '¡Listo! Abriendo el calendario ahora.',
    descSAC: 'SAC: amortización constante, cuotas decrecientes. Ideal para previsibilidad en el pago del capital.',
    descPRICE: 'Price: cuotas constantes durante todo el plazo. Planificación de flujo de caja más sencilla — mismo monto cada mes.',
    descGRADIENTE: 'Gradiente: las cuotas crecen a una tasa fija por período. Indicado cuando se espera que los ingresos crezcan.',
    descAMERICANO: 'Americano (Bullet): paga solo intereses durante el plazo y liquida el capital al final. Común en financiamientos puente.',
    types: { SAC: 'SAC — Amortización Constante', PRICE: 'Price — Cuota Constante', GRADIENTE: 'Gradiente — Cuotas Crecientes', AMERICANO: 'Americano (Bullet)' },
  },
}

type TType = typeof T.en

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  principal: string
  rateValue: string
  ratePeriod: 'monthly' | 'annual'
  periods: string
  gracePeriods: string
  graceType: GraceType
  type: AmortizationType
  gradientRate: string
  startDate: string
  currency: 'USD' | 'BRL' | 'EUR'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOCALE_MAP: Record<Lang, string> = { en: 'en-US', pt: 'pt-BR', es: 'es-ES' }
const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', BRL: 'R$', EUR: '€' }

function fmtCurrency(v: number, currency: string, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE_MAP[lang], {
    style: 'currency', currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v)
}

function fmtCompact(v: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
}

function fmtPeriod(isoDate: string): string {
  const [year, month] = isoDate.split('-')
  return `${month}/${year.substring(2)}` // MM/YY
}

function fmtNumber(raw: string, lang: Lang): string {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ''))
  if (isNaN(n) || !raw) return raw
  return new Intl.NumberFormat(LOCALE_MAP[lang], {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)
}

function parseRaw(str: string): number {
  return parseFloat(str.replace(/[^0-9.]/g, '')) || 0
}

type ChartPoint = Record<string, number | string>

function toMonthlyData(rows: PeriodRow[], t: TType): ChartPoint[] {
  return rows.map(r => ({
    period: fmtPeriod(r.date),
    [t.remainingBalance]: Math.round(r.closingBalance),
    [t.principal]: Math.round(r.amortization),
    [t.interest]: Math.round(r.interest),
    installment: Math.round(r.installment),
  }))
}

function toYearlyData(rows: PeriodRow[], t: TType): ChartPoint[] {
  const byYear: Record<string, { amort: number; interest: number; balance: number; installment: number }> = {}
  for (const r of rows) {
    const y = r.date.substring(0, 4)
    if (!byYear[y]) byYear[y] = { amort: 0, interest: 0, balance: 0, installment: 0 }
    byYear[y].amort += r.amortization
    byYear[y].interest += r.interest
    byYear[y].balance = r.closingBalance
    byYear[y].installment += r.installment
  }
  return Object.entries(byYear).map(([year, d]) => ({
    period: year,
    [t.remainingBalance]: Math.round(d.balance),
    [t.principal]: Math.round(d.amort),
    [t.interest]: Math.round(d.interest),
    installment: Math.round(d.installment),
  }))
}

// ─── CSS constants ────────────────────────────────────────────────────────────

const fieldCls = 'h-10 w-full bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-lg px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors'
const selectCls = fieldCls + ' cursor-pointer appearance-none'

const CHART_COLORS = {
  balance: '#1e3a5f',
  principal: '#C9A227',
  interest: '#5c4f28',
  current: '#C9A227',
  alternative: '#4a90d9',
}

const SYSTEM_COLORS = ['#C9A227', '#4a90d9', '#7bc47b']

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a2e',
  border: '1px solid rgba(201,162,39,0.3)',
  borderRadius: 8, fontSize: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
}

// ─── Lang Selector ────────────────────────────────────────────────────────────

const LANG_META: Record<Lang, { flag: string; code: string }> = {
  en: { flag: '🇺🇸', code: 'EN' },
  pt: { flag: '🇧🇷', code: 'PT' },
  es: { flag: '🇪🇸', code: 'ES' },
}

function LangSelector({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1">
      {(Object.keys(LANG_META) as Lang[]).map(l => {
        const { flag, code } = LANG_META[l]
        const active = lang === l
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono tracking-wider border transition-all ${
              active
                ? 'bg-[rgba(201,162,39,0.15)] border-[rgba(201,162,39,0.4)] text-[var(--color-gold)]'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-text-soft)]'
            }`}
          >
            <span className="text-xs">{flag}</span>
            <span>{code}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium tracking-wider uppercase text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Formatted principal input ────────────────────────────────────────────────

function PrincipalInput({ raw, onChange, lang, placeholder }: {
  raw: string; onChange: (v: string) => void; lang: Lang; placeholder: string
}) {
  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState(raw)

  useEffect(() => { if (!focused) setInput(raw) }, [raw, focused])

  return (
    <input
      type="text"
      className={fieldCls}
      placeholder={placeholder}
      value={focused ? input : fmtNumber(raw, lang)}
      onFocus={() => { setFocused(true); setInput(raw) }}
      onBlur={() => {
        const clean = input.replace(/[^0-9.]/g, '')
        setFocused(false)
        onChange(clean || '0')
      }}
      onChange={e => setInput(e.target.value)}
      inputMode="decimal"
    />
  )
}

// ─── Email modal ──────────────────────────────────────────────────────────────

function EmailModal({ t, onSubmit, onClose, loading, success }: {
  t: TType
  onSubmit: (email: string, name: string) => void
  onClose: () => void
  loading: boolean
  success: boolean
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (!email || loading) return
    onSubmit(email, name)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-navy-light)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl">
        <p className="text-xs tracking-[3px] uppercase text-[var(--color-gold)] mb-3">{t.freeExport}</p>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{t.getExcel}</h2>
        {loading ? (
          <p className="text-sm text-[var(--color-text-soft)] leading-relaxed mt-4">{t.preparingDownload}</p>
        ) : success ? (
          <div className="mt-4">
            <p className="text-sm text-[var(--color-text-soft)] leading-relaxed mb-6">{t.modalSuccess}</p>
            <button onClick={onClose} className="w-full h-10 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)] hover:opacity-90 transition-all">
              OK
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-soft)] leading-relaxed mb-6">{t.modalSub}</p>
            <div className="flex flex-col gap-4">
              <Field label={t.nameLabel}>
                <input className={fieldCls} placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
              </Field>
              <Field label={t.emailLabel}>
                <input type="email" className={fieldCls} placeholder={t.emailPlaceholder} value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </Field>
              <button disabled={!email} onClick={handleSubmit}
                className="w-full mt-2 h-10 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)] hover:opacity-90 disabled:opacity-40 transition-all">
                {t.downloadBtn}
              </button>
              <button onClick={onClose} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-soft)] transition-colors text-center">
                {t.cancel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Book Call Modal ──────────────────────────────────────────────────────────

function CheckOption({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all ${checked ? 'border-[var(--color-gold)] bg-[var(--color-gold-muted)]' : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'}`}>
      <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${checked ? 'bg-[var(--color-gold)] border-[var(--color-gold)]' : 'border-[var(--color-border)]'}`}>
        {checked && <span className="text-[var(--color-navy)] text-[9px] font-black leading-none">✓</span>}
      </div>
      <span className="text-sm text-[var(--color-text-soft)]">{label}</span>
    </button>
  )
}

function BookCallModal({ t, onClose, onSubmit, loading, success }: {
  t: TType
  onClose: () => void
  onSubmit: (email: string, name: string, goals: string[], collateralValue: string) => void
  loading: boolean
  success: boolean
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [collateralValue, setCollateralValue] = useState('')

  const toggle = (g: string) =>
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const goalOptions = [t.lowerInstallment, t.lowerRate, t.reprofileDebt]
  const collateralOptions = [t.collateralAlienated, t.collateralFree, t.suretyBond]
  const hasCollateral = collateralOptions.some(opt => goals.includes(opt))
  const canSubmit = !!email && !!name && !loading

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--color-navy-light)] border border-[var(--color-border)] rounded-2xl p-7 shadow-2xl">
        {success ? (
          <div className="text-center py-6">
            <p className="text-sm text-[var(--color-text-soft)] leading-relaxed mb-6">{t.bookCallSuccess}</p>
            <button onClick={onClose} className="w-full h-10 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)] hover:opacity-90 transition-all">OK</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs tracking-[3px] uppercase text-[var(--color-gold)] mb-1">{t.bookCall}</p>
                <p className="text-sm text-[var(--color-text-soft)]">{t.bookCallSub}</p>
              </div>
              <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Group 1: goals */}
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{t.bookCallGoals}</p>
            <div className="space-y-2 mb-4">
              {goalOptions.map(opt => (
                <CheckOption key={opt} label={opt} checked={goals.includes(opt)} onToggle={() => toggle(opt)} />
              ))}
            </div>

            {/* Group 2: collateral */}
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{t.bookCallCollateral}</p>
            <div className="space-y-2 mb-3">
              {collateralOptions.map(opt => (
                <CheckOption key={opt} label={opt} checked={goals.includes(opt)} onToggle={() => toggle(opt)} />
              ))}
            </div>
            {hasCollateral && (
              <div className="mb-5">
                <Field label={t.collateralValueLabel}>
                  <input
                    type="number"
                    className={fieldCls}
                    placeholder={t.collateralValuePlaceholder}
                    value={collateralValue}
                    onChange={e => setCollateralValue(e.target.value)}
                    min={0}
                  />
                </Field>
              </div>
            )}
            {!hasCollateral && <div className="mb-5" />}

            {/* Contact fields — required */}
            <div className="flex flex-col gap-3 mb-5">
              <Field label={t.nameRequired}>
                <input className={fieldCls} placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
              </Field>
              <Field label={t.emailRequired}>
                <input type="email" className={fieldCls} placeholder={t.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
            </div>

            <button disabled={!canSubmit} onClick={() => onSubmit(email, name, goals, collateralValue)}
              className="w-full h-10 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)] hover:opacity-90 disabled:opacity-40 transition-all mb-3">
              {loading ? '...' : t.bookCallCTA}
            </button>
            <button onClick={onClose} className="w-full text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-soft)] transition-colors text-center">
              {t.cancel}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Chart toggle button ──────────────────────────────────────────────────────

function ViewToggle({ value, onChange, t }: {
  value: 'month' | 'year'
  onChange: (v: 'month' | 'year') => void
  t: TType
}) {
  return (
    <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
      {(['month', 'year'] as const).map(v => (
        <button key={v} onClick={() => onChange(v)}
          className={`px-3 py-1 text-xs transition-all ${
            value === v
              ? 'bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-soft)]'
          }`}>
          {v === 'month' ? t.byMonth : t.byYear}
        </button>
      ))}
    </div>
  )
}

// ─── Custom tooltip with color swatches ──────────────────────────────────────

interface TooltipEntry { name: string; value: number; color?: string; fill?: string; stroke?: string }

function ChartTooltip({ active, payload, label, fmt }: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
  fmt: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ ...TOOLTIP_STYLE, padding: '10px 14px' }}>
      <p style={{ color: '#C9A227', marginBottom: 8, fontWeight: 600, fontSize: 12 }}>{label}</p>
      {payload.map((entry, i) => {
        const swatch = entry.color ?? entry.fill ?? entry.stroke ?? '#C9A227'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: i < payload.length - 1 ? 5 : 0 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: swatch, flexShrink: 0 }} />
            <span style={{ color: '#B8B8B0', fontSize: 11 }}>{entry.name}:</span>
            <span style={{ color: '#F4F4F0', fontSize: 11, fontWeight: 500 }}>{fmt(Number(entry.value))}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Scrollable chart wrapper ─────────────────────────────────────────────────

const BAR_WIDTH = 52

function ScrollChart({ data, height = 280, children }: {
  data: ChartPoint[]
  height?: number
  children: React.ReactElement
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ left: 0, width: 100 })
  const w = Math.max(data.length * BAR_WIDTH, 360)

  const updateThumb = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const visible = el.clientWidth / el.scrollWidth
    const offset = el.scrollLeft / (Math.max(el.scrollWidth - el.clientWidth, 1))
    const thumbW = Math.max(visible * 100, 10)
    setThumb({ width: thumbW, left: offset * (100 - thumbW) })
  }, [])

  useEffect(() => { updateThumb() }, [data, updateThumb])

  const onThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const el = scrollRef.current
    const track = trackRef.current
    if (!el || !track) return
    const startX = e.clientX
    const startLeft = el.scrollLeft
    const trackW = track.clientWidth
    const scrollable = el.scrollWidth - el.clientWidth

    const onMove = (mv: MouseEvent) => {
      const delta = (mv.clientX - startX) / trackW * el.scrollWidth
      el.scrollLeft = Math.max(0, Math.min(startLeft + delta, scrollable))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  const onTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    const track = trackRef.current
    if (!el || !track) return
    const rect = track.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth)
  }, [])

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={updateThumb}
        style={{ overflowX: 'scroll', width: '100%', scrollbarWidth: 'none' }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        <div style={{ width: w, minWidth: '100%' }}>
          <ResponsiveContainer width="100%" height={height}>
            {children}
          </ResponsiveContainer>
        </div>
      </div>
      {/* custom always-visible draggable scrollbar */}
      <div
        ref={trackRef}
        onClick={onTrackClick}
        style={{
          height: 6, background: 'rgba(201,162,39,0.08)', borderRadius: 3,
          marginTop: 10, position: 'relative', cursor: 'pointer',
        }}
      >
        <div
          onMouseDown={onThumbMouseDown}
          style={{
            position: 'absolute', top: 0,
            left: `${thumb.left}%`, width: `${thumb.width}%`, height: '100%',
            background: 'rgba(201,162,39,0.35)', borderRadius: 3,
            cursor: 'grab', userSelect: 'none',
          }}
        />
      </div>
    </div>
  )
}

// ─── Runoff chart ─────────────────────────────────────────────────────────────

function RunoffChart({ rows, currency, lang, t, viewMode }: {
  rows: PeriodRow[]; currency: string; lang: Lang; t: TType
  viewMode: 'month' | 'year'
}) {
  const data = viewMode === 'year' ? toYearlyData(rows, t) : toMonthlyData(rows, t)
  const fmt = (v: number) => fmtCurrency(v, currency, lang)
  const compact = (v: number) => fmtCompact(v)

  return (
    <ScrollChart data={data}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.07)" />
        <XAxis dataKey="period" tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} />
        <YAxis tickFormatter={compact} tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} axisLine={false} width={50} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: '#C9A227', marginBottom: 6, fontWeight: 600 }}
          itemStyle={{ color: '#D4D4CE' }}
          formatter={(value, name) => [fmt(Number(value)), String(name)]}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={v => <span style={{ color: '#B8B8B0' }}>{v}</span>} />
        <Bar dataKey={t.remainingBalance} stackId="a" fill={CHART_COLORS.balance} />
        <Bar dataKey={t.principal} stackId="a" fill={CHART_COLORS.principal} />
        <Bar dataKey={t.interest} stackId="a" fill={CHART_COLORS.interest} radius={[2, 2, 0, 0]}>
          <LabelList
            dataKey="installment"
            position="top"
            formatter={(v: unknown) => compact(Number(v))}
            style={{ fill: '#8a8a82', fontSize: 8 }}
          />
        </Bar>
      </BarChart>
    </ScrollChart>
  )
}

// ─── Compare chart ────────────────────────────────────────────────────────────

function CompareChart({ schedules, currency, lang, t, viewMode }: {
  schedules: Record<string, LoanSchedule>; currency: string; lang: Lang; t: TType
  viewMode: 'month' | 'year'
}) {
  const fmt = (v: number) => fmtCurrency(v, currency, lang)
  const compact = (v: number) => fmtCompact(v)

  const systemKeys = Object.keys(schedules)
  const maxLen = Math.max(...systemKeys.map(k => schedules[k].rows.length))

  // Build merged dataset: one entry per period with all system installments
  const rawData: ChartPoint[] = Array.from({ length: maxLen }, (_, i) => {
    const firstRow = schedules[systemKeys[0]].rows[i]
    const entry: ChartPoint = { period: firstRow ? fmtPeriod(firstRow.date) : String(i + 1), year: firstRow ? firstRow.date.substring(0, 4) : '' }
    for (const key of systemKeys) {
      entry[key] = schedules[key].rows[i]?.installment ?? 0
    }
    return entry
  })

  const data: ChartPoint[] = viewMode === 'year'
    ? Object.values(
        rawData.reduce<Record<string, ChartPoint>>((acc, row) => {
          const y = String(row.year)
          if (!acc[y]) { acc[y] = { period: y }; for (const k of systemKeys) acc[y][k] = 0 }
          for (const k of systemKeys) acc[y][k] = Number(acc[y][k]) + Number(row[k])
          return acc
        }, {})
      )
    : rawData

  return (
    <ScrollChart data={data}>
      <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.07)" />
        <XAxis dataKey="period" tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} />
        <YAxis tickFormatter={compact} tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} axisLine={false} width={50} />
        <Tooltip content={(p) => <ChartTooltip active={p.active} payload={p.payload as unknown as TooltipEntry[] | undefined} label={String(p.label ?? '')} fmt={fmt} />} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={v => <span style={{ color: '#B8B8B0' }}>{v}</span>} />
        {systemKeys.map((key, idx) => (
          <Line key={key} type="monotone" dataKey={key} stroke={SYSTEM_COLORS[idx]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ScrollChart>
  )
}

// ─── Scenario chart ───────────────────────────────────────────────────────────

function ScenarioChart({ currentRows, altRows, currency, lang, t, viewMode }: {
  currentRows: PeriodRow[]; altRows: PeriodRow[]; currency: string; lang: Lang; t: TType
  viewMode: 'month' | 'year'
}) {
  const fmt = (v: number) => fmtCurrency(v, currency, lang)
  const compact = (v: number) => fmtCompact(v)
  const maxLen = Math.max(currentRows.length, altRows.length)

  const rawData: ChartPoint[] = Array.from({ length: maxLen }, (_, i) => {
    const cur = currentRows[i]
    const alt = altRows[i]
    return {
      period: fmtPeriod((cur ?? alt).date),
      year: (cur ?? alt).date.substring(0, 4),
      [t.current]: cur?.installment ?? 0,
      [t.alternative]: alt?.installment ?? 0,
    }
  })

  const data: ChartPoint[] = viewMode === 'year'
    ? Object.values(
        rawData.reduce<Record<string, ChartPoint>>((acc, row) => {
          const y = String(row.year)
          if (!acc[y]) acc[y] = { period: y, [t.current]: 0, [t.alternative]: 0 }
          acc[y][t.current] = Number(acc[y][t.current]) + Number(row[t.current])
          acc[y][t.alternative] = Number(acc[y][t.alternative]) + Number(row[t.alternative])
          return acc
        }, {})
      )
    : rawData

  return (
    <ScrollChart data={data}>
      <BarChart data={data} barCategoryGap="30%" barGap={3} margin={{ top: 16, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,162,39,0.07)" />
        <XAxis dataKey="period" tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} />
        <YAxis tickFormatter={compact} tick={{ fill: '#a0a098', fontSize: 10 }} tickLine={false} axisLine={false} width={50} />
        <Tooltip content={(p) => <ChartTooltip active={p.active} payload={p.payload as unknown as TooltipEntry[] | undefined} label={String(p.label ?? '')} fmt={fmt} />} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={v => <span style={{ color: '#B8B8B0' }}>{v}</span>} />
        <Bar dataKey={t.current} fill={CHART_COLORS.current} radius={[2, 2, 0, 0]} />
        <Bar dataKey={t.alternative} fill={CHART_COLORS.alternative} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ScrollChart>
  )
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-xl p-4">
      <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className="text-xl font-semibold text-[var(--color-text-primary)]">{value}</p>
      {sub && <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-snug">{sub}</p>}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: 'USD', label: 'USD — $' },
  { value: 'BRL', label: 'BRL — R$' },
  { value: 'EUR', label: 'EUR — €' },
]

export default function LoanSimulator() {
  const today = new Date().toISOString().split('T')[0]

  // UI state
  const [lang, setLang] = useState<Lang>('pt')
  const [compareMode, setCompareMode] = useState(false)
  const [scenarioMode, setScenarioMode] = useState(false)
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')
  const [showModal, setShowModal] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [exported, setExported] = useState(false)
  const [showBookCall, setShowBookCall] = useState(false)
  const [bookCallLoading, setBookCallLoading] = useState(false)
  const [bookCallSuccess, setBookCallSuccess] = useState(false)

  const t = T[lang] as TType

  // Form state
  const [form, setForm] = useState<FormState>({
    principal: '100000',
    rateValue: '1.5',
    ratePeriod: 'monthly',
    periods: '24',
    gracePeriods: '0',
    graceType: 'partial',
    type: 'PRICE',
    gradientRate: '0.5',
    startDate: today,
    currency: 'BRL',
  })

  // Scenario state
  const [scenarioRate, setScenarioRate] = useState('')
  const [scenarioPeriods, setScenarioPeriods] = useState('')

  useEffect(() => {
    if (scenarioMode && !scenarioRate) {
      setScenarioRate(form.rateValue)
      setScenarioPeriods(form.periods)
    }
  }, [scenarioMode])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const params = useMemo((): LoanParams | null => {
    const principal = parseRaw(form.principal)
    const rateRaw = parseFloat(form.rateValue) / 100
    const periods = parseInt(form.periods)
    const gracePeriods = parseInt(form.gracePeriods) || 0
    const gradientRate = parseFloat(form.gradientRate) / 100
    if (!principal || !rateRaw || !periods || principal <= 0 || periods <= 0 || rateRaw <= 0) return null
    const rateMonthly = form.ratePeriod === 'annual' ? annualToMonthly(rateRaw) : rateRaw
    return { principal, rateMonthly, periods, gracePeriods, graceType: form.graceType, type: form.type, gradientRate, startDate: form.startDate }
  }, [form])

  const schedule = useMemo(() => (params ? calculate(params) : null), [params])

  const compareSchedules = useMemo(() => {
    if (!params || !compareMode) return null
    return {
      SAC: calculate({ ...params, type: 'SAC' }),
      PRICE: calculate({ ...params, type: 'PRICE' }),
      GRADIENTE: calculate({ ...params, type: 'GRADIENTE' }),
    }
  }, [params, compareMode])

  const scenarioSchedule = useMemo(() => {
    if (!params || !scenarioMode) return null
    const altRate = parseFloat(scenarioRate) / 100
    const altPeriods = parseInt(scenarioPeriods)
    if (!altRate || !altPeriods) return null
    return calculate({ ...params, rateMonthly: altRate, periods: altPeriods })
  }, [params, scenarioMode, scenarioRate, scenarioPeriods])

  const fmt = (v: number) => fmtCurrency(v, form.currency, lang)

  const triggerDownload = useCallback(() => {
    if (!schedule || !params) return
    const wb = XLSX.utils.book_new()
    const summaryData = [
      ['Loan Amortization Calculator', 'numrica.com'],
      [],
      ['Principal', params.principal],
      ['Monthly Rate', `${(params.rateMonthly * 100).toFixed(4)}%`],
      ['Annual Rate', `${(monthlyToAnnual(params.rateMonthly) * 100).toFixed(2)}%`],
      ['Periods', params.periods],
      ['Grace Periods', params.gracePeriods],
      ['Type', params.type],
      ['Start Date', params.startDate],
      [],
      ['Total Paid', schedule.totalPaid],
      ['Total Interest', schedule.totalInterest],
      ['Total Principal', schedule.totalAmortization],
      ['Interest / Principal', `${((schedule.totalInterest / params.principal) * 100).toFixed(2)}%`],
      ['First Installment', schedule.firstInstallment],
      ['Last Installment', schedule.lastInstallment],
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')
    const schedData = [
      ['#', 'Date', 'Opening Balance', 'Amortization', 'Interest', 'Installment', 'Closing Balance', 'Grace'],
      ...schedule.rows.map(r => [r.period, r.date, r.openingBalance, r.amortization, r.interest, r.installment, r.closingBalance, r.isGrace ? 'Yes' : '']),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(schedData), 'Schedule')
    if (compareSchedules) {
      const keys = Object.keys(compareSchedules) as (keyof typeof compareSchedules)[]
      const maxLen = Math.max(...keys.map(k => compareSchedules[k].rows.length))
      const compData = [['#', 'Date', ...keys.flatMap(k => [`${k} Installment`, `${k} Balance`])]]
      for (let i = 0; i < maxLen; i++) {
        const first = compareSchedules[keys[0]].rows[i]
        compData.push([String(first?.period ?? i + 1), first?.date ?? '', ...keys.flatMap(k => [String(compareSchedules[k].rows[i]?.installment ?? ''), String(compareSchedules[k].rows[i]?.closingBalance ?? '')])])
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(compData), 'Comparison')
    }
    XLSX.writeFile(wb, `loan-${params.type.toLowerCase()}-${today}.xlsx`)
  }, [schedule, params, compareSchedules, today])

  const handleEmailSubmit = async (email: string, name: string) => {
    setEmailLoading(true)
    try {
      await fetch('/api/loan-simulator/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, params }),
      })
    } catch { /* non-blocking */ }
    gtagConversion(CONV_EXCEL)
    setEmailLoading(false)
    setExported(true)
    // modal stays open to show success message — user closes it
  }

  const handleBookCallSubmit = async (email: string, name: string, goals: string[], collateralValue: string) => {
    setBookCallLoading(true)
    try {
      await fetch('/api/loan-simulator/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, goals, collateralValue, params }),
      })
    } catch { /* non-blocking */ }
    gtagConversion(CONV_BOOKCALL)
    setBookCallLoading(false)
    setBookCallSuccess(true)
    window.open('https://pedrororiz.com/agendar', '_blank')
  }

  const graceCount = parseInt(form.gracePeriods) || 0

  return (
    <>
      {showModal && <EmailModal t={t} onSubmit={handleEmailSubmit} onClose={() => { setShowModal(false) }} loading={emailLoading} success={exported} />}
      {showBookCall && <BookCallModal t={t} onClose={() => { setShowBookCall(false); setBookCallSuccess(false) }} onSubmit={handleBookCallSubmit} loading={bookCallLoading} success={bookCallSuccess} />}

      <div className="h-screen flex flex-col bg-[var(--color-navy)] overflow-hidden">
        {/* Header — 3 columns: brand | actions | lang */}
        <header className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-navy-light)]">
          <div className="flex items-stretch h-[57px]">

            {/* Left: brand aligned with sidebar */}
            <div className="hidden lg:flex flex-col justify-center w-[300px] xl:w-[340px] flex-shrink-0 border-r border-[var(--color-border)] px-5">
              <a href="/" className="text-[10px] tracking-[3px] uppercase text-[var(--color-gold)] hover:opacity-80 transition-opacity">{t.brand}</a>
              <h1 className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5 leading-tight">{t.title}</h1>
            </div>
            {/* Mobile brand */}
            <div className="lg:hidden flex flex-col justify-center px-4">
              <a href="/" className="text-[10px] tracking-[3px] uppercase text-[var(--color-gold)]">{t.brand}</a>
              <h1 className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">{t.title}</h1>
            </div>

            {/* Center: action buttons */}
            <div className="flex-1 flex items-center justify-center gap-2 px-4">
              <button onClick={() => setCompareMode(c => !c)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${compareMode ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)] font-semibold' : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:border-[var(--color-gold)]'}`}>
                {t.compareSystems}
              </button>
              <button onClick={() => setScenarioMode(c => !c)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${scenarioMode ? 'bg-[var(--color-gold)] text-[var(--color-navy)] border-[var(--color-gold)] font-semibold' : 'border-[var(--color-border)] text-[var(--color-text-soft)] hover:border-[var(--color-gold)]'}`}>
                {t.scenarioAnalysis}
              </button>
              <button onClick={() => { setExported(false); setShowModal(true) }} disabled={!schedule}
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-soft)] hover:border-[var(--color-gold)] disabled:opacity-40 transition-all">
                {t.exportExcel}
              </button>
              <button onClick={() => { setBookCallSuccess(false); setShowBookCall(true) }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold hover:opacity-90 transition-all">
                {t.bookCall}
              </button>
            </div>

            {/* Right: language selector */}
            <div className="flex items-center px-4 border-l border-[var(--color-border)]">
              <LangSelector lang={lang} setLang={setLang} />
            </div>

          </div>
        </header>

        <div className="flex-1 min-h-0 flex overflow-hidden">

          {/* ── Desktop Sidebar ──────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-[300px] xl:w-[340px] flex-shrink-0 overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-navy-light)]">
            <div className="p-5 space-y-4">

                <Field label={t.currency}>
                  <select className={selectCls} value={form.currency} onChange={set('currency')}>
                    {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>

                <Field label={t.loanAmount}>
                  <PrincipalInput
                    raw={form.principal}
                    onChange={v => setForm(f => ({ ...f, principal: v }))}
                    lang={lang}
                    placeholder="100,000"
                  />
                </Field>

                <Field label={`${t.interestRate} (% ${form.ratePeriod === 'monthly' ? t.perMonth : t.perYear})`}>
                  <div className="flex gap-2">
                    <input type="number" className="flex-1 min-w-0 h-10 bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-lg px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" placeholder="1.5" value={form.rateValue} onChange={set('rateValue')} step="0.01" min={0.001} />
                    <select style={{ width: 90, flexShrink: 0 }} className="h-10 bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-lg px-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors cursor-pointer" value={form.ratePeriod} onChange={set('ratePeriod')}>
                      <option value="monthly">{t.perMonth}</option>
                      <option value="annual">{t.perYear}</option>
                    </select>
                  </div>
                  {params && (
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                      {form.ratePeriod === 'monthly'
                        ? `≈ ${(monthlyToAnnual(params.rateMonthly) * 100).toFixed(2)}% ${t.perYear2}`
                        : `≈ ${(params.rateMonthly * 100).toFixed(4)}% ${t.perMonth2}`}
                    </p>
                  )}
                </Field>

                <Field label={t.periods}>
                  <input type="number" className={fieldCls} placeholder="24" value={form.periods} onChange={set('periods')} min={1} max={600} />
                </Field>

                <Field label={t.startDate}>
                  <input type="date" className={fieldCls} value={form.startDate} onChange={set('startDate')} />
                </Field>

                <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
                  <Field label={t.gracePeriod}>
                    <input type="number" className={fieldCls} placeholder="0" value={form.gracePeriods} onChange={set('gracePeriods')} min={0} />
                  </Field>
                  {graceCount > 0 && (
                    <Field label={t.graceType}>
                      <select className={selectCls} value={form.graceType} onChange={set('graceType')}>
                        <option value="partial">{t.gracePartial}</option>
                        <option value="total">{t.graceTotal}</option>
                      </select>
                    </Field>
                  )}
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
                  <Field label={t.amortSystem}>
                    <select className={selectCls} value={form.type} onChange={set('type')}>
                      {(Object.keys(t.types) as AmortizationType[]).map(k => (
                        <option key={k} value={k}>{t.types[k]}</option>
                      ))}
                    </select>
                  </Field>
                  {form.type === 'GRADIENTE' && (
                    <Field label={t.gradientRate}>
                      <input type="number" className={fieldCls} placeholder="0.5" value={form.gradientRate} onChange={set('gradientRate')} step="0.01" />
                    </Field>
                  )}
                </div>
              {/* System description */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-xs text-[var(--color-text-soft)] leading-relaxed">
                  {form.type === 'SAC' && t.descSAC}
                  {form.type === 'PRICE' && t.descPRICE}
                  {form.type === 'GRADIENTE' && t.descGRADIENTE}
                  {form.type === 'AMERICANO' && t.descAMERICANO}
                </p>
              </div>

              {/* Scenario inputs (when scenarioMode) */}
              {scenarioMode && (
                <div className="border border-[rgba(74,144,217,0.3)] rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-[#4a90d9] tracking-wide uppercase">{t.scenarioAnalysis}</p>
                  <Field label={t.altRate}>
                    <input type="number" className={fieldCls} placeholder={form.rateValue} value={scenarioRate} onChange={e => setScenarioRate(e.target.value)} step="0.01" />
                  </Field>
                  <Field label={t.altPeriods}>
                    <input type="number" className={fieldCls} placeholder={form.periods} value={scenarioPeriods} onChange={e => setScenarioPeriods(e.target.value)} min={1} />
                  </Field>
                </div>
              )}

            </div>
          </aside>

          {/* ── Main scrollable area ─────────────────────────────────── */}
          <div className="flex-1 min-w-0 overflow-y-auto">

            {/* Mobile form */}
            <div className="lg:hidden border-b border-[var(--color-border)] bg-[var(--color-navy-light)] p-4 space-y-4">
              <Field label={t.currency}>
                <select className={selectCls} value={form.currency} onChange={set('currency')}>
                  {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
              <Field label={t.loanAmount}>
                <PrincipalInput raw={form.principal} onChange={v => setForm(f => ({ ...f, principal: v }))} lang={lang} placeholder="100,000" />
              </Field>
              <Field label={`${t.interestRate} (% ${form.ratePeriod === 'monthly' ? t.perMonth : t.perYear})`}>
                <div className="flex gap-2">
                  <input type="number" className="flex-1 min-w-0 h-10 bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-lg px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" placeholder="1.5" value={form.rateValue} onChange={set('rateValue')} step="0.01" min={0.001} />
                  <select style={{ width: 90, flexShrink: 0 }} className="h-10 bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-lg px-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-gold)] transition-colors cursor-pointer" value={form.ratePeriod} onChange={set('ratePeriod')}>
                    <option value="monthly">{t.perMonth}</option>
                    <option value="annual">{t.perYear}</option>
                  </select>
                </div>
              </Field>
              <Field label={t.periods}>
                <input type="number" className={fieldCls} placeholder="24" value={form.periods} onChange={set('periods')} min={1} max={600} />
              </Field>
              <Field label={t.startDate}>
                <input type="date" className={fieldCls} value={form.startDate} onChange={set('startDate')} />
              </Field>
              <Field label={t.amortSystem}>
                <select className={selectCls} value={form.type} onChange={set('type')}>
                  {(Object.keys(t.types) as AmortizationType[]).map(k => (
                    <option key={k} value={k}>{t.types[k]}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <main className="min-w-0 space-y-6">
              <AdUnit slot={AD_SLOT_TOP} />

              {!schedule ? (
                <div className="flex items-center justify-center h-64 text-[var(--color-text-muted)] text-sm">
                  {t.noResults}
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card label={t.totalPaid} value={fmt(schedule.totalPaid)} />
                    <Card label={t.totalInterest} value={fmt(schedule.totalInterest)}
                      sub={params ? `≈ ${(monthlyToAnnual(params.rateMonthly) * 100).toFixed(2)}% ${t.perYear2}` : undefined} />
                    <Card label={t.firstPayment} value={fmt(schedule.firstInstallment)} />
                    <Card label={t.lastPayment} value={fmt(schedule.lastInstallment)} />
                  </div>

                  {/* Debt Runoff */}
                  <div className="bg-[var(--color-navy-light)] border border-[var(--color-border)] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.debtRunoff}</h2>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.debtRunoffSub}</p>
                      </div>
                      <ViewToggle value={viewMode} onChange={setViewMode} t={t} />
                    </div>
                    <div className="mt-5">
                      <RunoffChart rows={schedule.rows} currency={form.currency} lang={lang} t={t} viewMode={viewMode} />
                    </div>
                  </div>

                  {/* System Comparison */}
                  {compareMode && compareSchedules && (
                    <div className="bg-[var(--color-navy-light)] border border-[var(--color-border)] rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.systemComparison}</h2>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {(Object.entries(compareSchedules) as [string, LoanSchedule][]).map(([type, sched]) => (
                          <div key={type} className="bg-[var(--color-navy-surface)] rounded-xl p-4 text-center">
                            <p className="text-[10px] tracking-widest uppercase text-[var(--color-gold)] mb-2">{type}</p>
                            <p className="text-sm text-[var(--color-text-primary)] font-semibold">{fmt(sched.totalPaid)}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{t.totalPaidSub}</p>
                            <p className="text-sm text-[var(--color-text-soft)] font-medium mt-2">{fmt(sched.totalInterest)}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{t.interestSub}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-3">{t.installmentsOverTime}</p>
                      <CompareChart
                        schedules={compareSchedules as unknown as Record<string, LoanSchedule>}
                        currency={form.currency} lang={lang} t={t} viewMode={viewMode}
                      />
                    </div>
                  )}

                  {/* Scenario Analysis */}
                  {scenarioMode && scenarioSchedule && (
                    <div className="bg-[var(--color-navy-light)] border border-[rgba(74,144,217,0.2)] rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.scenarioAnalysis}</h2>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {(() => {
                          const pctDiff = ((scenarioSchedule.totalPaid - schedule.totalPaid) / schedule.totalPaid) * 100
                          const sign = pctDiff > 0 ? '+' : ''
                          const diffColor = pctDiff < 0 ? '#7bc47b' : pctDiff > 0 ? '#e07070' : '#a0a098'
                          return [
                            { label: t.current, sched: schedule, color: 'var(--color-gold)', diff: null },
                            { label: t.alternative, sched: scenarioSchedule, color: '#4a90d9', diff: `${sign}${pctDiff.toFixed(1)}%` },
                          ].map(({ label, sched, color, diff }) => (
                            <div key={label} className="bg-[var(--color-navy-surface)] rounded-xl p-4">
                              <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color }}>{label}</p>
                              <div className="flex items-baseline gap-2">
                                <p className="text-sm text-[var(--color-text-primary)] font-semibold">{fmt(sched.totalPaid)}</p>
                                {diff && <span className="text-xs font-semibold" style={{ color: diffColor }}>{diff}</span>}
                              </div>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{t.totalPaidSub}</p>
                              <p className="text-sm text-[var(--color-text-soft)] mt-1">{fmt(sched.firstInstallment)} → {fmt(sched.lastInstallment)}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">{t.firstToLast}</p>
                            </div>
                          ))
                        })()}
                      </div>
                      <ScenarioChart
                        currentRows={schedule.rows} altRows={scenarioSchedule.rows}
                        currency={form.currency} lang={lang} t={t} viewMode={viewMode}
                      />
                    </div>
                  )}

                  {/* Amortization Schedule table */}
                  <div className="bg-[var(--color-navy-light)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                      <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.amortSchedule}</h2>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {schedule.rows.length} {t.periods2}
                        {graceCount > 0 ? ` · ${graceCount} ${t.grace2}` : ''}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[var(--color-border)] bg-[var(--color-navy-surface)]">
                            {['#', t.date, t.openingBalance, t.amortization, t.interest, t.installment, t.closingBalance].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-[var(--color-text-muted)] font-medium whitespace-nowrap">{h}</th>
                            ))}
                            {scenarioMode && scenarioSchedule && (
                              <>
                                <th className="px-4 py-3 text-left text-[#4a90d9] font-medium whitespace-nowrap border-l border-[rgba(74,144,217,0.2)]">{t.alternative} {t.installment}</th>
                                <th className="px-4 py-3 text-left text-[#4a90d9] font-medium whitespace-nowrap">{t.alternative} {t.closingBalance}</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.rows.map(row => {
                            const altRow = scenarioMode && scenarioSchedule
                              ? scenarioSchedule.rows.find(r => r.period === row.period) ?? null
                              : null
                            return (
                              <tr key={row.period} className={`border-b border-[rgba(201,162,39,0.04)] transition-colors hover:bg-[var(--color-navy-surface)] ${row.isGrace ? 'bg-[rgba(201,162,39,0.03)]' : ''}`}>
                                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">
                                  {row.period}
                                  {row.isGrace && <span className="ml-1 text-[9px] text-[var(--color-gold)] font-semibold">{t.grace}</span>}
                                </td>
                                <td className="px-4 py-2.5 text-[var(--color-text-soft)]">{fmtPeriod(row.date)}</td>
                                <td className="px-4 py-2.5 text-[var(--color-text-primary)]">{fmt(row.openingBalance)}</td>
                                <td className="px-4 py-2.5 text-[var(--color-gold)]">{fmt(row.amortization)}</td>
                                <td className="px-4 py-2.5 text-[var(--color-text-soft)]">{fmt(row.interest)}</td>
                                <td className="px-4 py-2.5 text-[var(--color-text-primary)] font-medium">{fmt(row.installment)}</td>
                                <td className="px-4 py-2.5 text-[var(--color-text-soft)]">{fmt(row.closingBalance)}</td>
                                {altRow !== null && (
                                  <>
                                    <td className="px-4 py-2.5 text-[#4a90d9] border-l border-[rgba(74,144,217,0.15)]">{altRow ? fmt(altRow.installment) : '—'}</td>
                                    <td className="px-4 py-2.5 text-[#6aabea]">{altRow ? fmt(altRow.closingBalance) : '—'}</td>
                                  </>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[var(--color-navy-surface)] border-t border-[var(--color-border)]">
                            <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)]">{t.total}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-[var(--color-gold)]">{fmt(schedule.totalAmortization)}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-[var(--color-text-soft)]">{fmt(schedule.totalInterest)}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-[var(--color-text-primary)]">{fmt(schedule.totalPaid)}</td>
                            <td />
                            {scenarioMode && scenarioSchedule && (
                              <>
                                <td className="px-4 py-3 text-xs font-semibold text-[#4a90d9] border-l border-[rgba(74,144,217,0.15)]">{fmt(scenarioSchedule.totalPaid)}</td>
                                <td />
                              </>
                            )}
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <AdUnit slot={AD_SLOT_BTM} />

                  {/* Footer CTA */}
                  <div className="bg-[var(--color-navy-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{t.ctaTitle}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.ctaSub}</p>
                    </div>
                    <a href="https://pedrororiz.com/agendar" target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] transition-all">
                      {t.ctaBtn}
                    </a>
                  </div>
                </>
              )}
            </main>
            </div>

            <footer className="border-t border-[var(--color-border)] py-8">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Free tool by{' '}
                  <a href="https://pedrororiz.com" className="text-[var(--color-gold)] hover:opacity-80">Pedro Roriz</a>
                  {' '}· Results are illustrative, not financial advice.
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">© {new Date().getFullYear()} Pedro Roriz</p>
              </div>
            </footer>
          </div>

        </div>
      </div>
    </>
  )
}
