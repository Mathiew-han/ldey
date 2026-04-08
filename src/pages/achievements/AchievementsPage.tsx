import { useEffect, useState } from 'react'
import styles from '../shared/page.module.css'
import achieveStyles from './achievements.module.css'

import data from '../../shared/content/achievements.word.json'
import imagesData from '../../shared/content/achievements.images.json'

type Section = {
  key: string
  title: string
  lines: string[]
}

type ImgItem = {
  src: string
  heading: string
  caption?: string
  nearestText: string
  docx: string
  internalPath?: string
}

type ImgGroup = {
  key: string
  title: string
  items: ImgItem[]
}

function countNumbered(lines: string[]) {
  return lines.filter((l) => /^\d+\./.test(l)).length
}

export function AchievementsPage() {
  const sections = (data as { sections: Section[] }).sections
  const imageGroups = (imagesData as { groups: ImgGroup[] }).groups

  const imagesBySectionAndHeading = new Map<string, Map<string, ImgItem[]>>()
  for (const g of imageGroups) {
    const byHeading = new Map<string, ImgItem[]>()
    for (const it of g.items) {
      const key = (it.nearestText || '').trim() || (it.heading || '').trim()
      if (!key) continue
      const list = byHeading.get(key) ?? []
      list.push(it)
      byHeading.set(key, list)
    }
    imagesBySectionAndHeading.set(g.title, byHeading)
  }

  const projects = sections.find((s) => s.title === '获批项目')
  const publications = sections.find((s) => s.title === '发表文章')
  const domestic = sections.find((s) => s.title === '国内交流')
  const international = sections.find((s) => s.title === '国外交流')
  const students = sections.find((s) => s.title === '学生培养及获奖')

  const stats = [
    { label: '获批项目', value: projects ? String(countNumbered(projects.lines)) : '—' },
    { label: '发表文章', value: publications ? String(countNumbered(publications.lines)) : '—' },
    {
      label: '学术交流',
      value: String((domestic?.lines.length ?? 0) + (international?.lines.length ?? 0) ? '持续更新' : '—'),
    },
    { label: '学生培养', value: students ? '体系化' : '—' },
  ]

  const timeline = [
    { date: '2022–2023', text: '国际会议投稿与展示逐步常态化，科研与学术影响力提升。' },
    { date: '2024', text: '国内大会与省级年会多会场组织与发言交流，团队参与度显著增强。' },
    { date: '2025', text: 'ECR/RSNA 等高水平会议多篇入选，研究方向覆盖多病种与AI热点。' },
  ]

  const [more, setMore] = useState<{ title: string; content: React.ReactNode } | null>(null)

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

  const renderLearnMoreButton = (label: string, onClick: () => void) => (
    <button className={achieveStyles.learnMore} type="button" onClick={onClick}>
      <span className={achieveStyles.circle} aria-hidden="true">
        <span className={`${achieveStyles.icon} ${achieveStyles.arrow}`} />
      </span>
      <span className={achieveStyles.buttonText}>{label}</span>
    </button>
  )

  const renderListContent = (lines: string[], title: string) => {
    const byHeading = imagesBySectionAndHeading.get(title)
    return (
      <ul className={achieveStyles.list}>
        {lines.map((line, idx) => {
          const imgs = byHeading?.get(line.trim())
          return (
            <li key={idx} className={achieveStyles.listItem}>
              <div>{line}</div>
              {imgs && imgs.length ? (
                <div className={achieveStyles.galleryGrid}>
                  {imgs.map((img) => (
                    <div key={img.src} className={achieveStyles.galleryItem}>
                      <img className={achieveStyles.galleryImg} src={img.src} alt={img.heading} loading="lazy" />
                      <div className={achieveStyles.galleryCap}>{img.caption || img.heading}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    )
  }

  // Combine domestic and international for the modal/preview
  const exchangeContent = (
    <div style={{ display: 'grid', gap: 24 }}>
       {domestic && (
         <div>
            <div className={achieveStyles.title} style={{marginBottom: 12}}>国内交流</div>
            {renderListContent(domestic.lines, '国内交流')}
         </div>
       )}
       {international && (
         <div>
            <div className={achieveStyles.title} style={{marginBottom: 12}}>国外交流</div>
            {renderListContent(international.lines, '国外交流')}
         </div>
       )}
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>项目成果</h1>
          <p className={styles.lead}>基于已整理的获批项目、发表文章、学术交流、人才培养与获奖情况，集中展示中心建设与学术产出。</p>
        </header>

        <section className={achieveStyles.section}>
          <div className={achieveStyles.bento}>
            
            {/* Bento A: Projects Summary */}
            <div className={`${achieveStyles.card} ${achieveStyles.bentoA}`}>
              <div className={achieveStyles.title}>获批项目</div>
              <div className={achieveStyles.text}>
                 {projects?.lines.slice(0, 4).map((l, i) => (
                     <div key={i} style={{marginBottom: 6}}>{l.length > 50 ? l.slice(0, 50) + '...' : l}</div>
                 ))}
                 {projects && projects.lines.length > 4 && <div>...</div>}
              </div>
              <div className={achieveStyles.moreRow}>
                {renderLearnMoreButton('完整列表', () => setMore({ 
                    title: '获批项目', 
                    content: renderListContent(projects?.lines ?? [], '获批项目') 
                }))}
              </div>
            </div>

            {/* Bento B: Stats */}
            <div className={`${achieveStyles.bentoB}`}>
                <div className={achieveStyles.kpiRow}>
                    {stats.map(s => (
                        <div key={s.label} className={achieveStyles.kpi}>
                            <div className={achieveStyles.kpiValue}>{s.value}</div>
                            <div className={achieveStyles.kpiLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className={achieveStyles.card}>
                   <div className={achieveStyles.title}>学生培养</div>
                   <div className={achieveStyles.text} style={{fontSize: 12}}>
                       {students?.lines[0] ? students.lines[0].slice(0, 60) + '...' : '暂无数据'}
                   </div>
                   <div className={achieveStyles.moreRow}>
                        {renderLearnMoreButton('查看详情', () => setMore({ 
                            title: '学生培养及获奖', 
                            content: renderListContent(students?.lines ?? [], '学生培养及获奖') 
                        }))}
                   </div>
                </div>
            </div>

            {/* Bento C: Timeline */}
             <div className={`${achieveStyles.card} ${achieveStyles.bentoC}`}>
              <div className={achieveStyles.title}>里程碑</div>
              <div className={achieveStyles.timeline}>
                {timeline.map((t) => (
                  <div key={t.date} className={achieveStyles.timelineItem}>
                    <div className={achieveStyles.timelineDot} />
                    <div className={achieveStyles.timelineBody}>
                      <div className={achieveStyles.timelineDate}>{t.date}</div>
                      <div className={achieveStyles.timelineText}>{t.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento D: Publications Summary */}
            <div className={`${achieveStyles.card} ${achieveStyles.bentoD}`}>
              <div className={achieveStyles.title}>发表文章</div>
               <div className={achieveStyles.text}>
                 {publications?.lines.slice(0, 3).map((l, i) => (
                     <div key={i} style={{marginBottom: 6}}>{l.length > 60 ? l.slice(0, 60) + '...' : l}</div>
                 ))}
              </div>
              <div className={achieveStyles.moreRow}>
                {renderLearnMoreButton('文章列表', () => setMore({ 
                    title: '发表文章', 
                    content: renderListContent(publications?.lines ?? [], '发表文章') 
                }))}
              </div>
            </div>

            {/* Bento E: Academic Exchange Gallery Preview */}
            <div className={`${achieveStyles.card} ${achieveStyles.bentoE}`}>
              <div className={achieveStyles.title}>学术交流</div>
              <div className={achieveStyles.text} style={{marginBottom: 12}}>
                  积极参与国内外学术会议（RSNA, ECR, CCR 等），展示中心研究成果。
              </div>
              <div className={achieveStyles.galleryGrid} style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
                 {/* Show a few sample images if available */}
                 {[...(imagesBySectionAndHeading.get('国内交流')?.values() ?? []), ...(imagesBySectionAndHeading.get('国外交流')?.values() ?? [])]
                    .flat()
                    .slice(0, 4)
                    .map((img, i) => (
                     <div key={i} className={achieveStyles.galleryItem} style={{padding: 0, border: 'none', background: 'transparent'}}>
                        <img className={achieveStyles.galleryImg} src={img.src} alt={img.heading} style={{height: 100, borderRadius: 4}} />
                     </div>
                 ))}
              </div>
              <div className={achieveStyles.moreRow}>
                {renderLearnMoreButton('查看更多', () => setMore({ 
                    title: '学术交流', 
                    content: exchangeContent
                }))}
              </div>
            </div>

          </div>
        </section>
      </div>

      {more ? (
        <div className={achieveStyles.overlay} onMouseDown={() => setMore(null)} role="dialog" aria-modal="true">
          <div className={achieveStyles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={achieveStyles.modalHeader}>
              <div className={achieveStyles.modalTitle}>{more.title}</div>
              <button className={achieveStyles.modalClose} type="button" onClick={() => setMore(null)} aria-label="close">
                ×
              </button>
            </div>
            <div className={achieveStyles.modalBody}>
              {more.content}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
