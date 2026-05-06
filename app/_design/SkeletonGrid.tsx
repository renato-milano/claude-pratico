'use client'

import { Mode, MODES, modeColor } from './tokens'

export function SkeletonGrid() {
  const modes = ['Chat', 'Cowork', 'Code'] as Mode[]
  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-8 pb-20">
      <div className="border-t pt-10 mb-8" style={{ borderColor: 'var(--line)' }}>
        <div
          className="text-[11px] font-mono-ui uppercase tracking-[0.2em] mb-2"
          style={{ color: 'var(--ink-faint)' }}
        >
          Sto disegnando i tuoi scenari…
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {modes.map((mode) => (
          <div key={mode}>
            <div
              className="flex items-center gap-2.5 mb-4 pb-3"
              style={{ borderBottom: '1px solid var(--line)' }}
            >
              <span
                style={{ width: 10, height: 10, borderRadius: 999, background: modeColor(mode), opacity: 0.5 }}
              />
              <span
                className="font-serif-display text-[20px]"
                style={{ color: 'var(--ink-muted)' }}
              >
                {mode}
              </span>
              <span
                className="text-[11px] font-mono-ui"
                style={{ color: 'var(--ink-faint)' }}
              >
                {MODES[mode].desc}
              </span>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[18px] p-5"
                  style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
                >
                  <div
                    className="h-3 rounded shimmer mb-3"
                    style={{ width: 50 }}
                  />
                  <div className="h-4 rounded shimmer mb-2" style={{ width: '85%' }} />
                  <div className="h-3 rounded shimmer mb-1.5" style={{ width: '95%' }} />
                  <div className="h-3 rounded shimmer mb-1.5" style={{ width: '70%' }} />
                  <div className="h-3 rounded shimmer mt-3" style={{ width: 80 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
