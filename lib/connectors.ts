// Maps user-selected tool names to their Claude connector capability.
// Only connectors relevant to the selected tools are injected into the prompt.
const CONNECTOR_MAP: Record<string, { name: string; description: string }> = {
  'Gmail':              { name: 'Gmail',            description: 'bozza risposte, riassumi thread, ricerca inbox' },
  'Slack':              { name: 'Slack',             description: 'invia messaggi, crea canvas, recupera dati dai canali' },
  'Zoom':               { name: 'Zoom for Claude',   description: 'cerca, riassumi e agisce su meeting e registrazioni Zoom' },
  'Google Workspace':   { name: 'Google Drive',      description: 'trova e analizza file in Drive, Docs, Sheets, Gmail' },
  'Microsoft 365':      { name: 'Microsoft 365',     description: 'accede a SharePoint, OneDrive, Outlook e Teams' },
  'Notion':             { name: 'Notion',             description: 'legge, scrive e gestisce pagine e database Notion' },
  'Confluence':         { name: 'Atlassian Rovo',    description: 'cerca e accede a Jira issues e pagine Confluence' },
  'Jira':               { name: 'Atlassian Rovo',    description: 'gestisce issue, sprint e progetti Jira' },
  'Linear':             { name: 'Linear',             description: 'gestisce issue, progetti e workflow del team' },
  'Asana':              { name: 'Asana',              description: 'crea e gestisce task, progetti e goal' },
  'Monday.com':         { name: 'monday.com',         description: 'gestisce board, progetti e automazioni' },
  'ClickUp':            { name: 'ClickUp',            description: 'project e task management all-in-one' },
  'HubSpot':            { name: 'HubSpot',            description: 'pipeline CRM, marketing automation e sales data' },
  'Airtable':           { name: 'Airtable',           description: 'accede a basi dati strutturati e automazioni' },
  'Figma':              { name: 'Figma',              description: 'genera diagrammi e codice dai design Figma' },
  'Canva':              { name: 'Canva',              description: 'crea, compila automaticamente ed esporta design' },
  'WordPress':          { name: 'WordPress.com',      description: 'gestisce e pubblica contenuti sul sito' },
  'QuickBooks':         { name: 'QuickBooks',         description: 'contabilità PMI e reportistica finanziaria' },
  'Xero':               { name: 'Xero',               description: 'contabilità cloud e gestione fatture' },
  'DocuSign':           { name: 'DocuSign',           description: 'gestione contratti e firma elettronica' },
  'GitLab':             { name: 'GitLab',             description: 'code hosting, CI/CD e DevOps' },
  'GitHub':             { name: 'GitHub',             description: 'gestisce repository, PR, issue e Actions' },
  'Postman':            { name: 'Postman',            description: 'accede a collection API e documentazione' },
  'Vercel':             { name: 'Vercel',             description: 'analizza, debugga e gestisce deployment' },
  'Shopify':            { name: 'Shopify',            description: 'gestisce store, prodotti, ordini e analytics' },
  'Stripe':             { name: 'Stripe',             description: 'dati di pagamento, subscription e revenue' },
  'Tableau':            { name: 'Tableau',            description: 'dashboard BI e visualizzazioni dati' },
  'Salesforce':         { name: 'Salesforce (via CData)', description: 'accede a CRM, pipeline e dati cliente' },
  'Google Analytics':   { name: 'Google Analytics (via Drive)', description: 'report e metriche di traffico web' },
  'Dropbox':            { name: 'Box / Dropbox',      description: 'accede e gestisce file cloud aziendali' },
}

export function getRelevantConnectors(tools: string[]): string {
  const matches = tools
    .map((t) => ({ tool: t, connector: CONNECTOR_MAP[t] }))
    .filter(({ connector }) => !!connector)

  if (matches.length === 0) return ''

  const lines = matches.map(
    ({ tool, connector }) =>
      `- ${tool}: connettore Claude "${connector.name}" — ${connector.description}`
  )

  return (
    '\nCONNETTORI CLAUDE ATTIVI (menzionali negli scenari dove aggiungono valore concreto):\n' +
    lines.join('\n') +
    '\n'
  )
}
