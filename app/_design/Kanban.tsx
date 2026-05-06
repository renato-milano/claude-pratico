'use client'

import { useState } from 'react'
import { generatePDF } from '@/lib/generatePDF'
import { Dot } from './Primitives'
import { Mode, MODES, Scenario, modeBg, modeBorder, modeColor } from './tokens'

export function Kanban({
  scenarios,
  onOpen,
  roleContext = '',
}: {
  scenarios: Record<Mode, Scenario[]>
  onOpen: (s: Scenario) => void
  roleContext?: string
}) {
  const modes = ['Chat', 'Cowork', 'Code'] as Mode[]
  const total = modes.reduce((acc, m) => acc + (scenarios[m]?.length ?? 0), 0)
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await generatePDF(scenarios, roleContext)
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-8 pb-20 md:pb-24">
      <div className="border-t pt-10 md:pt-12 mb-8 md:mb-10" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-4">
          <div>
            <div
              className="text-[11px] font-mono-ui uppercase tracking-[0.2em] mb-2"
              style={{ color: 'var(--ink-faint)' }}
            >
              Capitolo 02 · Gli scenari
            </div>
            <h2
              className="font-serif-display text-[32px] md:text-[40px] tracking-tight leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              Tre modi, <em className="italic" style={{ color: 'var(--clay)' }}>{total} possibilità</em>
              <span className="text-[22px] md:text-[28px] font-sans not-italic" style={{ color: 'var(--ink-faint)' }}> (tra le tante)</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ToolbarButton onClick={handleExportPDF} disabled={exporting}>
              {exporting ? 'Generazione…' : 'Esporta PDF'}
            </ToolbarButton>
            <ToolbarButton>Copia link</ToolbarButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {modes.map((mode, colIdx) => {
          const items = scenarios[mode] || []
          if (items.length === 0) return null
          return (
            <div key={mode} className="flex flex-col">
              {/* Column header */}
              <div
                className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: `1px solid ${modeBorder(mode)}` }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    style={{ width: 10, height: 10, borderRadius: 999, background: modeColor(mode) }}
                  />
                  <span className="font-serif-display text-[20px]" style={{ color: 'var(--ink)' }}>
                    {mode}
                  </span>
                  <span className="text-[11px] font-mono-ui" style={{ color: 'var(--ink-faint)' }}>
                    {MODES[mode].desc}
                  </span>
                </div>
                <span
                  className="text-[11px] font-mono-ui"
                  style={{ color: modeColor(mode, 0.5) }}
                >
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>

              <div className="grid gap-3" style={{ gridAutoRows: '1fr' }}>
                {items.map((s, i) => (
                  <ScenarioCard
                    key={`${mode}-${i}`}
                    scenario={s}
                    delay={(colIdx * 3 + i) * 60}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ToolbarButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3.5 py-2 text-[12px] font-mono-ui rounded-lg transition-colors hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ border: '1px solid var(--line)', color: 'var(--ink-muted)' }}
    >
      {children}
    </button>
  )
}

function ScenarioCard({
  scenario,
  delay,
  onOpen,
}: {
  scenario: Scenario
  delay: number
  onOpen: (s: Scenario) => void
}) {
  const [hover, setHover] = useState(false)
  const mode = scenario.mode

  return (
    <article
      onClick={() => onOpen(scenario)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group cursor-pointer rounded-[18px] p-5 transition-all duration-300 stagger-in flex flex-col h-full"
      style={{
        background: hover ? modeBg(mode) : 'var(--paper)',
        border: `1px solid ${hover ? modeBorder(mode) : 'var(--line)'}`,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 8px 24px -12px ${modeColor(mode, 0.6, 0.08)}`
          : '0 1px 0 rgba(20,15,10,0.02)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dot mode={mode} />
          <span
            className="text-[10px] font-mono-ui uppercase tracking-[0.18em]"
            style={{ color: modeColor(mode, 0.5) }}
          >
            {mode}
          </span>
        </div>
        <span
          className="font-serif-display italic transition-all"
          style={{
            fontSize: 18,
            color: hover ? modeColor(mode, 0.5) : 'var(--ink-faint)',
            transform: hover ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          →
        </span>
      </div>
      <h3
        className="font-serif-display text-[19px] leading-[1.2] tracking-tight mb-2"
        style={{ color: 'var(--ink)' }}
      >
        {scenario.title}
      </h3>
      <p className="text-[13.5px] leading-[1.55] flex-1" style={{ color: 'var(--ink-muted)' }}>
        {scenario.description}
      </p>
      <div
        className="mt-4 flex items-center gap-2 text-[11px] font-mono-ui"
        style={{ color: hover ? modeColor(mode, 0.5) : 'var(--ink-faint)' }}
      >
        <span>Apri come farlo</span>
        <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.3 }} />
      </div>
    </article>
  )
}
