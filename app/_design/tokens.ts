// Shared types & design tokens for the redesign

export const ROLE_CHIPS = [
  'Marketing manager',
  'Consulente',
  'Avvocato',
  'Sviluppatore',
  'Founder',
  'Account manager',
] as const

export const ROLE_EXAMPLES: Record<string, string> = {
  'Marketing manager':
    'Sono marketing manager in una PMI tech. Gestisco campagne digital e social, coordino un\'agenzia esterna, preparo report mensili per il board e scrivo contenuti per blog e newsletter.',
  'Consulente':
    'Sono consulente strategico freelance. Lavoro con 3-4 clienti in parallelo, produco deliverable (slide, analisi, roadmap) e gestisco la relazione commerciale in autonomia.',
  'Avvocato':
    'Sono avvocato in uno studio boutique. Mi occupo di contrattualistica, due diligence e assistenza a startup. Redigo atti, rispondo ai clienti via email e seguo trattative.',
  'Sviluppatore':
    'Sono sviluppatore fullstack in una startup SaaS. Lavoro su React e Node.js, partecipo a code review, scrivo documentazione e mi coordino con il product manager.',
  'Founder':
    'Sono founder di una startup B2B in fase early. Mi occupo di tutto: sales, prodotto, team, investor relations e comunicazione esterna. Il tempo è la risorsa più scarsa.',
  'Account manager':
    'Sono account manager in un\'agenzia di comunicazione. Gestisco 8 clienti, coordino team creativi interni, preparo preventivi e seguo il rinnovo dei contratti.',
}

export const SECTOR_CHIPS = [
  'Tech / SaaS',
  'Consulenza',
  'Legal',
  'Finance',
  'Marketing / Media',
  'Healthcare',
  'Retail / E-commerce',
  'Manifattura',
  'Altro',
] as const

export interface ToolItem {
  name: string
  icon: string // simple-icons slug
}

export interface ToolCategory {
  label: string
  tools: ToolItem[]
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    label: 'Comunicazione',
    tools: [
      { name: 'Gmail',            icon: 'gmail' },
      { name: 'Outlook',          icon: 'microsoftoutlook' },
      { name: 'Slack',            icon: 'slack' },
      { name: 'Microsoft Teams',  icon: 'microsoftteams' },
      { name: 'Zoom',             icon: 'zoom' },
      { name: 'WhatsApp',         icon: 'whatsapp' },
    ],
  },
  {
    label: 'Produttività & Documenti',
    tools: [
      { name: 'Google Workspace', icon: 'google' },
      { name: 'Microsoft 365',    icon: 'microsoft' },
      { name: 'Notion',           icon: 'notion' },
      { name: 'Confluence',       icon: 'confluence' },
      { name: 'SharePoint',       icon: 'sharepoint' },
      { name: 'Dropbox',          icon: 'dropbox' },
    ],
  },
  {
    label: 'Project Management',
    tools: [
      { name: 'Jira',             icon: 'jira' },
      { name: 'Linear',           icon: 'linear' },
      { name: 'Asana',            icon: 'asana' },
      { name: 'Monday.com',       icon: 'mondaydotcom' },
      { name: 'Trello',           icon: 'trello' },
      { name: 'ClickUp',          icon: 'clickup' },
    ],
  },
  {
    label: 'CRM & Vendite',
    tools: [
      { name: 'Salesforce',       icon: 'salesforce' },
      { name: 'HubSpot',          icon: 'hubspot' },
      { name: 'Pipedrive',        icon: 'pipedrive' },
      { name: 'Zendesk',          icon: 'zendesk' },
    ],
  },
  {
    label: 'Dati & Analytics',
    tools: [
      { name: 'Excel / Sheets',   icon: 'microsoftexcel' },
      { name: 'Power BI',         icon: 'powerbi' },
      { name: 'Tableau',          icon: 'tableau' },
      { name: 'Google Analytics', icon: 'googleanalytics' },
      { name: 'Airtable',         icon: 'airtable' },
    ],
  },
  {
    label: 'Design & Contenuti',
    tools: [
      { name: 'Figma',            icon: 'figma' },
      { name: 'Canva',            icon: 'canva' },
      { name: 'Adobe CC',         icon: 'adobe' },
      { name: 'WordPress',        icon: 'wordpress' },
    ],
  },
  {
    label: 'Finance & Legal',
    tools: [
      { name: 'QuickBooks',       icon: 'quickbooks' },
      { name: 'Xero',             icon: 'xero' },
      { name: 'DocuSign',         icon: 'docusign' },
      { name: 'SAP',              icon: 'sap' },
    ],
  },
  {
    label: 'HR & Operazioni',
    tools: [
      { name: 'Workday',          icon: 'workday' },
      { name: 'BambooHR',         icon: 'bamboo' },
      { name: 'Factorial',        icon: 'factorial' },
    ],
  },
  {
    label: 'Sviluppo',
    tools: [
      { name: 'GitHub',           icon: 'github' },
      { name: 'GitLab',           icon: 'gitlab' },
      { name: 'VS Code',          icon: 'visualstudiocode' },
      { name: 'Postman',          icon: 'postman' },
      { name: 'Vercel',           icon: 'vercel' },
    ],
  },
  {
    label: 'E-commerce',
    tools: [
      { name: 'Shopify',          icon: 'shopify' },
      { name: 'WooCommerce',      icon: 'woocommerce' },
      { name: 'Stripe',           icon: 'stripe' },
    ],
  },
]

// flat list used in the API payload
export const TOOL_CHIPS = TOOL_CATEGORIES.flatMap((c) => c.tools.map((t) => t.name))

export const SECTOR_TOOL_DEFAULTS: Record<string, string[]> = {
  'Tech / SaaS':        ['Slack', 'GitHub', 'Notion', 'Linear', 'Vercel', 'Postman'],
  'Consulenza':         ['Google Workspace', 'Slack', 'Notion', 'Zoom', 'Airtable'],
  'Legal':              ['Gmail', 'Zoom', 'Notion', 'DocuSign', 'Xero'],
  'Finance':            ['Excel / Sheets', 'QuickBooks', 'Xero', 'SAP'],
  'Marketing / Media':  ['Google Analytics', 'Canva', 'Figma', 'HubSpot', 'Notion', 'Slack'],
  'Healthcare':         ['Google Workspace', 'Zoom', 'Slack', 'Notion'],
  'Retail / E-commerce':['Shopify', 'WooCommerce', 'Stripe', 'Google Analytics', 'Canva'],
  'Manifattura':        ['SAP', 'Excel / Sheets', 'Workday'],
  'Altro':              [],
}

export const MODES = {
  Chat:   { hue: 285, label: 'Chat',   desc: 'Conversazione e analisi' },
  Cowork: { hue: 35,  label: 'Cowork', desc: 'Computer use, automazione' },
  Code:   { hue: 245, label: 'Code',   desc: 'Sviluppo e scripting' },
} as const

export type Mode = keyof typeof MODES

export const modeColor   = (m: Mode, l = 0.62, c = 0.12) => `oklch(${l} ${c} ${MODES[m].hue})`
export const modeBg      = (m: Mode) => `oklch(0.965 0.025 ${MODES[m].hue})`
export const modeBorder  = (m: Mode) => `oklch(0.92 0.04 ${MODES[m].hue})`

export interface Scenario {
  mode: Mode
  title: string
  description: string
}

export interface Detail {
  how_to: string
  steps: string[]
  example_prompt: string
}
