import fs from 'fs'
import path from 'path'

export function getKnowledge(): string {
  const claudeDir = path.join(process.cwd(), '..', 'claude')

  const chat = fs.readFileSync(path.join(claudeDir, '01_chat.md'), 'utf-8')
  const cowork = fs.readFileSync(path.join(claudeDir, '02_cowork.md'), 'utf-8')
  const code = fs.readFileSync(path.join(claudeDir, '03_code.md'), 'utf-8')

  return [
    '# MODALITA CHAT\n\n' + chat,
    '# MODALITA COWORK\n\n' + cowork,
    '# MODALITA CODE\n\n' + code,
  ].join('\n\n---\n\n')
}
