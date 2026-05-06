'use client'

import { useState } from 'react'
import { ProcessStep, ProcessFeature, Mode, modeColor, modeBg, modeBorder } from './tokens'
import { Dot, Spinner } from './Primitives'

export function ProcessSection({
  roleContext,
  tools,
}: {
  roleContext: string
  tools: string[]
}) {
  const [processInput, setProcessInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<ProcessStep[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!processInput.trim() || loading) return
    setLoading(true)
    setSteps(null)
    setError(null)
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleContext, tools, process: processInput }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setSteps(data.steps)
    } catch {
      setError('Ci sono molti utenti in coda, riprova tra qualche minuto.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section
      className="w-full"
      style={{ borderTop: '1px solid var(--line)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">

        {/* Header */}
        <div className="mb-8">
          <div
            className="text-[11px] font-mono-ui uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--ink-faint)' }}
          >
            Capitolo 03 · Il tuo processo
          </div>
          <h2
            className="font-serif-display text-[28px] md:text-[36px] tracking-tight leading-tight mb-3"
            style={{ color: 'var(--ink)' }}
          >
            Hai un processo specifico?{' '}
            <em className="italic" style={{ color: 'var(--clay)' }}>
              Vediamo dove entra Claude.
            </em>
          </h2>
          <p className="text-[15px] leading-relaxed max-w-[56ch]" style={{ color: 'var(--ink-muted)' }}>
            Descrivi un flusso di lavoro che già gestisci. Ottieni una sequenza di step operativi con prompt pronti da usare.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-[720px] mb-8">
          <textarea
            value={processInput}
            onChange={(e) => setProcessInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
            placeholder="Es. ogni settimana raccolgo i dati di vendita da HubSpot, li elaboro in Excel, preparo una slide per il team e mando un riassunto via email al direttore…"
            rows={3}
            className="w-full px-5 py-4 text-[15px] resize-none focus:outline-none transition-all"
            style={{
              background: 'var(--paper-soft)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              color: 'var(--ink)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink)'
              e.currentTarget.style.background = 'var(--paper)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)'
              e.currentTarget.style.background = 'var(--paper-soft)'
            }}
          />
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!processInput.trim() || loading}
              className="px-6 py-3 text-[14px] font-medium tracking-tight transition-all"
              style={{
                background: !processInput.trim() ? 'var(--line)' : 'var(--ink)',
                color: !processInput.trim() ? 'var(--ink-faint)' : 'var(--paper)',
                borderRadius: 12,
                cursor: !processInput.trim() || loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (processInput.trim() && !loading) e.currentTarget.style.background = 'var(--clay)' }}
              onMouseLeave={(e) => { if (processInput.trim() && !loading) e.currentTarget.style.background = 'var(--ink)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2"><Spinner /> Analisi in corso…</span>
              ) : (
                <span className="flex items-center gap-2">
                  Analizza il processo
                  <span className="font-serif-display italic">→</span>
                </span>
              )}
            </button>
            <span className="text-[12px] font-mono-ui" style={{ color: 'var(--ink-faint)' }}>
              ⌘ + Enter
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[13px] mb-6" style={{ color: 'oklch(0.55 0.18 25)' }}>{error}</p>
        )}

        {/* Steps */}
        {steps && steps.length > 0 && (
          <div className="space-y-4">
            {steps.map((step) => (
              <ProcessCard
                key={step.step}
                step={step}
                copied={copied === step.step}
                onCopy={() => handleCopy(step.prompt, step.step)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProcessCard({
  step,
  copied,
  onCopy,
}: {
  step: ProcessStep
  copied: boolean
  onCopy: () => void
}) {
  const { mode } = step
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-[18px] overflow-hidden"
      style={{
        border: `1px solid ${modeBorder(mode)}`,
        background: 'var(--paper)',
      }}
    >
      {/* Card header */}
      <div
        className="flex items-start gap-4 p-5 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
        style={{ background: expanded ? modeBg(mode) : 'var(--paper)' }}
      >
        {/* Step number */}
        <span
          className="font-mono-ui text-[11px] mt-0.5 flex-shrink-0 w-6 text-right"
          style={{ color: modeColor(mode, 0.5) }}
        >
          {String(step.step).padStart(2, '0')}
        </span>

        {/* Mode + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Dot mode={mode} size={7} />
            <span
              className="text-[10px] font-mono-ui uppercase tracking-[0.16em]"
              style={{ color: modeColor(mode, 0.5) }}
            >
              {mode}
            </span>
            {step.feature && <FeatureBadge feature={step.feature} />}
          </div>
          <h3
            className="font-serif-display text-[18px] leading-snug tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            {step.title}
          </h3>
        </div>

        {/* Expand toggle */}
        <span
          className="font-serif-display italic text-[18px] transition-transform flex-shrink-0"
          style={{
            color: modeColor(mode, 0.5),
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          →
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-5 pb-5 pt-1 border-t"
          style={{ borderColor: modeBorder(mode) }}
        >
          {/* Action description */}
          <p
            className="text-[14px] leading-[1.6] mb-5"
            style={{ color: 'var(--ink-muted)' }}
          >
            {step.action}
          </p>

          {/* Prompt box */}
          <div
            className="rounded-xl p-4"
            style={{ background: modeBg(mode), border: `1px solid ${modeBorder(mode)}` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] font-mono-ui uppercase tracking-[0.15em]"
                style={{ color: modeColor(mode, 0.5) }}
              >
                Prompt esempio
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onCopy() }}
                className="text-[11px] font-mono-ui transition-opacity hover:opacity-70"
                style={{ color: modeColor(mode, 0.55) }}
              >
                {copied ? 'Copiato ✓' : 'Copia'}
              </button>
            </div>
            <p
              className="text-[13px] leading-[1.65] font-mono-ui whitespace-pre-wrap"
              style={{ color: 'var(--ink-muted)' }}
            >
              {step.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const FEATURE_COLORS: Record<ProcessFeature, { bg: string; text: string; border: string }> = {
  'Projects':        { bg: 'oklch(0.96 0.02 285)', text: 'oklch(0.50 0.12 285)', border: 'oklch(0.88 0.05 285)' },
  'Skills':          { bg: 'oklch(0.96 0.02 245)', text: 'oklch(0.50 0.12 245)', border: 'oklch(0.88 0.05 245)' },
  'Scheduled Tasks': { bg: 'oklch(0.96 0.02 35)',  text: 'oklch(0.50 0.12 35)',  border: 'oklch(0.88 0.05 35)'  },
}

function FeatureBadge({ feature }: { feature: ProcessFeature }) {
  const c = FEATURE_COLORS[feature]
  return (
    <span
      className="text-[9.5px] font-mono-ui px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {feature}
    </span>
  )
}
