import { useEffect, useMemo, useState } from 'react'
import styles from '../shared/page.module.css'
import dbStyles from './database.module.css'

import dbDoc from '../../shared/content/25.06.25-数据库建设介绍.doc.json'

type Block = { type: 'p'; text: string } | { type: 'table'; rows: string[][] }

type Disease = {
  id: string
  title: string
  description: string
  sources: string[]
  cases?: string
  share?: string
  contact?: string
  phone?: string
}

function getParas(blocks: Block[]) {
  return blocks.filter((b) => b.type === 'p').map((b) => (b as { type: 'p'; text: string }).text)
}

function afterLabel(paras: string[], label: string) {
  const idx = paras.findIndex((t) => t.trim() === label.trim())
  if (idx < 0) return ''
  return paras[idx + 1] ?? ''
}

function splitSources(raw: string) {
  const cleaned = raw
    .replace(/本数据库主要收集整理了/, '')
    .replace(/共.+$/, '')
    .replace(/数据，实现了.*$/, '')
    .replace(/本数据库主要收集整理了/, '')
    .trim()
  const parts = cleaned
    .replace(/及/g, '、')
    .replace(/和/g, '、')
    .split('、')
    .map((s) => s.trim())
    .filter(Boolean)
  return Array.from(new Set(parts))
}

function parseDiseases(paras: string[]) {
  const start = paras.findIndex((t) => t.trim() === '专病库介绍：')
  if (start < 0) return []

  const diseases: Disease[] = []
  let cur: Disease | null = null
  let desc: string[] = []

  const flush = () => {
    if (!cur) return
    cur.description = desc.join('\n').trim()
    diseases.push(cur)
    cur = null
    desc = []
  }

  for (let i = start + 1; i < paras.length; i++) {
    const line = paras[i].trim()
    const m = line.match(/^(\d+)\.(.+)$/)
    if (m && line.includes('专病库')) {
      flush()
      const title = m[2].trim()
      cur = {
        id: String(m[1]),
        title,
        description: '',
        sources: [],
      }
      continue
    }
    if (!cur) continue

    if (line.startsWith('共享方式：')) {
      cur.share = line.replace('共享方式：', '').trim()
      continue
    }
    if (line.startsWith('联系人：')) {
      cur.contact = line.replace('联系人：', '').trim()
      continue
    }
    if (line.startsWith('联系方式：')) {
      cur.phone = line.replace('联系方式：', '').trim()
      continue
    }

    const cases = line.match(/共(\d+[^例]{0,6})例/)
    if (cases) cur.cases = cases[1]
    const src = line.match(/本数据库主要收集整理了(.+?)共/)
    if (src) cur.sources = splitSources(src[0])

    desc.push(line)
  }

  flush()
  return diseases
}

function parsePlatforms(paras: string[]) {
  const platforms: { name: string; points: string[] }[] = []
  let cur: { name: string; points: string[] } | null = null

  const push = () => {
    if (cur && cur.points.length) platforms.push(cur)
    cur = null
  }

  for (const t of paras) {
    const line = t.trim()
    const head = line.match(/^(.*?)(?:科研)?平台操作平台特点[:：]$/)
    if (head) {
      push()
      cur = { name: head[1].trim(), points: [] }
      continue
    }
    if (!cur) continue
    if (
      line.endsWith('操作界面：') ||
      line.endsWith('操作平台特点：') ||
      line === '2.数据中心现有配置' ||
      line === '专病库介绍：'
    ) {
      push()
      continue
    }
    if (line.length <= 30) cur.points.push(line)
  }

  push()
  return platforms
}

export function DatabasePage() {
  const blocks = (dbDoc as { blocks: Block[] }).blocks
  const paras = getParas(blocks)

  const equipmentText = afterLabel(paras, '设备介绍：')
  const platformText = afterLabel(paras, '共享数据库介绍：')
  const softwareIntro = afterLabel(paras, '1.科研平台')
  const configText = afterLabel(paras, '2.数据中心现有配置')

  const platforms = parsePlatforms(paras)
  const diseases = parseDiseases(paras)

  const equipmentTags = equipmentText
    .split(/[、，,]/)
    .map((s) => s.trim())
    .filter((s) => s && s.length <= 24)
    .slice(0, 12)

  // Emphasize numbers/units logic
  const emphasize = (text: string) => {
    const parts = text.split(/(\d+(?:\.\d+)?\+?)(张|人次|套|台|T|项|例|位|家|篇|年|个)?/g)
    return parts.map((p, idx) => {
      if (idx % 3 === 1) {
        const unit = parts[idx + 1] ?? ''
        return (
          <span key={`${idx}-${p}`} className={dbStyles.keyStrong}>
            {p}
            {unit}
          </span>
        )
      }
      if (idx % 3 === 2) return null
      return <span key={`${idx}-${p}`}>{p}</span>
    })
  }

  const [more, setMore] = useState<{ title: string; text: string } | null>(null)

  useEffect(() => {
    if (!more) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMore(null)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [more])

  const moreParas = useMemo(() => {
    const text = more?.text ?? ''
    return text
      .replace(/\r/g, '')
      .split(/[。；;]\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (/[。]$/.test(s) ? s : `${s}。`))
  }, [more])

  const renderLearnMoreButton = (label: string, onClick: () => void) => (
    <button className={dbStyles.learnMore} type="button" onClick={onClick}>
      <span className={dbStyles.circle} aria-hidden="true">
        <span className={`${dbStyles.icon} ${dbStyles.arrow}`} />
      </span>
      <span className={dbStyles.buttonText}>{label}</span>
    </button>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>数据库建设</h1>
          <p className={styles.lead}>围绕设备条件、互认共享平台、科研软件平台与专病数据库建设，形成可持续运营的数据资源体系。</p>
        </header>

        <section className={dbStyles.section}>
          <div className={dbStyles.bento}>
            {/* Bento A: Equipment */}
            <div className={`${dbStyles.card} ${dbStyles.bentoA}`}>
              <div className={dbStyles.title}>设备条件</div>
              <div className={dbStyles.tagRow}>
                {equipmentTags.map((t) => (
                  <span key={t} className={dbStyles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <ul className={dbStyles.keyList}>
                 {/* Simple summary points if we can't extract bullet points */}
                 <li>配备西门子、GE、飞利浦等高端影像设备</li>
                 <li>{equipmentText.slice(0, 40)}...</li>
              </ul>
              <div className={dbStyles.moreRow}>
                {renderLearnMoreButton('了解更多', () => setMore({ title: '设备条件', text: equipmentText }))}
              </div>
            </div>

            {/* Bento B: Sharing Platform */}
            <div className={`${dbStyles.card} ${dbStyles.bentoB}`}>
              <div className={dbStyles.title}>互认共享平台</div>
              <div className={dbStyles.text} style={{ marginTop: 12 }}>
                {platformText.slice(0, 80)}...
              </div>
              <div className={dbStyles.moreRow}>
                {renderLearnMoreButton('了解更多', () => setMore({ title: '互认共享平台', text: platformText }))}
              </div>
            </div>

            {/* Bento E: Research Software */}
            <div className={`${dbStyles.card} ${dbStyles.bentoE}`}>
              <div className={dbStyles.title}>科研软件平台</div>
              <div className={dbStyles.text} style={{ marginTop: 8 }}>{softwareIntro}</div>
              {platforms.length ? (
                <div className={dbStyles.gridList}>
                  {platforms.map((p) => (
                    <div key={p.name} className={dbStyles.miniCard}>
                      <div className={dbStyles.miniTitle}>{p.name}</div>
                      <ul className={dbStyles.keyList} style={{ marginTop: 0 }}>
                        {p.points.map((pt) => (
                          <li key={pt} style={{ fontSize: 12, margin: '4px 0' }}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Bento E: Config (Optional) */}
            {configText ? (
                <div className={`${dbStyles.card} ${dbStyles.bentoE}`}>
                    <div className={dbStyles.title}>数据中心现有配置</div>
                     <div className={dbStyles.text} style={{ marginTop: 12 }}>
                        {configText}
                    </div>
                </div>
            ) : null}

            {/* Bento E: Special Diseases */}
            <div className={`${dbStyles.card} ${dbStyles.bentoE}`}>
              <div className={dbStyles.title}>专病数据库</div>
              <div className={dbStyles.gridList}>
                {diseases.map((it) => (
                  <div key={it.id} className={dbStyles.miniCard} style={{ gridColumn: 'span 1' }}>
                    <div className={dbStyles.miniTitle}>
                      {it.title}
                      <span className={dbStyles.miniBadge}>{it.cases ? `病例 ${it.cases}` : '线上'}</span>
                    </div>
                    <div className={dbStyles.miniText}>
                      {it.description}
                    </div>
                     <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                         <button 
                             style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                             onClick={() => setMore({ title: it.title, text: `${it.description}\n\n${it.sources.length ? '数据来源：' + it.sources.join('、') : ''}\n${it.contact ? '联系人：' + it.contact : ''} ${it.phone ? '电话：' + it.phone : ''}` })}
                         >
                             详情 &rarr;
                         </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {more ? (
        <div className={dbStyles.overlay} onMouseDown={() => setMore(null)} role="dialog" aria-modal="true">
          <div className={dbStyles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={dbStyles.modalHeader}>
              <div className={dbStyles.modalTitle}>{more.title}</div>
              <button className={dbStyles.modalClose} type="button" onClick={() => setMore(null)} aria-label="close">
                ×
              </button>
            </div>
            <div className={dbStyles.modalBody}>
              <div className={dbStyles.modalText}>
                {moreParas.map((p, idx) => (
                  <p key={idx}>{emphasize(p)}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
