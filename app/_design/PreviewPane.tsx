'use client'

import { Dot } from './Primitives'
import { modeBorder, modeColor } from './tokens'

const SAMPLE = {
  title: 'Brief settimanale sui competitor',
  desc: 'Sintetizza newsletter, post LinkedIn e siti dei principali competitor in un report leggibile in 5 minuti.',
}

export function PreviewPane({ contextScore }: { contextScore: number }) {
  return (
    <div className="relative">
      <div
        className="text-[11px] font-mono-ui uppercase tracking-[0.2em] mb-3 flex items-center gap-2"
        style={{ color: 'var(--ink-faint)' }}
      >
        <span style={{ width: 18, height: 1, background: 'var(--ink-faint)' }} />
        Anteprima
      </div>
      <div
        className="relative rounded-[20px] p-5 md:p-6"
        style={{ background: 'var(--paper-soft)', border: '1px solid var(--line)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] font-mono-ui" style={{ color: 'var(--ink-muted)' }}>
            <span style={{ color: 'var(--ink-faint)' }}>output_preview/</span>scenari.json
          </div>
          <div className="flex gap-1">
            <span style={{ width: 8, height: 8, borderRadius: 999, background: modeColor('Chat') }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: modeColor('Cowork') }} />
            <span style={{ width: 8, height: 8, borderRadius: 999, background: modeColor('Code') }} />
          </div>
        </div>

        {/* Sample real card */}
        <div
          className="rounded-2xl p-5 mb-3"
          style={{ background: 'var(--paper)', border: `1px solid ${modeBorder('Chat')}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Dot mode="Chat" />
            <span
              className="text-[10px] font-mono-ui uppercase tracking-[0.18em]"
              style={{ color: modeColor('Chat', 0.5) }}
            >
              Chat
            </span>
          </div>
          <div
            className="font-serif-display text-[18px] leading-tight mb-2"
            style={{ color: 'var(--ink)' }}
          >
            {SAMPLE.title}
          </div>
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-muted)' }}>
            {SAMPLE.desc}
          </div>
        </div>

        {/* Skeletons */}
        {([['Cowork', 0], ['Code', 1]] as const).map(([mode, i]) => (
          <div
            key={mode}
            className="rounded-2xl p-5 mb-3"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: modeColor(mode),
                  opacity: 0.4,
                }}
              />
              <span
                className="font-mono-ui text-[10px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--ink-faint)' }}
              >
                {mode}
              </span>
            </div>
            <div className="h-3.5 rounded shimmer" style={{ width: '70%', marginBottom: 8 }} />
            <div className="h-2.5 rounded shimmer" style={{ width: '95%', marginBottom: 4 }} />
            <div className="h-2.5 rounded shimmer" style={{ width: '60%' }} />
            {/* hint to suppress unused warning */}
            <span className="hidden">{i}</span>
          </div>
        ))}

        <div
          className="mt-4 flex items-center justify-between text-[11px] font-mono-ui"
          style={{ color: 'var(--ink-faint)' }}
        >
          <span>~9 scenari attesi</span>
          <span>
            {contextScore < 2 ? 'qualità: bassa' : contextScore < 4 ? 'qualità: media' : 'qualità: alta'}
          </span>
        </div>
      </div>

      <p
        className="mt-4 text-[12px] italic leading-relaxed"
        style={{ color: 'var(--ink-faint)' }}
      >
        Esempio. I tuoi scenari saranno specifici al ruolo e ai tool che hai indicato.
      </p>
    </div>
  )
}
