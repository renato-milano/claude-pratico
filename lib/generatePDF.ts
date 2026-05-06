import { Mode, Scenario } from '@/app/_design/tokens'

const MODE_COLORS: Record<Mode, [number, number, number]> = {
  Chat:   [140, 92,  210],
  Cowork: [194, 105,  61],
  Code:   [ 80, 115, 210],
}

const MODE_BG: Record<Mode, [number, number, number]> = {
  Chat:   [247, 244, 252],
  Cowork: [252, 246, 240],
  Code:   [242, 245, 252],
}

export async function generatePDF(
  scenarios: Record<Mode, Scenario[]>,
  roleContext: string
) {
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 16
  const colW = W - margin * 2
  let y = 22

  // ── Header ──────────────────────────────────────────────────
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 20, 10)
  doc.text('Claude Potential Map', margin, y)
  y += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 130, 110)
  doc.text('claude.ai', margin, y)
  y += 8

  // Role context block
  if (roleContext.trim()) {
    doc.setFillColor(248, 244, 238)
    const ctxLines = doc.splitTextToSize(roleContext.replace(/\n/g, '  ·  '), colW - 8)
    const ctxH = ctxLines.length * 4.8 + 6
    doc.roundedRect(margin, y, colW, ctxH, 2, 2, 'F')
    doc.setFontSize(8.5)
    doc.setTextColor(90, 75, 60)
    doc.text(ctxLines, margin + 4, y + 5)
    y += ctxH + 8
  }

  // ── Scenarios by mode ────────────────────────────────────────
  const modes: Mode[] = ['Chat', 'Cowork', 'Code']

  for (const mode of modes) {
    const items = scenarios[mode]
    if (!items?.length) continue

    const [r, g, b] = MODE_COLORS[mode]
    const [br, bg, bb] = MODE_BG[mode]

    // Mode pill header
    if (y > 260) { doc.addPage(); y = 22 }
    doc.setFillColor(r, g, b)
    doc.roundedRect(margin, y, 28, 6.5, 2, 2, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(mode.toUpperCase(), margin + 3.5, y + 4.4)
    y += 11

    for (const scenario of items) {
      // Pre-calculate heights
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      const titleLines = doc.splitTextToSize(scenario.title, colW - 14)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const descLines = doc.splitTextToSize(scenario.description, colW - 14)

      const cardH = titleLines.length * 5.8 + descLines.length * 4.6 + 14

      if (y + cardH > 272) { doc.addPage(); y = 22 }

      // Card background
      doc.setFillColor(br, bg, bb)
      doc.setDrawColor(220, 210, 200)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin, y, colW, cardH, 3, 3, 'FD')

      // Left accent bar
      doc.setFillColor(r, g, b)
      doc.roundedRect(margin, y, 3.5, cardH, 1.5, 1.5, 'F')

      // Title
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(28, 20, 10)
      doc.text(titleLines, margin + 9, y + 8)

      // Description
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(90, 78, 62)
      doc.text(descLines, margin + 9, y + 8 + titleLines.length * 5.8 + 1.5)

      y += cardH + 5
    }

    y += 5
  }

  // ── Footer ───────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 160, 140)
    doc.text('Generato con Claude Potential Map', margin, 289)
    doc.text(`${i} / ${pageCount}`, W - margin, 289, { align: 'right' })
  }

  doc.save('claude-potential-map.pdf')
}
