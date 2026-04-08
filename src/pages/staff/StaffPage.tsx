import { useEffect, useMemo, useState } from 'react'
import styles from '../shared/people.module.css'
import { parseBioSections } from '../shared/formatBio'

import expertsDoc from '../../shared/content/25.06.25-专家介绍.doc.json'

type Block = { type: 'p'; text: string } | { type: 'table'; rows: string[][] }

type StaffMember = {
  id: number
  name: string
  headline: string
  bio: string
  image: string
}

function getParas(blocks: Block[]) {
  return blocks.filter((b) => b.type === 'p').map((b) => (b as { type: 'p'; text: string }).text)
}

function sliceAfter(paras: string[], startLabel: string) {
  const idx = paras.findIndex((t) => t.trim() === startLabel.trim())
  return idx >= 0 ? paras.slice(idx + 1) : []
}

function parsePeople(paras: string[]) {
  const out: Omit<StaffMember, 'image'>[] = []
  let cur: Omit<StaffMember, 'image'> | null = null
  let bio: string[] = []

  const flush = () => {
    if (!cur) return
    cur.bio = bio.join('\n').trim()
    out.push(cur)
    cur = null
    bio = []
  }

  for (const raw of paras) {
    const line = raw.trim()
    if (!line) continue

    const m = line.match(/^([^：]{2,16})：(.+)$/)
    if (m) {
      flush()
      const id = out.length + 1
      const name = m[1].trim()
      const headline = m[2].trim()
      cur = { id, name, headline, bio: '' }
      continue
    }
    if (!cur) continue
    bio.push(line)
  }

  flush()
  return out
}

export function StaffPage() {
  const blocks = (expertsDoc as { blocks: Block[] }).blocks
  const paras = getParas(blocks)
  const staffSection = sliceAfter(paras, '主要工作人员:')
  const staffRaw = parsePeople(staffSection)

  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<StaffMember | null>(null)

  const staff = useMemo(() => {
    const keyword = q.trim()
    const filtered = keyword ? staffRaw.filter((m) => `${m.name} ${m.headline} ${m.bio}`.includes(keyword)) : staffRaw
    return filtered.map((m) => {
      const image = m.id >= 1 && m.id <= 21 ? `/images/staff/${m.id}.png` : '/images/center/center.png'
      return { ...m, image }
    })
  }, [q, staffRaw])

  const bioSections = useMemo(() => (selected ? parseBioSections(selected.bio) : []), [selected])

  const formatLead = (text: string) => {
    const clean = text.replace(/\s+/g, ' ').trim()
    if (!clean) return { lead: '', rest: '' }
    const match = clean.match(/^(.+?[，。；;:：])(.*)$/)
    if (!match) return { lead: clean, rest: '' }
    return { lead: match[1].trim(), rest: match[2].trim() }
  }

  useEffect(() => {
    if (!selected) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [selected])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.h1}>主要工作人员</h1>
            <p className={styles.lead}>负责数据治理、平台建设、科研转化与运行管理的核心团队。</p>
            <div className={styles.searchRow}>
              <input
                className={styles.searchInput}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索姓名、单位或关键词"
              />
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.count}>当前显示 {staff.length} / {staffRaw.length}</div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.grid}>
            {staff.map((m) => (
              <button key={`${m.id}-${m.name}`} className={styles.card} type="button" onClick={() => setSelected(m)}>
                <div className={styles.cardTop}>
                  <div className={styles.avatarWrap} aria-hidden="true">
                    <img
                      className={styles.avatar}
                      src={m.image}
                      alt=""
                      loading="lazy"
                      onError={(ev) => {
                        const img = ev.currentTarget
                        img.onerror = null
                        img.src = '/images/center/center.png'
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className={styles.cardTitle}>{m.name}</div>
                    <div className={styles.cardMeta}>{m.headline}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selected ? (
        <div className={styles.modalOverlay} onMouseDown={() => setSelected(null)} role="dialog" aria-modal="true">
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalPattern} aria-hidden="true">
              <div className={styles.modalBar}>
                <div className={styles.modalTag}>STAFF</div>
                <button className={styles.closeBtn} type="button" onClick={() => setSelected(null)} aria-label="close">
                  ×
                </button>
              </div>
              <div className={styles.futuristicPattern}>
                <span className={styles.rippleOverlay} />
                <svg className={styles.textureFilter}>
                  <filter id="advanced-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise" />
                    <feSpecularLighting
                      in="noise"
                      surfaceScale="2"
                      specularConstant="0.8"
                      specularExponent="20"
                      lightingColor="#fff"
                      result="specular"
                    >
                      <fePointLight x="50" y="50" z="100" />
                    </feSpecularLighting>
                    <feComposite in="specular" in2="SourceGraphic" operator="in" result="litNoise" />
                    <feBlend in="SourceGraphic" in2="litNoise" mode="overlay" />
                  </filter>
                </svg>
              </div>
            </div>

            <div className={styles.modalAvatarCenter} aria-hidden="true">
              <img
                src={selected.image}
                alt=""
                loading="lazy"
                onError={(ev) => {
                  const img = ev.currentTarget
                  img.onerror = null
                  img.src = '/images/center/center.png'
                }}
              />
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalName}>{selected.name}</div>
              <div className={styles.modalHeadline}>{selected.headline}</div>
              <div className={styles.modalMain}>
                <div className={styles.modalSectionTitle}>简介</div>
                <div className={styles.modalText}>
                  {bioSections.length ? (
                    bioSections.map((section) => (
                      <div className={styles.modalBlock} key={section.title}>
                        <div className={styles.modalBlockTitle}>{section.title}</div>
                        <ul className={styles.modalList}>
                          {section.items.map((item, idx) => (
                            <li key={`${section.title}-${idx}`}>
                              <span className={styles.modalStrong}>{formatLead(item).lead}</span>
                              {formatLead(item).rest ? ` ${formatLead(item).rest}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>暂无补充简介。</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
