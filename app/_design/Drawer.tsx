'use client'

import { useEffect, useState } from 'react'
import { Dot } from './Primitives'
import { Detail, Scenario, modeBg, modeBorder, modeColor } from './tokens'

export function Drawer({
  scenario,
  role,
  tools = [],
  onClose,
}: {
  scenario: Scenario | null
  role: string
  tools?: string[]
  onClose: () => void
}) {
  const open = !!scenario
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Fetch detail when scenario changes
  useEffect(() => {
    if (!scenario) return
    let cancelled = false
    setDetail(null)
    setError(false)
    setLoading(true)
    fetch('/api/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: scenario.mode,
        title: scenario.title,
        description: scenario.description,
        role,
        tools,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [scenario, role])

  const handleCopy = () => {
    if (!detail) return
    navigator.clipboard.writeText(detail.example_prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mode = scenario?.mode

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: 'rgba(20, 15, 10, 0.25)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-40 w-full md:w-[540px] overflow-y-auto"
        style={{
          background: 'var(--paper)',
          borderLeft: '1px solid var(--line)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: open ? '-24px 0 60px -20px rgba(20,15,10,0.18)' : 'none',
        }}
      >
        {scenario && mode && (
          <>
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-7 py-5"
              style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}
            >
              <div className="flex items-center gap-2.5">
                <Dot mode={mode} />
                <span
                  className="text-[10px] font-mono-ui uppercase tracking-[0.2em]"
                  style={{ color: modeColor(mode, 0.5) }}
                >
                  {mode}
                </span>
                <span
                  className="text-[11px] font-mono-ui"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  · come farlo
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:opacity-70"
                style={{ color: 'var(--ink-muted)' }}
                aria-label="Chiudi"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="px-7 py-8">
              <h2
                className="font-serif-display text-[28px] md:text-[34px] leading-[1.05] tracking-tight mb-5"
                style={{ color: 'var(--ink)' }}
              >
                {scenario.title}
              </h2>
              <p
                className="text-[15px] leading-relaxed mb-8"
                style={{ color: 'var(--ink-muted)' }}
              >
                {scenario.description}
              </p>

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div
                    className="w-9 h-9 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: 'var(--line)',
                      borderTopColor: mode ? modeColor(mode, 0.7) : 'var(--ink)',
                    }}
                  />
                  <span
                    className="text-[12px] font-mono-ui uppercase tracking-[0.18em]"
                    style={{ color: 'var(--ink-faint)' }}
                  >
                    Attendi, sto preparando i passaggi…
                  </span>
                </div>
              )}

              {error && !loading && (
                <p className="text-[14px] mb-6" style={{ color: 'oklch(0.55 0.18 25)' }}>
                  Errore nel caricamento. Chiudi e riapri per riprovare.
                </p>
              )}

              {detail && !loading && (
                <>
                  <Section index="01" label="Approccio">
                    <p className="text-[14.5px] leading-[1.65]" style={{ color: 'var(--ink)' }}>
                      {detail.how_to}
                    </p>
                  </Section>

                  <Section index="02" label="Passaggi">
                    <ol className="space-y-3">
                      {detail.steps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span
                            className="font-mono-ui text-[12px] flex-shrink-0 mt-0.5"
                            style={{ color: modeColor(mode, 0.5) }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="text-[14.5px] leading-[1.6]"
                            style={{ color: 'var(--ink)' }}
                          >
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </Section>

                  <Section
                    index="03"
                    label="Prompt di esempio"
                    actions={
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-[11px] font-mono-ui px-2.5 py-1 rounded-md transition-colors hover:opacity-70"
                        style={{ border: '1px solid var(--line)', color: 'var(--ink-muted)' }}
                      >
                        {copied ? 'Copiato' : 'Copia'}
                      </button>
                    }
                  >
                    <pre
                      className="text-[13px] leading-[1.6] font-mono-ui p-5 rounded-2xl whitespace-pre-wrap overflow-auto"
                      style={{
                        background: modeBg(mode),
                        border: `1px solid ${modeBorder(mode)}`,
                        color: 'var(--ink)',
                      }}
                    >
                      {detail.example_prompt}
                    </pre>
                  </Section>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function Section({
  index,
  label,
  actions,
  children,
}: {
  index: string
  label: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-mono-ui text-[11px] tracking-[0.15em]"
            style={{ color: 'var(--ink-faint)' }}
          >
            {index}
          </span>
          <span
            className="font-serif-display text-[16px] tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            {label}
          </span>
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
