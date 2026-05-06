import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh',
})

const SYSTEM_PROMPT = `Sei un esperto formatore su Claude (Anthropic). Ricevi uno scenario d'uso di Claude per un professionista specifico.

Il tuo compito è spiegare concretamente come eseguire questo scenario nella pratica.

Fornisci:
- "how_to": 1-2 frasi che spiegano il meccanismo pratico (non cosa fa Claude, ma COME l'utente deve procedere)
- "steps": array di 3-5 passi concreti e sequenziali, ognuno massimo 20 parole, in ordine logico di esecuzione
- "example_prompt": un prompt pronto all'uso, lungo e dettagliato (6-10 righe), specifico per il caso con [variabili] dove necessario

Regole:
- I passi devono essere immediatamente actionable, non teorici
- Il prompt di esempio deve essere copiabile e funzionare subito, non generico
- Se la modalità è "Cowork", i passi devono descrivere come delegare il task con Computer Use
- Se la modalità è "Code", i passi devono descrivere come usare la sessione Code con la codebase
- Se la modalità è "Chat", i passi descrivono come strutturare la conversazione
- Nessuna emoji
- Risposta in italiano
- Solo JSON valido, nessun testo prima o dopo

Formato:
{"how_to": "...", "steps": ["...", "...", "..."], "example_prompt": "..."}`

export async function POST(req: NextRequest) {
  try {
    const { mode, title, description, role } = await req.json()

    if (!mode || !title || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'anthropic/claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Professionista: ${role || 'non specificato'}
Modalità Claude: ${mode}
Scenario: ${title}
Descrizione: ${description}

Spiega come eseguire questo scenario concretamente.`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Detail error:', error)
    return NextResponse.json({ error: 'Detail generation failed' }, { status: 500 })
  }
}
