'use client'

import { KeyboardEvent, useMemo, useState } from 'react'
import { TopBar } from './_design/TopBar'
import { Hero } from './_design/Hero'
import { Kanban } from './_design/Kanban'
import { Drawer } from './_design/Drawer'
import { SkeletonGrid } from './_design/SkeletonGrid'
import { Footer } from './_design/Footer'
import { NextSteps } from './_design/NextSteps'
import { Mode, Scenario, SECTOR_TOOL_DEFAULTS } from './_design/tokens'

export default function Home() {
  const [role, setRole] = useState('')
  const [sector, setSector] = useState('')
  const [customSector, setCustomSector] = useState('')
  const [tools, setTools] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openScenario, setOpenScenario] = useState<Scenario | null>(null)

  const toggleTool = (t: string) =>
    setTools((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))

  const handleSectorClick = (s: string) => {
    const newSector = sector === s ? '' : s
    setSector(newSector)
    setTools(newSector ? (SECTOR_TOOL_DEFAULTS[newSector] ?? []) : [])
  }

  const resetTools = () => setTools(sector ? (SECTOR_TOOL_DEFAULTS[sector] ?? []) : [])

  // Context score (0–5): drives header progress + button hint
  const contextScore = useMemo(() => {
    let s = 0
    if (role.trim().length > 4) s++
    if (role.trim().length > 30) s++
    if (sector) s++
    if (tools.length > 0) s++
    if (tools.length > 3) s++
    return Math.min(5, s)
  }, [role, sector, tools])

  const buildRoleContext = () => {
    const parts: string[] = []
    if (role.trim()) parts.push(`Ruolo: ${role.trim()}`)
    const resolvedSector = sector === 'Altro' ? customSector.trim() : sector
    if (resolvedSector) parts.push(`Settore: ${resolvedSector}`)
    if (tools.length > 0) parts.push(`Strumenti usati: ${tools.join(', ')}`)
    return parts.join('\n')
  }

  const canSubmit = role.trim().length > 0 || sector.length > 0 || tools.length > 0

  const handleSubmit = async () => {
    const context = buildRoleContext()
    if (!context || loading) return
    setLoading(true)
    setScenarios(null)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: context, tools }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setScenarios(data.scenarios)
    } catch {
      setError('Errore nella generazione. Controlla la connessione e riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  const grouped = useMemo(() => {
    if (!scenarios) return null
    const out: Record<Mode, Scenario[]> = {
      Chat: scenarios.filter((s) => s.mode === 'Chat'),
      Cowork: scenarios.filter((s) => s.mode === 'Cowork'),
      Code: scenarios.filter((s) => s.mode === 'Code'),
    }
    return out
  }, [scenarios])

  const hasResults = grouped && Object.values(grouped).some((arr) => arr.length > 0)
  const roleContext = buildRoleContext()

  const formState = {
    role,
    setRole,
    sector,
    onSectorClick: handleSectorClick,
    customSector,
    setCustomSector,
    tools,
    toggleTool,
    resetTools,
    canSubmit,
    loading,
    onSubmit: handleSubmit,
    contextScore,
  }

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <TopBar contextScore={contextScore} />
      <Hero form={formState} onKeyDown={handleKeyDown} />

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <section className="max-w-2xl mx-auto px-6 pb-12">
          <p className="text-center text-sm" style={{ color: 'oklch(0.55 0.18 25)' }}>
            {error}
          </p>
        </section>
      )}

      {hasResults && !loading && grouped && (
        <Kanban scenarios={grouped} onOpen={(s) => setOpenScenario(s)} roleContext={roleContext} />
      )}

      <NextSteps />

      <Footer />

      <Drawer scenario={openScenario} role={roleContext} onClose={() => setOpenScenario(null)} />
    </main>
  )
}
