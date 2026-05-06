'use client'

import { MODES, modeColor } from '../_design/tokens'

export function TopBar({ contextScore }: { contextScore: number }) {
  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: 'rgba(248, 245, 240, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
              <span
                key={m}
                style={{ width: 6, height: 18, borderRadius: 2, background: modeColor(m) }}
              />
            ))}
          </div>
          <span
            className="font-serif-display text-[18px] tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Claude Potential Map
          </span>
          <span
            className="hidden sm:inline-block text-[11px] font-mono-ui uppercase tracking-[0.15em]"
            style={{
              color: 'var(--ink-faint)',
              borderLeft: '1px solid var(--line)',
              paddingLeft: 12,
              marginLeft: 4,
            }}
          >
            v1 · IT
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div
            className="hidden md:flex items-center gap-2 text-[12px] font-mono-ui"
            style={{ color: 'var(--ink-faint)' }}
          >
            <span>contesto</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 14,
                    height: 4,
                    borderRadius: 1,
                    background: i < contextScore ? 'var(--ink)' : 'var(--line)',
                    transition: 'background 200ms',
                  }}
                />
              ))}
            </div>
            <span style={{ color: 'var(--ink-muted)' }}>{contextScore}/5</span>
          </div>
          <span className="text-[12px] font-mono-ui" style={{ color: 'var(--ink-faint)' }}>
            by Holyn
          </span>
        </div>
      </div>
    </header>
  )
}
