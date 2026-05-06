'use client'

import { modeColor, modeBg, modeBorder, Mode } from './tokens'

const FEATURES: {
  index: string
  name: string
  mode: Mode
  tagline: string
  description: string
  example: string
}[] = [
  {
    index: '01',
    name: 'Projects',
    mode: 'Chat',
    tagline: 'Un workspace dedicato per ogni area di lavoro',
    description:
      'I Projects sono ambienti persistenti dove Claude ha sempre accesso ai tuoi documenti, istruzioni e contesto specifico. Non devi mai rispiegare chi sei, come lavori o quali materiali usare. Ogni progetto è uno spazio separato con la sua knowledge base e le sue regole.',
    example:
      'Carichi nel Project le linee guida del brand, i brief delle campagne passate e il tono di voce aziendale. Da quel momento tutti i tuoi colleghi possono chiedere a Claude di scrivere testi o analizzare materiali, e lui risponde sempre con il registro giusto e i riferimenti corretti.',
  },
  {
    index: '02',
    name: 'Dispatch',
    mode: 'Cowork',
    tagline: 'Deleghi dal telefono, Claude lavora al desktop',
    description:
      'Dispatch collega il tuo telefono al desktop: puoi assegnare task a Claude da qualsiasi posto, mentre lui li esegue sul tuo computer. Non serve stare alla scrivania per far avanzare il lavoro. Quando torni, tutto è già pronto.',
    example:
      'Sei in metro e ti ricordi di un\'analisi da fare sui dati del mese. La deleghi a Claude dal telefono, lui apre i file, elabora i numeri e prepara il report. Arrivi in ufficio e lo trovi in bozza.',
  },
  {
    index: '03',
    name: 'Scheduled Tasks',
    mode: 'Cowork',
    tagline: 'Impostalo una volta, gira in automatico',
    description:
      'Definisci un task ricorrente e Claude lo esegue automaticamente a orari o cadenze stabilite, sul cloud di Anthropic, senza che il tuo computer sia acceso. Nessun prompting manuale, nessuna dimenticanza. Il lavoro ripetitivo si gestisce da solo.',
    example:
      'Ogni mattina alle 8:00 Claude controlla la tua inbox, riassume le email urgenti e prepara un briefing pronto alla prima lettura. Ogni venerdì genera il report settimanale con i dati aggiornati e te lo manda via Slack.',
  },
  {
    index: '04',
    name: 'Skills',
    mode: 'Code',
    tagline: 'Insegna a Claude i tuoi workflow, una volta sola',
    description:
      'Le Skills sono pacchetti di istruzioni, template e risorse che trasformano Claude in uno specialista del tuo processo specifico. Li crei una volta, funzionano ogni volta, in modo deterministico. Puoi condividerli con il tuo team e costruire una libreria di automazioni aziendali.',
    example:
      'Carichi il tuo template di contratto con intestazioni, clausole standard e formattazione aziendale. Da quel momento, ogni volta che chiedi a Claude un contratto, segue esattamente quella struttura senza doverla rispiegare.',
  },
]

export function NextSteps() {
  return (
    <section
      className="w-full"
      style={{ borderTop: '1px solid var(--line)', background: 'var(--paper-soft)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="mb-10 md:mb-12">
          <div
            className="text-[11px] font-mono-ui uppercase tracking-[0.2em] mb-3"
            style={{ color: 'var(--ink-faint)' }}
          >
            Feature
          </div>
          <h2
            className="font-serif-display text-[28px] md:text-[36px] tracking-tight leading-tight max-w-[38ch]"
            style={{ color: 'var(--ink)' }}
          >
            Ogni scenario è un punto di partenza.{' '}
            <em className="italic" style={{ color: 'var(--clay)' }}>
              Quattro funzionalità lo rendono permanente.
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.name} feature={f} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
}: {
  feature: (typeof FEATURES)[number]
}) {
  const { index, name, mode, tagline, description } = feature

  return (
    <div
      className="rounded-[18px] p-7 flex flex-col"
      style={{
        background: 'var(--paper)',
        border: `1px solid ${modeBorder(mode)}`,
      }}
    >
      {/* Top accent */}
      <div
        className="h-[3px] w-10 rounded-full mb-6"
        style={{ background: modeColor(mode) }}
      />

      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="font-mono-ui text-[10px] tracking-[0.15em]"
          style={{ color: modeColor(mode, 0.55) }}
        >
          {index}
        </span>
        <span
          className="font-serif-display text-[22px] tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          {name}
        </span>
      </div>

      <p
        className="text-[13px] italic leading-snug mb-3"
        style={{ color: modeColor(mode, 0.55) }}
      >
        {tagline}
      </p>

      <p
        className="text-[13.5px] leading-[1.6] mb-4"
        style={{ color: 'var(--ink-muted)' }}
      >
        {description}
      </p>

      <div
        className="rounded-xl px-4 py-3 flex-1"
        style={{ background: modeBg(mode), border: `1px solid ${modeBorder(mode)}` }}
      >
        <span
          className="text-[10px] font-mono-ui uppercase tracking-[0.15em] block mb-1.5"
          style={{ color: modeColor(mode, 0.5) }}
        >
          Esempio pratico
        </span>
        <p
          className="text-[13px] leading-[1.6] italic"
          style={{ color: 'var(--ink-muted)' }}
        >
          {feature.example}
        </p>
      </div>

    </div>
  )
}
