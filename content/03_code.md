# Claude Desktop — Modalità Code

## Cos'è

Code è il tab di **agentic coding**: Claude legge la codebase, scrive e modifica file, esegue comandi nel terminale, gestisce git, monitora CI/CD, apre PR. Non suggerisce: agisce. A differenza di Cowork (che usa la GUI del computer), Code usa strumenti programmatici — file system, bash, git, API — il che lo rende più preciso e controllabile per tutto ciò che riguarda il codice.

**Prerequisiti:** piano Pro, Max, Team o Enterprise.

---

## Sessioni e Worktrees

### Cos'è una Sessione
Ogni conversazione nel tab Code è una **sessione** indipendente: propria cronologia, propria cartella di progetto, proprie modifiche. Sessioni multiple possono girare in parallelo.

**Controllo sessioni:**
- `Cmd+N` / `Ctrl+N` — nuova sessione
- `Ctrl+Tab` / `Ctrl+Shift+Tab` — cicla sessioni
- Filtro e raggruppamento sessioni per status, progetto, ambiente nella sidebar

### Git Worktrees — Isolamento Automatico
Per ogni sessione su un repository Git, Claude crea automaticamente un **Git worktree** isolato. Le modifiche in una sessione non interferiscono con le altre finché non si committa.

- **Storage:** `<project-root>/.claude/worktrees/` (configurabile in Settings → Claude Code → "Worktree location")
- **Branch prefix:** impostabile per tenere organizzati i branch creati da Claude
- **`.worktreeinclude`:** file nella root del progetto per includere file gitignored (come `.env`) nei nuovi worktrees
- **Rimozione:** hover sulla sessione nella sidebar → icona archivio
- **Auto-archive:** si attiva quando il PR viene merged/closed (toggle in Settings → Claude Code)

### Ambienti di Esecuzione

| Ambiente | Dove gira | Caratteristiche |
|---|---|---|
| **Local** | Tua macchina | Accesso diretto a file, tool, env locali |
| **Remote** | Infrastruttura cloud Anthropic | Continua anche se chiudi l'app; supporta più repo in parallelo |
| **SSH** | Macchina remota di tua gestione | VM, dev container, server con hardware specifico |

**Remote:** usage conta verso i limiti del subscription plan, nessun costo compute separato. Permission modes disponibili: Auto accept edits e Plan mode (non Ask permissions, non Bypass).

**SSH setup:** Environment dropdown → "+ Add SSH connection". Campi: Name, SSH Host (`user@hostname`), SSH Port (default 22), Identity File. Desktop installa Claude Code sulla macchina remota al primo collegamento.

**Pre-configurazione SSH per il team** (managed settings):
```json
{
  "sshConfigs": [
    {
      "id": "shared-dev-vm",
      "name": "Shared Dev VM",
      "sshHost": "user@dev.example.com",
      "sshPort": 22,
      "sshIdentityFile": "~/.ssh/id_ed25519",
      "startDirectory": "~/projects"
    }
  ]
}
```

---

## Permission Modes

Controllano quanto autonomamente Claude può agire. Si cambiano in qualsiasi momento durante la sessione dal mode selector accanto al pulsante di invio.

| Mode | Settings Key | Comportamento | Quando usarla |
|---|---|---|---|
| **Ask permissions** | `default` | Chiede conferma prima di ogni modifica o comando | Nuovi utenti, task delicati |
| **Auto accept edits** | `acceptEdits` | Auto-accetta edit file e comandi filesystem comuni; chiede per comandi terminale | Quando ti fidi delle modifiche ai file |
| **Plan mode** | `plan` | Esplora e propone piano, non scrive nulla finché non approvi | Task complessi, codice critico |
| **Auto** | `auto` | Esegue tutto con safety classifier in background | Max (Opus 4.7), Team, Enterprise |
| **Don't Ask** | `dontAsk` | Auto-nega ogni tool call non pre-approvata; solo via CLI | CI pipeline, ambienti ristretti |
| **Bypass permissions** | `bypassPermissions` | Zero prompt, nessun safety check | Solo container/VM isolati |

### Auto Accept Edits — Cosa Auto-Approva
- Creazione/modifica file nella working directory
- Comandi filesystem: `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed`
- Su Windows (con `CLAUDE_CODE_USE_POWERSHELL_TOOL=1`): `Set-Content`, `Add-Content`, `Clear-Content`, `Remove-Item`

### Plan Mode — Opzioni Dopo il Piano
Quando Claude propone un piano, puoi scegliere:
- **Approve and start in auto mode**
- **Approve and accept edits**
- **Approve and review each edit manually**
- **Keep planning with feedback**
- **Refine with Ultraplan** (revisione browser-based)

`Ctrl+G` — apre il piano nel tuo editor di testo default per modificarlo prima che Claude proceda.

Imposta plan come default in `.claude/settings.json`:
```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

### Auto Mode — Requisiti e Funzionamento
**Requisiti:**
- Claude Code v2.1.83+
- Piano: Max (solo Opus 4.7), Team, Enterprise, o API. **Non disponibile su Pro.**
- Team/Enterprise: admin deve abilitarlo
- Solo Anthropic API (non Bedrock, Vertex, Foundry)

**Blocca di default:** `curl | bash`, invio dati sensibili a endpoint esterni, deploy in produzione, mass deletion, force push su `main`, concessione permessi IAM.

**Permette di default:** operazioni file locali, installazione dipendenze da lock files, lettura `.env` con invio credentials alle API corrispondenti, richieste HTTP read-only, push al branch corrente o a uno creato da Claude.

**Fallback:** 3 blocchi consecutivi o 20 totali → torna a prompting manuale. L'approvazione manuale di un'azione ripristina auto mode.

**Performance dichiarata:** 0,4% false-positive rate, 17% false-negative su test set interno.

### Protected Paths
In tutti i modes eccetto `bypassPermissions`, queste path non vengono mai auto-approvate:

**Directory:** `.git`, `.vscode`, `.idea`, `.husky`, `.claude` (eccetto `.claude/commands`, `.claude/agents`, `.claude/skills`, `.claude/worktrees`)

**File:** `.gitconfig`, `.gitmodules`, `.bashrc`, `.bash_profile`, `.zshrc`, `.zprofile`, `.profile`, `.mcp.json`, `.claude.json`

### Best Practice Permission
> Inizia sempre un task complesso in **Plan mode** → approva il piano → passa ad Auto accept edits o Auto per l'esecuzione.

---

## Diff View

Dopo ogni intervento di Claude, appare un indicatore `+12 -1` (linee aggiunte/rimosse). Click → diff viewer.

**Funzionalità:**
- Lista file modificati a sinistra, diff a destra
- **Commenti su righe specifiche:** click sulla riga → comment box → Enter. Invia tutti i commenti: `Cmd+Enter` (macOS) / `Ctrl+Enter` (Windows)
- Claude legge i commenti e corregge → nuovo diff da rivedere
- **Review Code:** click "Review code" in alto a destra → Claude valuta le modifiche e lascia commenti nel diff view

**Il review si concentra su:** compile errors, logic errors definitivi, security vulnerabilities, bug evidenti. **Non segnala:** style, formatting, problemi preesistenti, cose che cattura un linter.

**Shortcut:** `Cmd+Shift+D` / `Ctrl+Shift+D` — toggle diff pane.

---

## Preview Integrata

Browser embedded per testare l'app mentre Claude lavora.

### Auto-Verify (Attivo di Default)
Dopo ogni modifica ai file, Claude:
1. Prende screenshot
2. Ispeziona il DOM
3. Clicca elementi, compila form
4. Trova e corregge issues autonomamente

Toggle: Preview dropdown → "Auto-verify changes"

### Configurazione `.claude/launch.json`
Claude crea automaticamente questo file nella root del progetto. Modificabile manualmente o via "Edit configuration" nel Preview dropdown.

**Schema completo:**
```json
{
  "version": "0.0.1",
  "autoVerify": true,
  "configurations": [
    {
      "name": "my-app",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000,
      "cwd": "./subfolder",
      "env": { "NODE_ENV": "development" },
      "autoPort": true
    }
  ]
}
```

**Campi:**
| Campo | Tipo | Descrizione |
|---|---|---|
| `name` | string | Identificatore unico del server |
| `runtimeExecutable` | string | Comando: `npm`, `yarn`, `node` |
| `runtimeArgs` | string[] | Argomenti: `["run", "dev"]` |
| `port` | number | Porta (default: 3000) |
| `cwd` | string | Working dir relativa alla root. Usa `${workspaceFolder}` |
| `env` | object | Env vars. Non inserire secrets qui — usa il local environment editor |
| `autoPort` | boolean | `true` = trova porta libera; `false` = errore se occupata |
| `program` | string | Script Node.js da eseguire direttamente (alternativa a `runtimeExecutable`) |
| `args` | string[] | Argomenti per `program` |

**Esempi:**

Next.js con Yarn:
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "web", "runtimeExecutable": "yarn", "runtimeArgs": ["dev"], "port": 3000 }
  ]
}
```

Monorepo con frontend e API:
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "frontend", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "cwd": "apps/web", "port": 3000, "autoPort": true },
    { "name": "api", "runtimeExecutable": "npm", "runtimeArgs": ["run", "start"], "cwd": "server", "port": 8080, "env": { "NODE_ENV": "development" }, "autoPort": false }
  ]
}
```

**Shortcut:**
- `Cmd+Shift+P` — toggle preview pane
- `Cmd+Shift+S` — seleziona elemento nel preview

---

## PR e CI Monitoring

Dopo apertura PR, una barra di stato CI appare nella sessione. Claude usa GitHub CLI (`gh`) per pollare i check.

**Requisito:** GitHub CLI (`gh`) installato e autenticato. Desktop propone di installarlo al primo tentativo di creare un PR.

**Funzionalità:**
- **Auto-fix:** Claude legge automaticamente il failure output e itera per correggerlo
- **Auto-merge:** merge squash automatico quando tutti i check passano — richiede che auto-merge sia abilitato nelle impostazioni del repository GitHub
- **Desktop notification** quando CI finisce
- **Auto-archive sessione** quando PR viene merged/closed (Settings → Claude Code)

---

## Terminal e File Editor Integrati

### Terminal
- Apri con `Ctrl+`` o dal menu **Views**
- Si apre nella working directory della sessione
- **Condivide l'ambiente con Claude**: `npm test`, `git status`, ecc. vedono gli stessi file
- **Solo sessioni local**

### File Editor
- Click su file path nel chat o diff viewer → apre nel file pane
- HTML, PDF, immagini, video aprono nel preview pane
- Spot edit + Save; warning se il file è cambiato su disco
- Click sul path nell'header → copia path assoluta

**Context menu** su qualsiasi file path (right-click):
- **Attach as context** — aggiunge il file al prossimo prompt
- **Open in** — apre in VS Code, Cursor, Zed
- **Show in Finder / Show in Explorer** — apre la cartella
- **Copy path** — copia path assoluta

### View Modes Transcript
`Ctrl+O` per ciclare:
| Mode | Mostra |
|---|---|
| Normal | Tool calls collassate, risposte complete |
| Verbose | Ogni tool call, file read, step intermedio |
| Summary | Solo risposte finali e modifiche |

### Side Chat
`Cmd+;` o `/btw` — apre conversazione laterale che legge il contesto della sessione principale **senza modificarla**. Utile per esplorare idee o fare domande senza deviare il task.

---

## CLAUDE.md — Memoria Persistente per Progetto

### Sistema Duale
1. **CLAUDE.md** — istruzioni scritte da te, persistenti
2. **Auto memory** — note scritte da Claude in `~/.claude/projects/<project>/memory/`

### Locations per Scope

| Scope | Percorso | Condiviso con |
|---|---|---|
| Managed policy (IT) | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md` | Tutti gli utenti org |
| Project (team) | `./CLAUDE.md` o `./.claude/CLAUDE.md` | Team via source control |
| User (personale globale) | `~/.claude/CLAUDE.md` | Solo tu (tutti i progetti) |
| Local (personale per progetto) | `./CLAUDE.local.md` | Solo tu (progetto corrente, in gitignore) |

**Priorità:** più specifico → più generico (Managed > Local > Project > User)

### Creazione con `/init`
`/init` nella sessione → Claude analizza il codebase e crea un CLAUDE.md con build commands, test instructions e convenzioni. Con `CLAUDE_CODE_NEW_INIT=1`: flow interattivo multi-fase con proposta prima di scrivere.

### Struttura Raccomandata
```markdown
# Nome Progetto

## Build & Run
\`\`\`bash
npm install
npm run dev
npm test
\`\`\`

## Architecture
Descrizione architettura breve...

## Coding Standards
- Usa 2-space indentation
- API handlers in `src/api/handlers/`
- Esegui `npm test` prima di committare

## Workflows
Procedure specifiche del progetto...
```

### Best Practice
- **Dimensione:** massimo ~200 righe per file. File più lunghi consumano più context e riducono l'aderenza
- **Specificità:** "Usa 2-space indentation" invece di "formatta bene il codice"
- **Consistenza:** istruzioni contraddittorie → Claude sceglie arbitrariamente
- **HTML comments:** `<!-- note per manutentori -->` vengono strippate prima di entrare nel context di Claude
- Procedure multi-step lunghe → usa **Skills** invece di CLAUDE.md
- Preferenze personali → `~/.claude/CLAUDE.md` o `CLAUDE.local.md`, non il CLAUDE.md del progetto

### Path-Scoped Rules
Crea `.claude/rules/nome-file.md` con frontmatter:
```markdown
---
paths:
  - "src/api/**/*.ts"
  - "lib/**/*.ts"
---

# API Development Rules
- Tutti gli endpoint devono includere input validation
- Usa il formato standard per le risposte di errore
```

### Import di File
```markdown
Vedi @README per la panoramica del progetto e @package.json per i comandi disponibili.
```

### Auto Memory
Storage: `~/.claude/projects/<project>/memory/MEMORY.md` (indice, max 200 righe o 25KB)

Tutti i worktree e subdirectory dello stesso repository condividono la stessa auto memory. Non condivisa tra macchine o ambienti cloud.

Configurazione:
```json
{
  "autoMemoryEnabled": false,
  "autoMemoryDirectory": "~/my-custom-memory-dir"
}
```

---

## Connectors e MCP

### Cosa Sono i Connectors
MCP servers con setup grafico. Disponibili per sessioni local e SSH: click su `+` → Connectors.

**Non disponibili nelle sessioni remote** — usare Routines per quelle.

### Connectors Disponibili (ufficiali)
GitHub, Slack, Linear, Notion, Google Calendar, Google Drive, Jira, Sentry, Figma, PostgreSQL, Airtable, Asana, e molti altri.

### Configurazione MCP via CLI
```bash
# Server HTTP remoto (raccomandato)
claude mcp add --transport http notion https://mcp.notion.com/mcp
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"

# Server stdio locale
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server

# Gestione
claude mcp list
claude mcp remove nome
```

### Configurazione via File

In `~/.claude.json` (user) o `.mcp.json` (project):
```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.github.com/mcp",
      "headers": { "Authorization": "Bearer $GITHUB_TOKEN" }
    },
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": { "DATABASE_URL": "postgresql://localhost/mydb" }
    },
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

> **Attenzione:** MCP servers configurati per la Claude Desktop chat app in `claude_desktop_config.json` sono **separati** da Claude Code. Per usarli in Claude Code, configurarli in `~/.claude.json` o `.mcp.json`.

### MCP Prompts come Slash Commands
I server MCP possono esporre prompt che appaiono come comandi: `/mcp__<server>__<prompt>`

---

## Skills e Plugins

### Cos'è una Skill
Una skill è un file `SKILL.md` con istruzioni YAML frontmatter. Claude le carica automaticamente quando pertinenti, o le invochi con `/nome-skill`.

**Quando crearla:** quando copi sempre le stesse istruzioni nel chat, o quando una sezione di CLAUDE.md è diventata una procedura multi-step.

### Struttura Directory
```
nome-skill/
├── SKILL.md           (richiesto — entrypoint)
├── template.md        (opzionale)
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```

### SKILL.md — Frontmatter Completo
```yaml
---
name: my-skill
description: Cosa fa e quando usarla (max 1536 char)
when_to_use: Context aggiuntivo per trigger
argument-hint: "[issue-number] [format]"
arguments: [issue, branch]
disable-model-invocation: true  # Solo tu puoi invocarla
user-invocable: false           # Solo Claude può invocarla
allowed-tools: Bash(git add *) Bash(git commit *)
model: claude-sonnet-4-6
effort: high
context: fork                   # Esegui in subagent separato
paths:
  - "src/api/**/*.ts"           # Attiva solo per questi file
---

## Contesto dinamico

!`git diff HEAD`

## Istruzioni

Istruzioni per Claude...
```

### Dynamic Context Injection
La sintassi `` !`comando` `` esegue il comando **prima** che Claude veda il contenuto:
```markdown
## Environment
```!
node --version
npm --version
git status --short
```
```

### Dove Vivono le Skills

| Scope | Percorso | Disponibile per |
|---|---|---|
| Enterprise | Managed settings | Tutti gli utenti org |
| Personal | `~/.claude/skills/<name>/SKILL.md` | Tutti i tuoi progetti |
| Project | `.claude/skills/<name>/SKILL.md` | Questo progetto |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Dove il plugin è abilitato |

### Skills Built-in
- `/simplify` — review codice per qualità, efficienza, riuso (3 agent in parallelo)
- `/review` — review PR locale
- `/security-review` — analisi security del branch corrente
- `/debug` — debugging assistito
- `/loop` — ripetizione prompt con self-pacing
- `/batch` — operazioni batch
- `/claude-api` — helper per Anthropic SDK

### Plugins
Pacchetti che aggiungono skills, agenti, hooks, MCP servers, configurazioni LSP.

**Struttura:**
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        (manifest obbligatorio)
├── skills/
├── agents/
├── hooks/
│   └── hooks.json
├── .mcp.json
└── settings.json
```

**`plugin.json` schema:**
```json
{
  "name": "my-plugin",
  "description": "Descrizione",
  "version": "1.0.0",
  "author": { "name": "Your Name" },
  "license": "MIT"
}
```

**Installazione:** `+` → Plugins → Add plugin. Reload senza restart: `/reload-plugins`

**Test locale:**
```bash
claude --plugin-dir ./my-plugin
```

---

## Comandi Slash Built-in — Lista Completa

| Comando | Descrizione |
|---|---|
| `/agents` | Gestisci e crea subagent custom |
| `/btw` | Apre side chat senza modificare il thread principale |
| `/compact` | Compatta il context (libera token) |
| `/config` | Apre menu di configurazione (tema, modello, editor) |
| `/desktop` | Sposta sessione CLI nel Desktop app (macOS/Windows) |
| `/effort` | Imposta livello effort del modello (slider interattivo) |
| `/hooks` | Sfoglia hook configurati |
| `/init` | Genera CLAUDE.md analizzando il codebase |
| `/install-github-app` | Guida setup GitHub Actions |
| `/loop [interval] [prompt]` | Ripeti prompt ricorrentemente. Alias: `/proactive` |
| `/mcp` | Gestisci MCP servers e autenticazione OAuth |
| `/memory` | Modifica CLAUDE.md, toggle auto-memory, visualizza entries |
| `/model [model]` | Cambia modello AI |
| `/permissions` | Gestisci regole allow/ask/deny. Alias: `/allowed-tools` |
| `/plan [description]` | Entra in plan mode direttamente |
| `/plugin` | Gestisci plugins |
| `/powerup` | Lezioni interattive su funzionalità Claude Code |
| `/recap` | Genera summary della sessione corrente |
| `/release-notes` | Changelog con version picker |
| `/reload-plugins` | Ricarica plugin senza restart |
| `/remote-control` | Rendi sessione disponibile per remote control. Alias: `/rc` |
| `/rename [name]` | Rinomina la sessione corrente |
| `/resume [session]` | Riprendi conversazione per ID o nome |
| `/review [PR]` | Review PR locale |
| `/rewind` | Torna a un punto precedente. Alias: `/checkpoint`, `/undo` |
| `/schedule [description]` | Crea/lista/esegui routines. Alias: `/routines` |
| `/security-review` | Analisi security del branch corrente |
| `/simplify [focus]` | Review codice per riuso, qualità, efficienza |
| `/skills` | Lista skills disponibili |
| `/status` | Apre Settings: versione, modello, account |
| `/tasks` | Lista task in background |
| `/teleport` | Porta sessione web nel terminale. Alias: `/tp` |
| `/theme` | Cambia tema colori |
| `/ultraplan <prompt>` | Draft piano nel CLI, review nel browser, esegui remotamente |
| `/ultrareview [PR]` | Review approfondita multi-agent in cloud sandbox |
| `/usage` | Mostra costo sessione, limiti piano, activity stats |
| `/voice` | Toggle voice dictation |

---

## settings.json — Configurazione Completa

### File e Precedenza
```
1. MANAGED (MDM/server) — più alta priorità, non sovrascrivibile
2. COMMAND LINE ARGS
3. LOCAL (.claude/settings.local.json)
4. PROJECT (.claude/settings.json)
5. USER (~/.claude/settings.json) — priorità più bassa
```

**Schema JSON:** `https://json.schemastore.org/claude-code-settings.json`

### Permissions
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(git *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ],
    "ask": ["Bash(git push *)"],
    "defaultMode": "acceptEdits",
    "additionalDirectories": ["../docs/"],
    "disableBypassPermissionsMode": "disable"
  }
}
```

**Sintassi regole:**
```
Bash(npm run *)       → comandi che iniziano con "npm run"
Bash                  → tutti i comandi bash
Read(./.env)          → file specifico
Read(./secrets/**)    → wildcard
WebFetch(domain:example.com)
Edit(./config.json)
MCP(tool:*)
Agent(subagent-name)
```

### Model e Effort
```json
{
  "model": "claude-sonnet-4-6",
  "effortLevel": "high",
  "alwaysThinkingEnabled": true
}
```

### Environment Variables
```json
{
  "env": {
    "NODE_ENV": "development",
    "CUSTOM_VAR": "value"
  }
}
```

### Sandbox
```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["/tmp/build"],
      "denyWrite": ["/etc"],
      "denyRead": ["~/.aws/credentials"]
    },
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org"],
      "deniedDomains": ["uploads.github.com"]
    }
  }
}
```

### Attribution Commit
```json
{
  "attribution": {
    "commit": "🤖 Generated with Claude Code\n\nCo-Authored-By: Claude <noreply@anthropic.com>",
    "pr": "🤖 Generated with Claude Code"
  }
}
```

### Worktree
```json
{
  "worktree": {
    "symlinkDirectories": ["node_modules", ".cache"],
    "sparsePaths": ["packages/my-app", "shared/utils"]
  }
}
```

### Auto Memory
```json
{
  "autoMemoryEnabled": true,
  "autoMemoryDirectory": "~/my-custom-memory-dir"
}
```

### Updates Channel
```json
{
  "autoUpdatesChannel": "stable"
}
```
`"stable"` — circa 1 settimana di ritardo, salta release con regressioni. `"latest"` — versione più recente immediata.

---

## Hooks

Sistema per eseguire comandi shell in risposta a eventi di Claude Code.

### Tipi di Hook
1. `command` — shell script che riceve JSON su stdin
2. `http` — POST request a URL
3. `mcp_tool` — chiama un tool MCP
4. `prompt` — valutazione LLM single-turn
5. `agent` — verifica basata su subagent (experimental)

### Hook Events Principali
- `SessionStart` / `SessionEnd`
- `UserPromptSubmit` — prima che Claude processi il prompt
- `PreToolUse` — prima di ogni tool call (può bloccare)
- `PostToolUse` — dopo successo
- `Stop` — quando Claude finisce di rispondere

### Configurazione
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "./.claude/hooks/lint.sh",
            "async": false,
            "timeout": 60,
            "statusMessage": "Running lint..."
          }
        ]
      }
    ]
  }
}
```

### Exit Codes Command Hook
| Codice | Significato | Comportamento |
|---|---|---|
| 0 | Success | JSON parsato da stdout |
| 2 | Blocking error | Blocca l'azione, mostra stderr |
| Altro | Non-blocking error | Mostra prima riga stderr, continua |

---

## GitHub Actions

### Setup Rapido
```bash
/install-github-app  # wizard guidato
```

### Workflow Base
```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Trigger con @claude
```
@claude implement this feature based on the issue description
@claude fix the TypeError in the user dashboard component
@claude how should I implement user authentication?
```

### Scheduled Automation
```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Genera un summary dei commit di ieri e delle issue aperte"
          claude_args: "--model opus"
```

---

## Sub-Agents e Agent SDK

### Sub-Agents Built-in
| Agent | Modello | Strumenti | Uso |
|---|---|---|---|
| **Explore** | Haiku | Read, Glob, Grep, Bash (read-only) | Esplorazione codebase senza modifiche |
| **Plan** | Eredita | Tutto | Ricerca per plan mode |
| **general-purpose** | Eredita | Tutto | Task complessi multi-step |

### Definire un Subagent Custom
```markdown
---
name: code-reviewer
description: Revisiona il codice per qualità e best practice. Usa dopo ogni modifica al codice.
tools: Read, Glob, Grep
model: sonnet
permissionMode: default
maxTurns: 20
isolation: worktree
---

Sei un code reviewer esperto. Analizza il codice e fornisci feedback azionabile
su qualità, sicurezza e best practice.
```

**Campi principali:**
| Campo | Descrizione |
|---|---|
| `name` | Identificatore unico (lowercase + hyphens) |
| `description` | Quando Claude delega a questo subagent |
| `tools` | Tools permessi (eredita tutto se omesso) |
| `model` | `sonnet`, `opus`, `haiku`, o full model ID |
| `permissionMode` | Modalità permesso per il subagent |
| `maxTurns` | Max agentic turns prima dello stop |
| `isolation` | `worktree` = esegui in git worktree temporaneo |
| `memory` | `user`, `project`, `local` — memoria persistente |
| `background` | `true` = sempre background task |

**Location e priorità:**
```
1. Managed settings (organization-wide) — priorità più alta
2. --agents CLI flag (sessione corrente)
3. .claude/agents/ (progetto corrente)
4. ~/.claude/agents/ (tutti i tuoi progetti)
5. Plugin agents/ — priorità più bassa
```

### Agent SDK (TypeScript/Python)
```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Trova e correggi il bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    print(message)
```

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Trova e correggi il bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

---

## Piani e Funzionalità

| Funzionalità | Pro | Max | Team | Enterprise |
|---|---|---|---|---|
| Claude Code (CLI) | Sì | Sì | Sì | Sì |
| Desktop app | Sì | Sì | Sì | Sì |
| Auto mode | No | Sì (solo Opus 4.7) | Sì | Sì |
| Computer use (Desktop/CLI) | Sì | Sì | No | No |
| Dispatch | Sì | Sì | No | No |
| Remote sessions | Sì | Sì | Sì | Sì |
| Cloud Routines | No | Sì (15/giorno) | Sì (25/giorno) | Sì (25/giorno) |
| GitHub Code Review | No | No | Sì | Sì |
| SSH sessions | Sì | Sì | Sì | Sì |

---

## Keyboard Shortcuts — Code Tab

| Shortcut | Azione |
|---|---|
| `Cmd+N` | Nuova sessione |
| `Cmd+W` | Chiudi sessione |
| `Ctrl+Tab` / `Ctrl+Shift+Tab` | Sessione successiva / precedente |
| `Esc` | Interrompi Claude |
| `Cmd+Shift+D` | Toggle diff pane |
| `Cmd+Shift+P` | Toggle preview pane |
| `Cmd+Shift+S` | Seleziona elemento nel preview |
| `Ctrl+\`` | Toggle terminal |
| `Cmd+;` | Apri side chat |
| `Ctrl+O` | Cicla view mode |
| `Cmd+Shift+M` | Apri menu permission mode |
| `Cmd+Shift+I` | Apri menu modello |
| `Cmd+Shift+E` | Apri menu effort |
| `Cmd+/` | Mostra tutti i shortcuts |

---

## Continuità tra Superfici

- `/desktop` da terminale CLI → porta la sessione nell'app desktop
- "Continue in" nel toolbar → manda la sessione locale al cloud (remote) o apre l'IDE
- `/remote-control` → rende la sessione accessibile da telefono o altro browser
- Remote sessions → monitorabili da `claude.ai/code` o iOS app
- Sessioni Dispatch → appaiono nel tab Code con badge, avviate da Cowork
