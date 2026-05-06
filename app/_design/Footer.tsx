'use client'

import { MODES, modeColor } from './tokens'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--paper-soft)' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12 md:py-14 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
                <span
                  key={m}
                  style={{ width: 5, height: 14, borderRadius: 1, background: modeColor(m) }}
                />
              ))}
            </div>
            <span
              className="font-serif-display text-[15px]"
              style={{ color: 'var(--ink)' }}
            >
              Claude Potential Map
            </span>
          </div>
          <p
            className="text-[13.5px] leading-relaxed max-w-[36ch]"
            style={{ color: 'var(--ink-muted)' }}
          >
            Una mappa per capire dove Claude può davvero cambiare il tuo lavoro. Tre modalità, casi
            reali, prompt pronti.
          </p>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div
            className="text-[10px] font-mono-ui uppercase tracking-[0.18em] mb-3"
            style={{ color: 'var(--ink-faint)' }}
          >
            Risorse
          </div>
          <ul className="space-y-2 text-[13px]" style={{ color: 'var(--ink-muted)' }}>
            <li>
              <a className="hover:underline" href="https://docs.anthropic.com" target="_blank" rel="noreferrer">Documentazione Claude</a>
            </li>
            <li>
              <a className="hover:underline" href="https://claude.ai" target="_blank" rel="noreferrer">Apri Claude</a>
            </li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div
            className="text-[10px] font-mono-ui uppercase tracking-[0.18em] mb-3"
            style={{ color: 'var(--ink-faint)' }}
          >
            Holyn
          </div>
          <ul className="space-y-2 text-[13px]" style={{ color: 'var(--ink-muted)' }}>
            <li>
              <a className="hover:underline" href="https://holyn.it" target="_blank" rel="noreferrer">Studio</a>
            </li>
            <li>
              <a className="hover:underline" href="https://www.holyn.it/#contact" target="_blank" rel="noreferrer">Contatti</a>
            </li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div
            className="text-[10px] font-mono-ui uppercase tracking-[0.18em] mb-3"
            style={{ color: 'var(--ink-faint)' }}
          >
            Modello
          </div>
          <div
            className="text-[12px] font-mono-ui leading-relaxed"
            style={{ color: 'var(--ink-muted)' }}
          >
            Claude Sonnet 4.6
            <br />
            <span style={{ color: 'var(--ink-faint)' }}>Anthropic · 2026</span>
          </div>
        </div>
        <div
          className="col-span-12 pt-8 mt-2 flex items-center justify-between text-[11px] font-mono-ui flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--line)', color: 'var(--ink-faint)' }}
        >
          <span>© 2026 Holyn · Studio di consulenza AI · Milano</span>
          <span>Made with care · v1.2</span>
        </div>
      </div>
    </footer>
  )
}
