import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getRelevantConnectors } from '@/lib/connectors'

const client = new Anthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh',
})

const SYSTEM_PROMPT = `Sei un esperto di implementazione di Claude (Anthropic) nei processi lavorativi aziendali.

Il tuo compito: dato il profilo di un utente e un processo lavorativo specifico, costruisci una roadmap chiara e sequenziale — non un elenco di possibilità generiche, ma un piano preciso su come ridisegnare quel processo con Claude.

Regole fondamentali:
- Genera 4-6 step strettamente sequenziali che seguono l'ordine reale del processo
- Ogni step deve fare riferimento esplicito agli strumenti dell'utente dove pertinente
- Per ogni step valuta ATTIVAMENTE se usare una di queste funzionalità avanzate di Claude e indicala nel campo "feature":
  * "Projects": quando il processo richiede contesto persistente, documenti di riferimento fissi, o coinvolge più persone del team
  * "Skills": quando lo step è ripetibile e standardizzabile (template fissi, procedure aziendali, formati ricorrenti)
  * "Scheduled Tasks": quando lo step può girare in automatico a cadenza (giornaliera, settimanale, su evento)
  * null: se nessuna funzionalità avanzata è rilevante per quello step
- Il campo "action" spiega con precisione cosa fa Claude in quel punto del processo e PERCHÉ sostituisce o potenzia il modo attuale (1-2 frasi dense, non generiche)
- REGOLA SUL CAMPO "prompt" per feature="Scheduled Tasks": NON scrivere un prompt da inviare manualmente ogni volta. Scrivi invece il testo di configurazione del task da inserire UNA SOLA VOLTA nell'interfaccia Scheduled Tasks di Claude — deve descrivere il task, la cadenza e cosa produrre come output, come se stessi istruendo Claude una volta per sempre
- REGOLA SUL CAMPO "prompt" per feature="Projects" CON connettori attivi: se l'utente ha un connettore disponibile per quello strumento (es. Gmail, Notion, Google Drive), il prompt deve sfruttarlo direttamente — Claude accede ai dati in autonomia tramite il connettore, quindi il prompt NON deve mai chiedere all'utente di incollare o allegare contenuti. Esempio corretto: "Apri le ultime email non lette da clienti in Gmail e..." invece di "Incolla qui l'email del cliente..."
- Per tutti gli altri step: il campo "prompt" è un prompt realistico e copiabile, scritto in prima persona, con dettagli specifici al contesto
- Assegna la modalità Claude più adatta: Chat per analisi/scrittura/ragionamento, Cowork per interazione con app e GUI, Code per file/dati/script/automazioni
- Non aggiungere step che non aggiungono valore reale al processo descritto
- Titoli brevi e specifici, massimo 6 parole
- Rispondi in italiano
- Rispondi SOLO con JSON valido, nessun testo aggiuntivo

Formato obbligatorio:
{"steps": [{"step": 1, "mode": "Chat", "feature": "Projects", "title": "...", "action": "...", "prompt": "..."}]}`

export async function POST(req: NextRequest) {
  try {
    const { role, tools, process } = await req.json()

    if (!process || typeof process !== 'string' || process.trim().length === 0) {
      return NextResponse.json({ error: 'Process description is required' }, { status: 400 })
    }

    const connectors = getRelevantConnectors(Array.isArray(tools) ? tools : [])

    const message = await client.messages.create({
      model: 'anthropic/claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT + (connectors ? '\n' + connectors : ''),
      messages: [
        {
          role: 'user',
          content: `Profilo: ${role?.trim() || 'non specificato'}\n\nProcesso da ottimizzare: ${process.trim()}`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format')

    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.steps)) throw new Error('Invalid steps format')

    return NextResponse.json({ steps: parsed.steps })
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
