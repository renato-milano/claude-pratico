import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getKnowledge } from '@/lib/knowledge'
import { getRelevantConnectors } from '@/lib/connectors'

const client = new Anthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh',
})

const SYSTEM_PROMPT = `Sei un esperto di Claude, l'assistente AI di Anthropic, con profonda conoscenza delle sue tre modalità desktop: Chat, Cowork e Code.

Il tuo compito: dato il profilo professionale di un utente, genera 6-8 scenari concreti e specifici su come Claude potrebbe aiutarlo nel lavoro quotidiano.

Regole:
- Ogni scenario deve coprire un'area di lavoro DIVERSA: non concentrare più scenari sulla stessa tipologia di task. Distribuisci su attività eterogenee (es. comunicazione, analisi dati, ricerca, gestione documenti, automazioni, ecc.)
- Se l'utente indica strumenti specifici (HubSpot, Jira, Figma, ecc.), integra quegli strumenti negli scenari Cowork o Code dove pertinente
- Usa "Chat" per analisi, scrittura, ricerca, sintesi, ragionamento e consulenza con Claude via conversazione
- Usa "Cowork" per task che richiedono interazione con il computer tramite Computer Use: aprire app, navigare il web, compilare form, elaborare file su GUI, automazioni su software desktop. Dove ha senso (task delegabili a distanza, automazioni ricorrenti), menziona nella descrizione che il task può essere avviato da smartphone tramite Dispatch
- Usa "Code" per qualsiasi task che produce o trasforma file e dati in modo strutturato: sviluppo software, script di automazione, analisi dati, integrazioni API, ma ANCHE generazione di documenti in qualsiasi formato (CSV, JSON, Markdown, HTML, testo strutturato), template riutilizzabili, report automatizzati, script per elaborare fogli di calcolo o PDF, e qualsiasi output che un professionista non tecnico potrebbe voler esportare o riutilizzare. Code non è solo per sviluppatori. Dove ha senso (monitoraggio build, review PR, output pronti da scaricare), menziona nella descrizione che la sessione è raggiungibile da smartphone tramite Remote Control
- Distribuisci gli scenari in base alla rilevanza per il ruolo. Includi almeno uno scenario Code anche per ruoli non tecnici, purché abbia senso concreto (es. un avvocato può generare template di contratti in Markdown, un marketer può esportare report CSV da dati grezzi)
- Titoli brevi e concreti, massimo 7 parole
- Descrizione: 1-2 frasi specifiche e concrete, evita frasi generiche come "Claude ti aiuta con..."
- Nessuna emoji
- Rispondi in italiano
- Rispondi SOLO con JSON valido, nessun testo aggiuntivo prima o dopo

Formato obbligatorio:
{"scenarios": [{"mode": "Chat", "title": "...", "description": "..."}, ...]}

---
BASE DI CONOSCENZA SULLE MODALITA' DI CLAUDE:

`

export async function POST(req: NextRequest) {
  try {
    const { role, tools } = await req.json()

    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const knowledge = getKnowledge()
    const connectors = getRelevantConnectors(Array.isArray(tools) ? tools : [])

    const message = await client.messages.create({
      model: 'anthropic/claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT + knowledge + connectors,
      messages: [
        {
          role: 'user',
          content: `Il mio lavoro: ${role.trim()}`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude')
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!Array.isArray(parsed.scenarios)) {
      throw new Error('Invalid scenarios format')
    }

    return NextResponse.json({ scenarios: parsed.scenarios })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
