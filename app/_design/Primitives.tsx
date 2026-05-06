'use client'

import { ReactNode } from 'react'
import * as Si from 'react-icons/si'
import { Mode, modeColor } from '../_design/tokens'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  gmail:           Si.SiGmail,
  slack:           Si.SiSlack,
  zoom:            Si.SiZoom,
  whatsapp:        Si.SiWhatsapp,
  google:          Si.SiGoogle,
  notion:          Si.SiNotion,
  confluence:      Si.SiConfluence,
  dropbox:         Si.SiDropbox,
  jira:            Si.SiJira,
  linear:          Si.SiLinear,
  asana:           Si.SiAsana,
  trello:          Si.SiTrello,
  clickup:         Si.SiClickup,
  salesforce:      Si.SiSalesforce,
  hubspot:         Si.SiHubspot,
  zendesk:         Si.SiZendesk,
  googleanalytics: Si.SiGoogleanalytics,
  airtable:        Si.SiAirtable,
  figma:           Si.SiFigma,
  canva:           Si.SiCanva,
  wordpress:       Si.SiWordpress,
  quickbooks:      Si.SiIntuit,
  xero:            Si.SiXero,
  sap:             Si.SiSap,
  bamboo:          Si.SiBamboo,
  github:          Si.SiGithub,
  gitlab:          Si.SiGitlab,
  postman:         Si.SiPostman,
  vercel:          Si.SiVercel,
  shopify:         Si.SiShopify,
  woocommerce:     Si.SiWoocommerce,
  stripe:          Si.SiStripe,
}

export function ToolIcon({ slug, size = 13 }: { slug: string; size?: number }) {
  const Icon = ICON_MAP[slug]
  if (!Icon) return null
  return <Icon size={size} />
}

export function Chip({
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
  icon,
  children,
  mono = false,
}: {
  active: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  icon?: ReactNode
  children: ReactNode
  mono?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => {
        onMouseEnter?.()
        if (!active) e.currentTarget.style.borderColor = 'var(--ink-muted)'
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.()
        if (!active) e.currentTarget.style.borderColor = 'var(--line)'
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] border transition-all duration-200 ${
        mono ? 'font-mono-ui' : ''
      }`}
      style={{
        borderColor: active ? 'var(--ink)' : 'var(--line)',
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink-muted)',
      }}
    >
      {icon && <span style={{ opacity: active ? 0.85 : 0.55, display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  )
}

export function Dot({ mode, size = 8 }: { mode: Mode; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: modeColor(mode),
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  )
}

export function Spinner() {
  return (
    <span
      className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin"
      style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
    />
  )
}

export function Field({
  index,
  label,
  hint,
  children,
}: {
  index: string
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span
          className="font-mono-ui text-[11px] tracking-[0.15em]"
          style={{ color: 'var(--ink-faint)' }}
        >
          {index}
        </span>
        <span
          className="font-serif-display text-[20px] tracking-tight"
          style={{ color: 'var(--ink)' }}
        >
          {label}
        </span>
        {hint && (
          <span className="text-[12px] italic" style={{ color: 'var(--ink-faint)' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
