'use client'

import { KeyboardEvent, useState } from 'react'
import { Chip, Field, Spinner, ToolIcon } from './Primitives'
import {
  ROLE_CHIPS, ROLE_EXAMPLES, SECTOR_CHIPS,
  TOOL_CATEGORIES, TOOL_CHIPS, SECTOR_TOOL_DEFAULTS, modeColor,
} from './tokens'
import { PreviewPane } from './PreviewPane'

export interface FormState {
  role: string
  setRole: (v: string) => void
  sector: string
  onSectorClick: (s: string) => void
  customSector: string
  setCustomSector: (v: string) => void
  tools: string[]
  toggleTool: (v: string) => void
  resetTools: () => void
  canSubmit: boolean
  loading: boolean
  onSubmit: () => void
  contextScore: number
}

export function Hero({ form, onKeyDown }: { form: FormState; onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void }) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-16 md:pb-20 grid grid-cols-12 gap-8 md:gap-12">
      {/* LEFT — form */}
      <div className="col-span-12 lg:col-span-7">
        <div
          className="mb-3 inline-flex items-center gap-2 text-[11px] font-mono-ui uppercase tracking-[0.2em]"
          style={{ color: 'var(--ink-faint)' }}
        >
          <span style={{ width: 18, height: 1, background: 'var(--ink-faint)' }} />
          Capitolo 01 · Il tuo lavoro
        </div>
        <h1
          className="font-serif-display text-[42px] sm:text-[52px] lg:text-[64px] leading-[1.02] tracking-[-0.02em] mb-5"
          style={{ color: 'var(--ink)' }}
        >
          Cosa farebbe Claude{' '}
          <em className="italic" style={{ color: 'var(--clay)' }}>nel tuo lavoro?</em>
        </h1>
        <p
          className="text-[16px] md:text-[17px] leading-relaxed max-w-[52ch] mb-10 md:mb-12"
          style={{ color: 'var(--ink-muted)' }}
        >
          Descrivi il tuo ruolo, il settore e gli strumenti che usi. I tre modi di lavorare con
          Claude ({' '}
          <span style={{ color: modeColor('Chat') }}>chat</span>,{' '}
          <span style={{ color: modeColor('Cowork') }}>cowork</span> e{' '}
          <span style={{ color: modeColor('Code') }}>code</span>) diventano scenari reali, calati
          sulla tua giornata.
        </p>

        <div className="space-y-9">
          <Field index="01" label="Descrivi il tuo ruolo" hint="o scegli un esempio sotto">
            <textarea
              value={form.role}
              onChange={(e) => form.setRole(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Es. gestisco le campagne digital per un brand di moda, coordino un team di 4 persone…"
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
            <div className="flex flex-wrap gap-2 mt-3">
              {ROLE_CHIPS.map((c) => (
                <Chip
                  key={c}
                  active={form.role === ROLE_EXAMPLES[c]}
                  onClick={() => form.setRole(ROLE_EXAMPLES[c] ?? c)}
                  onMouseEnter={() => setHoveredRole(c)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  {c}
                </Chip>
              ))}
            </div>

            <div
              style={{
                maxHeight: hoveredRole ? '80px' : '0px',
                opacity: hoveredRole ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 220ms ease, opacity 180ms ease',
                marginTop: hoveredRole ? 10 : 0,
              }}
            >
              <p
                className="text-[13px] italic leading-relaxed px-1"
                style={{ color: 'var(--ink-faint)' }}
              >
                {hoveredRole ? `"${ROLE_EXAMPLES[hoveredRole]}"` : ''}
              </p>
            </div>
          </Field>

          <Field index="02" label="Settore" hint="opzionale">
            <div className="flex flex-wrap gap-2">
              {SECTOR_CHIPS.map((s) => (
                <Chip
                  key={s}
                  active={form.sector === s}
                  onClick={() => form.onSectorClick(s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
            {form.sector === 'Altro' && (
              <input
                autoFocus
                value={form.customSector}
                onChange={(e) => form.setCustomSector(e.target.value)}
                placeholder="Es. Logistica, Pubblica amministrazione, Editoria…"
                className="mt-3 w-full px-5 py-3 text-[15px] focus:outline-none"
                style={{
                  background: 'var(--paper-soft)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  color: 'var(--ink)',
                }}
              />
            )}
          </Field>

          <ToolsField
            tools={form.tools}
            toggleTool={form.toggleTool}
            sector={form.sector}
            resetTools={form.resetTools}
          />

          <div className="pt-2 flex items-center gap-5 flex-wrap">
            <button
              type="button"
              onClick={form.onSubmit}
              disabled={!form.canSubmit || form.loading}
              className="px-8 py-4 text-[15px] font-medium tracking-tight transition-all"
              style={{
                background: !form.canSubmit ? 'var(--line)' : 'var(--ink)',
                color: !form.canSubmit ? 'var(--ink-faint)' : 'var(--paper)',
                borderRadius: 14,
                cursor: !form.canSubmit || form.loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (form.canSubmit && !form.loading) e.currentTarget.style.background = 'var(--clay)'
              }}
              onMouseLeave={(e) => {
                if (form.canSubmit && !form.loading) e.currentTarget.style.background = 'var(--ink)'
              }}
            >
              {form.loading ? (
                <span className="flex items-center gap-3">
                  <Spinner /> Sto leggendo il tuo contesto…
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  Genera scenari
                  <span className="font-serif-display italic">→</span>
                </span>
              )}
            </button>
            <div className="text-[12px] font-mono-ui" style={{ color: 'var(--ink-faint)' }}>
              {form.contextScore < 2
                ? 'Aggiungi più contesto per scenari più nitidi'
                : form.contextScore < 4
                  ? 'Buono. Più strumenti → più precisione.'
                  : 'Contesto ricco. Andiamo.'}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — preview */}
      <aside className="col-span-12 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
        <PreviewPane contextScore={form.contextScore} />
      </aside>
    </section>
  )
}

const TOOL_ITEM_MAP = Object.fromEntries(
  TOOL_CATEGORIES.flatMap((c) => c.tools.map((t) => [t.name, t.icon]))
)

function ToolsField({
  tools,
  toggleTool,
  sector,
  resetTools,
}: {
  tools: string[]
  toggleTool: (t: string) => void
  sector: string
  resetTools: () => void
}) {
  const [query, setQuery] = useState('')

  const defaults = sector ? (SECTOR_TOOL_DEFAULTS[sector] ?? []) : []
  const isCustomized =
    sector
      ? tools.length !== defaults.length || tools.some((t) => !defaults.includes(t))
      : false

  const toolsHint =
    tools.length === 0
      ? 'seleziona tutti quelli che usi'
      : `${tools.length} selezionati${isCustomized ? ' · personalizzati' : ''}`

  const filtered =
    query.trim().length > 0
      ? TOOL_CHIPS.filter(
          (t) =>
            t.toLowerCase().includes(query.trim().toLowerCase()) && !tools.includes(t)
        )
      : []

  const canAddCustom =
    query.trim().length > 1 &&
    !TOOL_CHIPS.some((t) => t.toLowerCase() === query.trim().toLowerCase()) &&
    !tools.includes(query.trim())

  const handleAdd = (name: string) => {
    if (!tools.includes(name)) toggleTool(name)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filtered.length > 0) handleAdd(filtered[0])
      else if (canAddCustom) handleAdd(query.trim())
    }
  }

  return (
    <Field index="03" label="Strumenti del tuo stack" hint={toolsHint}>
      <div className="space-y-3">
        {tools.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {tools.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-mono-ui"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  border: '1px solid var(--ink)',
                }}
              >
                {TOOL_ITEM_MAP[t] && (
                  <span style={{ opacity: 0.7, display: 'flex' }}>
                    <ToolIcon slug={TOOL_ITEM_MAP[t]} size={11} />
                  </span>
                )}
                {t}
                <button
                  type="button"
                  onClick={() => toggleTool(t)}
                  className="ml-0.5 transition-opacity hover:opacity-100"
                  style={{ opacity: 0.55, lineHeight: 1, fontSize: 15 }}
                  aria-label={`Rimuovi ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
            {isCustomized && sector && (
              <button
                type="button"
                onClick={resetTools}
                className="text-[11px] font-mono-ui underline underline-offset-2 hover:opacity-60 transition-opacity"
                style={{ color: 'var(--ink-faint)' }}
              >
                ripristina starter pack
              </button>
            )}
          </div>
        )}

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{ border: '1px solid var(--line)', background: 'var(--paper-soft)' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink-muted)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" style={{ color: 'var(--ink-faint)', flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cerca o aggiungi – es. mail, excel, oppure il tuo tool custom"
            className="flex-1 text-[13px] bg-transparent focus:outline-none"
            style={{ color: 'var(--ink)' }}
          />
          <span className="text-[11px] font-mono-ui flex-shrink-0" style={{ color: 'var(--ink-faint)' }}>
            {TOOL_CHIPS.length}+ tool
          </span>
        </div>

        {query.trim().length > 0 && (filtered.length > 0 || canAddCustom) && (
          <div className="flex flex-wrap gap-2">
            {filtered.slice(0, 10).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAdd(t)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-mono-ui transition-all hover:opacity-70"
                style={{
                  border: '1px solid var(--line)',
                  color: 'var(--ink-muted)',
                  background: 'var(--paper)',
                }}
              >
                {TOOL_ITEM_MAP[t] && (
                  <span style={{ opacity: 0.55, display: 'flex' }}>
                    <ToolIcon slug={TOOL_ITEM_MAP[t]} size={11} />
                  </span>
                )}
                {t}
              </button>
            ))}
            {canAddCustom && (
              <button
                type="button"
                onClick={() => handleAdd(query.trim())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-mono-ui transition-all hover:opacity-70"
                style={{
                  border: '1px dashed var(--ink-faint)',
                  color: 'var(--ink-faint)',
                  background: 'transparent',
                }}
              >
                + Aggiungi &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
    </Field>
  )
}
