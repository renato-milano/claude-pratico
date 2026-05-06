# Claude Desktop — Modalità Chat

## Cos'è

La modalità Chat è l'interfaccia conversazionale di Claude. Nessuna azione sul sistema: Claude ragiona, scrive, analizza, trasforma. È il punto di partenza per chiunque e la modalità più diffusa.

---

## Conversazioni

### Caratteristiche base
- Cronologia persistente sincronizzata su web, desktop, mobile (iOS e Android)
- Contesto multi-turno per tutta la durata della conversazione
- Supporto multilingua nativo

### Modalità Incognito
- Disponibile su tutti i piani (incluso Free)
- Attivabile con l'icona "fantasma" in alto a destra
- Le chat incognito: non salvate in cronologia, non usate per training, non incluse nella memoria
- Dati conservati comunque per 30 giorni (o secondo policy organizzativa su Enterprise)
- Non disponibile all'interno dei Progetti

### Upload di File

**Per singole chat:**
| Parametro | Limite |
|---|---|
| Dimensione massima per file | 500 MB |
| Numero massimo file per chat | 20 |
| Dimensione massima immagini | 8000 × 8000 px |

**Per la Knowledge Base dei Progetti:**
| Parametro | Limite |
|---|---|
| Dimensione massima per file | 30 MB |
| Numero file | Illimitato (entro context window) |

**Formati documenti supportati:** PDF, DOCX, CSV, TXT, HTML, ODT, RTF, EPUB, JSON, XLSX (richiede code execution abilitato)

**Formati immagini supportati:** JPEG, PNG, GIF, WebP

**Capacità di elaborazione:**
- PDF < 100 pagine: testo + elementi visivi (immagini, grafici)
- PDF > 1000 pagine: solo testo
- Documenti non-PDF: solo estrazione testo (immagini incorporate non elaborate)
- Risoluzione ottimale per immagini: 1000×1000 px o superiore

### Voice Mode
- Beta, disponibile in inglese su iOS, Android e web
- Conversazione parlata bidirezionale (Claude risponde vocalmente)
- **Modalità hands-free**: ascolto continuo con risposta alle pause naturali
- **Push-to-talk**: tasto tenuto premuto per ambienti rumorosi
- **Dettatura** (distinta dalla voice): su mobile e desktop Mac (Caps Lock su Claude Desktop)
- I trascritti vengono salvati nella cronologia chat
- Voci selezionabili in Settings > General > Voice settings

---

## Multimodalità

Tutti i modelli Claude correnti supportano input testo e immagini.

**Claude Opus 4.7** supporta immagini fino a **2576 px sul lato lungo (~3,75 megapixel)**, oltre tre volte i modelli precedenti — utile per analisi di documenti densi, grafici, UI screenshot ad alta risoluzione.

---

## Artifacts

Disponibile su tutti i piani (incluso Free). Gli artifact sono contenuti autonomi generati in un pannello laterale dedicato, pensati per il riutilizzo.

**Tipi di artifact:**
- Documenti (Markdown o testo semplice)
- Frammenti di codice
- Siti web HTML a pagina singola
- Immagini SVG
- Diagrammi e flowchart
- Componenti React interattivi

**Funzionalità avanzate (Pro, Max, Team, Enterprise):**
- Integrazione MCP per connessione a servizi esterni
- Persistent storage: fino a **20 MB per artifact**, solo testo

**Publishing:**
- Free/Pro/Max: pubblicazione pubblica (chiunque con link accede)
- Team/Enterprise: condivisione interna all'organizzazione (richiede login)
- Embedding su altri siti con iframe e domini autorizzati
- Una volta unpublished, non è possibile ripubblicare lo stesso artifact

---

## Extended Thinking

Modelli supportati: Opus 4.7, Sonnet 4.6, Haiku 4.5.

Attivazione: "Search and tools" > toggle "Extended thinking". Attivarlo su una chat già avviata apre una nuova chat.

**Livelli di Effort per Opus 4.7:**
| Livello | Uso consigliato |
|---|---|
| `max` | Performance massima, possibile overthinking |
| `xhigh` | Coding e use case agentici (raccomandato) |
| `high` | Bilanciamento token/intelligenza |
| `medium` | Cost-sensitive, riduce token |
| `low` | Task brevi, latency-sensitive |

**Quando usare Extended Thinking:** calcoli matematici, problemi di fisica, coding competitivo, pianificazione multi-step, analisi tecnica complessa.

**Quando NON serve:** domande semplici, richieste informative generiche, scrittura basilare.

---

## Projects (Progetti)

Spazi di lavoro isolati con cronologia chat propria, knowledge base dedicata e istruzioni personalizzate.

### Limiti per piano
| Piano | Numero Progetti |
|---|---|
| Free | Massimo 5 |
| Pro, Max, Team, Enterprise | Illimitati |

### Creare un Progetto
1. Accedere a `claude.ai/projects`
2. Selezionare "+ New Project"
3. Inserire nome e descrizione (non accessibili a Claude durante le chat)
4. Su Team/Enterprise: configurare visibilità (privata o condivisa)

### Knowledge Base
- Carica documenti, file, testo, codice — Claude li usa come contesto in tutte le conversazioni del progetto
- Limite file singolo: **30 MB**
- Context window standard: **200K token** (~500 pagine)
- Formati accettati: tutti quelli supportati nella chat (PDF, DOCX, TXT, XLSX, immagini, ecc.)

**Cosa mettere nella Knowledge Base:**
- Brief del cliente o del progetto
- Linee guida di brand (tono, stile, parole chiave)
- Documenti tecnici di riferimento
- Template e procedure standard
- Dati o contesto che ripeti spesso

### Istruzioni Custom per Progetto
Definisci il comportamento di Claude per tutte le conversazioni del progetto:
- Tono e stile di risposta ("Rispondi sempre in italiano formale")
- Ruolo da assumere ("Sei un consulente legale specializzato in diritto del lavoro")
- Formato preferito ("Non aggiungere mai introduzioni nelle risposte")
- Vincoli specifici ("Non menzionare mai i competitor")

### RAG (Retrieval Augmented Generation)
- Disponibile su **tutti i piani** (incluso Free)
- Si attiva **automaticamente** quando il progetto si avvicina ai limiti della context window
- Espansione capacità: fino a **10× rispetto ai limiti standard**
- Claude usa un "project knowledge search tool" per recuperare selettivamente le informazioni rilevanti invece di caricare tutto il contenuto contemporaneamente
- Qualità mantenuta equivalente all'elaborazione in-context

**Punto chiave:** il contesto non è condiviso tra le chat all'interno di un progetto a meno che le informazioni non siano nella knowledge base.

### Collaborazione su Progetti (Team e Enterprise)

**Livelli di permesso:**
| Permesso | Cosa può fare |
|---|---|
| Can view | Visualizzare contenuti e istruzioni, chattare nel progetto, non modificare |
| Can edit | Modificare istruzioni e knowledge base, aggiungere/rimuovere membri |

**Modalità di condivisione:**
- Individuale: per nome o email
- Bulk: incolla una lista di email nel campo "Invite by email"
- Organizzazione intera: accessibile a tutti i membri

**Sicurezza:** all'archiviazione del progetto, tutti i permessi vengono resettati a privato automaticamente.

---

## Memoria di Claude

### Come Funziona
Claude genera automaticamente una sintesi delle conversazioni aggiornata ogni **24 ore**.

- **Chat standalone**: memoria globale unica, aggiornata ogni 24 ore
- **Progetti**: ogni progetto ha il proprio spazio memoria separato con sintesi dedicata

### Disponibilità per Piano
- **Tutti gli utenti** (incluso Free): attiva dal **2 marzo 2026**
- **Chat Search** (ricerca nelle conversazioni passate): solo piani a pagamento (Pro, Max, Team, Enterprise)
- **Enterprise**: gli Owner possono disabilitare la memoria globalmente per l'organizzazione

### Cosa Claude Ricorda
- Ruolo, progetti e contesto professionale
- Preferenze comunicative e stile di lavoro
- Preferenze tecniche e stile di programmazione
- Dettagli progetti e lavori in corso

### Cosa Claude NON Ricorda
- Chat incognito
- Conversazioni eliminate (rimosse dalla sintesi entro 24 ore)
- Contesto di altre chat nello stesso progetto (va aggiunto alla knowledge base)

### Chat Search (Ricerca nelle Chat Passate)
Disponibile su web, Desktop e Mobile (solo piani a pagamento).
- Si attiva chiedendo naturalmente: "Cosa abbiamo discusso su [argomento]?"
- Usa RAG in background; le ricerche appaiono come tool call nelle conversazioni
- Scope: tutte le chat fuori dai progetti + conversazioni individuali in un progetto (limitato al progetto)
- Disattivabile in Settings > Capabilities > Preferences

### Controlli Utente
- **Pausa memoria**: Claude mantiene la memoria ma non la usa né ne crea di nuova
- **Reset memoria**: cancella permanentemente tutte le memorie
- **Visualizza/Modifica**: Settings > Capabilities > "View and edit memory"

---

## Modelli Disponibili

| Modello | Context Window | Max Output | Knowledge Cutoff | Caratteristica |
|---|---|---|---|---|
| **Opus 4.7** | 1M token | 128K token | Gen 2026 | Massima capacità, agentic coding, visione HD (3,75MP) |
| **Sonnet 4.6** | 1M token | 64K token | Ago 2025 | Miglior bilanciamento velocità/intelligenza |
| **Haiku 4.5** | 200K token | 64K token | Feb 2025 | Velocità massima, task semplici |

### Quando scegliere quale modello

**Opus 4.7** — scegliere per:
- Ragionamento complesso e lungo orizzonte
- Analisi di documenti ad alta risoluzione
- Agentic coding avanzato
- Analisi finanziaria e documenti densi di dati
- Quando la qualità è prioritaria rispetto alla velocità

**Sonnet 4.6** — scegliere per:
- La maggior parte dei task quotidiani
- Coding (preferito dagli sviluppatori nel 70% dei casi)
- Ragionamento su contesti lunghi (1M token)
- Bilanciamento velocità/costo

**Haiku 4.5** — scegliere per:
- Risposte veloci su task semplici
- Uso cost-sensitive
- Contesti dove la latenza è critica

---

## Piani e Differenze

### Free
- Accesso base, modello default Sonnet 4.6
- Tutte le funzionalità base: chat, artifacts, memoria, ricerca web, esecuzione codice
- Massimo 5 progetti
- 1 connettore personalizzato
- Limite di utilizzo (nessun numero pubblico); reset variabile
- **Non include**: Cowork, Claude in Chrome, Research

### Pro ($17/mese annuale o $20/mese)
- Utilizzo almeno **5× rispetto al Free** per sessione; reset ogni **5 ore**
- Accesso a tutti i modelli
- Progetti illimitati
- Claude Code, Cowork, Research, Extended Thinking
- Claude in Chrome (beta) — solo Haiku 4.5
- Extra usage acquistabile

### Max 5× ($100/mese) e 20× ($200/mese)
- Utilizzo 5× o 20× rispetto al Pro per sessione
- Tutto di Pro + accesso prioritario a nuove funzionalità
- Claude in Chrome con tutti i modelli (Opus 4.7, Sonnet 4.6, Haiku 4.5)
- Auto mode disponibile (solo Opus 4.7)

### Team ($25/mese standard, $100/mese premium per seat)
- Min 5 membri
- Funzionalità collaborative: SSO, Domain Capture, JIT Provisioning
- Connectors: Google Drive, Gmail, Calendar, GitHub, Microsoft 365, Slack
- Admin tools: controlli di spesa, ricerca enterprise
- Context window Enterprise su Sonnet 4.6 in chat: **500K token**

### Enterprise (usage-based, min 20 seats)
- Nessun limite di token per utente, fatturazione su consumo
- Context window: **500K token** con Sonnet 4.6 in chat
- Audit logs completi, SCIM, HIPAA-readiness + BAA
- Google Drive Cataloging (indicizzazione RAG dell'intero Drive)
- Ruoli personalizzati
- Policy retention dati personalizzabili

---

## Integrazioni

### Google Workspace (disponibile per tutti gli utenti)
- **Gmail**: ricerca/lettura email in linguaggio naturale, creazione bozze (no invio automatico), gestione etichette
- **Google Calendar**: creazione, aggiornamento, cancellazione eventi; ricerca disponibilità
- **Google Drive**: accesso a Google Docs, ricerca file, salvataggio documenti. Limite file: **10 MB**, solo testo

Principio sicurezza: Claude può accedere solo a ciò a cui hai già accesso in Google Workspace.

Per Team/Enterprise: un Owner deve abilitare i connectors a livello organizzativo prima che i singoli utenti possano autenticarsi.

**Google Drive Cataloging** (solo Enterprise): indicizzazione RAG dell'intero Google Drive aziendale con citazioni dirette alle fonti.

### Connectors Directory (Pro, Max, Team, Enterprise)
Integrazioni native: Atlassian (Jira, Confluence), Zapier, Cloudflare, Intercom, Asana, Square, Sentry, PayPal, Linear, Plaid, Slack, e altri.

**Connettori custom:** tutti i piani (Free: 1, Pro+: illimitati). Richiedono server MCP pubblicamente raggiungibile.

### Claude in Chrome (Pro, Max, Team, Enterprise)
Estensione browser con pannello laterale.

**Funzionalità:**
- Legge, clicca e naviga siti web (pannello laterale)
- **Multi-tab**: controllo di più tab contemporaneamente
- Conoscenza integrata di Slack, Google Calendar, Gmail, Google Docs, GitHub
- **Registrazione workflow**: insegna a Claude un workflow registrandone i passi; Claude lo ripete
- Task programmati (giornalieri, settimanali, mensili)
- Lettura errori console e richieste di rete per debugging
- Scorciatoie: salva prompt efficaci come shortcut con "/"

**Modelli disponibili:**
- Pro: solo Haiku 4.5
- Max/Team/Enterprise: Opus 4.7, Sonnet 4.6, Haiku 4.5

**Installazione**: Claude Desktop > Settings > Connectors > Claude in Chrome > Download estensione

### Research (Pro, Max, Team, Enterprise)
- Attivazione: pulsante "Research" nella chat (diventa blu quando attivo)
- Funzionamento: agente che pianifica e crea sotto-agenti paralleli per ricerca simultanea
- Fonti: web pubblico + Google Workspace + integrazioni connesse
- Tempi: 5–15 minuti per report standard; fino a **45 minuti** per ricerche complesse
- Risultati: report approfondito con citazioni dirette alle fonti
- Quando attivo, Research abilita automaticamente anche Extended Thinking
- Usa i limiti di utilizzo più velocemente della chat normale

---

## Creazione e Modifica File

Disponibile su tutti i piani (incluso Free).

**Formati creabili:** Excel (.xlsx), PowerPoint (.pptx), Word (.docx), PDF, immagini (PNG di grafici e visualizzazioni dati)

**Analisi dati:** esecuzione script Python in sandbox, modelli machine learning, estrazione da PDF

**Limite:** 30 MB per file

---

## Best Practice di Prompting

### Principi fondamentali

**Sii specifico sul formato output:**
```
Non: "scrivi una email"
Sì: "scrivi una email di 3 paragrafi, tono formale, senza introduzioni generiche, con bullet point per i punti chiave"
```

**Spiega il perché, non solo il cosa:**
```
Non: "Non usare le ellissi"
Sì: "La tua risposta sarà letta da un TTS, quindi non usare mai le ellissi — il motore non saprebbe pronunciarle"
```

**Per documenti lunghi, metti i dati IN CIMA al prompt** (prima delle istruzioni): migliora le performance fino al **30%** su input multi-documento complessi.

### Few-Shot Prompting
Includi 3–5 esempi per risultati ottimali. Avvolgi gli esempi in tag `<example>`:

```xml
<example>
Input: [esempio]
Output: [risultato desiderato]
</example>
```

### XML Tags per Prompt Complessi
```xml
<context>
[contesto del progetto]
</context>

<instructions>
[istruzioni specifiche]
</instructions>

<input>
[dati da elaborare]
</input>
```

### Istruzioni per Formato Output
```xml
<avoid_excessive_markdown>
Scrivi in prosa fluente. Usa markdown solo per codice inline e heading semplici.
Non generare mai elenchi puntati eccessivamente brevi.
</avoid_excessive_markdown>
```

### Istruzioni Specifiche per Opus 4.7
- **Interpretazione letterale**: interpreta i prompt più letteralmente — specificare sempre lo scope ("Applica a ogni sezione, non solo alla prima")
- **Verbosità adattiva**: calibra la lunghezza alla complessità; specificare le preferenze esplicitamente
- **Tool use**: usa strumenti meno frequentemente ma con più ragionamento; istruire esplicitamente se necessario

---

## Gestione del Contesto

### Context Window per Piano e Modello
| Scenario | Context Window |
|---|---|
| Free/Pro/Max (Sonnet 4.6 o Opus 4.7) — chat standard | 200K token |
| Enterprise (Sonnet 4.6) — chat | 500K token |
| Pro/Max/Team/Enterprise con Claude Code + Sonnet 4.6 | 1M token |
| Pro/Max/Team/Enterprise con Claude Code + Opus 4.7 | 1M token |

**200K token ≈** ~500 pagine, ~150K parole
**1M token ≈** ~750K parole, ~3,4M caratteri (Sonnet); ~555K parole (Opus 4.7, nuovo tokenizer)

### Gestione Automatica
Con code execution abilitato, Claude riassume automaticamente i messaggi precedenti quando la conversazione si avvicina al limite — la cronologia completa rimane accessibile.

### Limiti di Utilizzo

| Piano | Reset | Utilizzo |
|---|---|---|
| Free | Variabile | Limitato, nessun numero pubblico |
| Pro | Ogni 5 ore + settimanale | ~5× Free |
| Max 5× | Ogni 5 ore + settimanale | 5× Pro |
| Max 20× | Ogni 5 ore + settimanale | 20× Pro |
| Team Standard | Ogni 5 ore + settimanale | 1,25× Pro |
| Team Premium | Ogni 5 ore + settimanale | 6,25× Pro |
| Enterprise | Nessuno | Usage-based |

**Fattori che aumentano il consumo:** lunghezza dei messaggi, modello usato (Opus > Haiku), Research, Extended Thinking, connectors MCP, file allegati.

### Best Practice per i Limiti
1. Combina domande correlate in un unico messaggio
2. Usa RAG nei Projects invece di incollare tutto il contesto ogni volta
3. Disabilita web search e connectors MCP quando non servono (sono token-intensivi)
4. Usa Chat Search invece di ricopiare il contesto da conversazioni precedenti
5. Apri conversazioni nuove per task distinti invece di allungare indefinitamente la stessa chat

---

## Quando Usare Chat vs le Altre Modalità

| Situazione | Modalità giusta |
|---|---|
| Hai bisogno di una risposta, un'analisi, un testo | **Chat** |
| Vuoi che Claude esegua task su app e file del tuo computer | **Cowork** |
| Stai sviluppando software su una codebase | **Code** |
