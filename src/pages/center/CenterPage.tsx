import { useEffect, useMemo, useState } from 'react'
import styles from '../shared/page.module.css'
import centerStyles from './center.module.css'

import centerDoc from '../../shared/content/数据中心简介.doc.json'

type Block = { type: 'p'; text: string } | { type: 'table'; rows: string[][] }

function getParagraphs(blocks: Block[]) {
  return blocks.filter((b) => b.type === 'p').map((b) => (b as { type: 'p'; text: string }).text)
}

function pickMetrics(text: string) {
  const m: { label: string; value: string }[] = []
  const beds = text.match(/开放床位(\d+)张/)
  if (beds) m.push({ label: '床位', value: `${beds[1]}张` })
  const outpatient = text.match(/年门急诊量([^，。]+?人次)/)
  if (outpatient) m.push({ label: '年门急诊量', value: outpatient[1] })
  const inpatient = text.match(/住院人数([^，。]+?)(?:,|，|。)/)
  if (inpatient) m.push({ label: '住院人数', value: inpatient[1].trim() })
  const racks = text.match(/机柜(\d+)套/)
  if (racks) m.push({ label: '机柜', value: `${racks[1]}套` })
  const servers = text.match(/现有服务器(\d+)台/)
  if (servers) m.push({ label: '服务器', value: `${servers[1]}台` })
  const storage = text.match(/存储量已经达到([^，。]+?)(?:，|,|。)/)
  if (storage) m.push({ label: '存储', value: storage[1] })
  const daily = text.match(/每天([^，。]+?)的数据/)
  if (daily) m.push({ label: '日增量', value: daily[1] })
  return m.slice(0, 6)
}

export function CenterPage() {
  const blocks = (centerDoc as { blocks: Block[] }).blocks
  const paragraphs = getParagraphs(blocks)
  const infra = paragraphs[1] ?? ''
  const platform = paragraphs[2] ?? ''
  const team = paragraphs[3] ?? ''

  const metrics = pickMetrics(infra)
  const chips = (list: string[]) => list.filter((s) => s && s.length <= 18)

  const emphasize = (text: string) => {
    const parts = text.split(/(\d+(?:\.\d+)?\+?)(张|人次|套|台|T|项|例|位|家|篇|年)?/g)
    return parts.map((p, idx) => {
      if (idx % 3 === 1) {
        const unit = parts[idx + 1] ?? ''
        return (
          <span key={`${idx}-${p}`} className={centerStyles.keyStrong}>
            {p}
            {unit}
          </span>
        )
      }
      if (idx % 3 === 2) return null
      return <span key={`${idx}-${p}`}>{p}</span>
    })
  }

  const baseChips = chips(['多中心共建', '数据治理', '标准化数据集', '算力支撑', '智能质控'])
  const basePoints = [
    '构建多中心联合共建、资源共享的医学影像科学数据库',
    '数据治理：清洗、去重、脱敏、质检，转化为可用科学数据',
    '提供标准化数据集与算力资源，支撑多中心联合研究与成果转化',
    '通过科研产出与智能质控，提升诊疗效率、区域服务与人才培养',
  ]

  const infraChips = chips(['依托兰大二院', '七年百强', 'HIC300', '模块化机房', '高速增长'])
  const infraPoints = [
    '开放床位3500张，年门急诊量200多万人次，住院人数11.86万人次',
    '连续七年进入顶级医院百强，连续两年入选智慧医院 HIC300 强',
    '模块化数据中心机房：机柜43套，服务器136台（可扩展约200台）',
    '存储量700多T，数据以每天1T持续增长',
  ]
  const infraPointsCompact = [infraPoints[0], infraPoints[2], infraPoints[3]]

  const platformChips = chips(['互认标准', 'PACS/DICOM', '四级覆盖', '10+专病', '8000+病例'])
  const platformPoints = [
    '制定影像检查互认标准：覆盖 DR/CT/MRI 共90个项目',
    '线上线下培训指导，保障影像数据同质化与可互认',
    '全省统一互认平台：对接医院 PACS 与影像设备（DICOM），云端上传调阅共享',
    '覆盖省-市-县-乡四级医疗机构，服务省内大多数县级以上医院影像中心',
    '构建10余种常见疾病 8000余例影像数据库，推进AI技术与重点基地建设',
  ]

  const teamChips = chips(['多学科', '多中心', '核心团队', '高水平论文', '科研项目'])
  const teamPoints = [
    '20位学科带头人，省内外12家单位共建合作伙伴，覆盖多中心协作网络',
    '主要工作人员26人：博士11人，高级职称24人；信息中心支撑人员32人',
    '研究生导师9人（博导4人），在读博硕士生50余人，近年培养优秀研究生15人',
    '发表高水平论文400多篇，其中 SCI 100多篇；国际大会录用20多篇',
    '获批科研项目32项（国家级11项），省科技进步一等奖2项、二等奖1项',
  ]

  const renderLearnMoreButton = (label: string, onClick: () => void) => (
    <button className={centerStyles.learnMore} type="button" onClick={onClick}>
      <span className={centerStyles.circle} aria-hidden="true">
        <span className={`${centerStyles.icon} ${centerStyles.arrow}`} />
      </span>
      <span className={centerStyles.buttonText}>{label}</span>
    </button>
  )

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>数据中心</h1>
          <p className={styles.lead}>基于科学数据治理与多中心联合共建，提供标准化数据集、共享服务与科研算力支撑。</p>
        </header>

        <section className={centerStyles.section}>
          <div className={centerStyles.heroMedia}>
            <img className={centerStyles.heroImage} src="/images/center/2.png" alt="数据中心" loading="lazy" />
          </div>
        </section>

        <section className={centerStyles.section}>
          <div className={centerStyles.bento}>
            <div className={`${centerStyles.card} ${centerStyles.bentoA}`}>
              <div className={centerStyles.title}>中心概述</div>
              <div className={centerStyles.tagRow} aria-label="key">
                {baseChips.map((t) => (
                  <span key={t} className={centerStyles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <ul className={centerStyles.keyList}>
                {basePoints.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {metrics.length ? (
                <div className={centerStyles.kpiRow}>
                  {metrics.map((k) => (
                    <div key={k.label} className={centerStyles.kpi}>
                      <div className={centerStyles.kpiValue}>{k.value}</div>
                      <div className={centerStyles.kpiLabel}>{k.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className={centerStyles.bentoB}>
              <div className={centerStyles.videoBlock}>
                <div className={centerStyles.title}>介绍视频</div>
                <video className={centerStyles.videoBare} controls preload="none" poster="/images/center/center.png">
                  <source src="/images/center/center.mp4" type="video/mp4" />
                </video>
              </div>
              <div className={`${centerStyles.card} ${centerStyles.joinCard}`}>
                <div className={centerStyles.title}>加入我们</div>
                <div className={centerStyles.text}>欢迎参与多中心共建、数据共享与科研协作，一起推进医学影像数据治理与 AI 研究转化。</div>
                <div className={centerStyles.moreRow}>
                  <a className={centerStyles.joinLink} href="/experts">
                    查看团队
                  </a>
                <a className={centerStyles.joinLink} href="/contact">
                  联系我们
                  </a>
                </div>
              </div>
            </div>

            <div className={`${centerStyles.infraCard} ${centerStyles.bentoC}`}>
              <div className={centerStyles.title}>依托单位与基础设施</div>
              <div className={centerStyles.infraTagRow} aria-label="key">
                {infraChips.map((t) => (
                  <span key={t} className={centerStyles.infraTag}>
                    {t}
                  </span>
                ))}
              </div>
              <ul className={centerStyles.infraKeyList}>
                {infraPointsCompact.map((t) => (
                  <li key={t}>{emphasize(t)}</li>
                ))}
              </ul>
              <div className={centerStyles.infraMoreRow}>
                {renderLearnMoreButton('了解更多', () => setMore({ title: '依托单位与基础设施', text: infra }))}
              </div>
            </div>
            <div className={`${centerStyles.card} ${centerStyles.bentoD}`}>
              <div className={centerStyles.title}>互认平台与共建合作</div>
              <div className={centerStyles.tagRow} aria-label="key">
                {platformChips.map((t) => (
                  <span key={t} className={centerStyles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={centerStyles.subhead}>平台流程</div>
              <div className={centerStyles.flow} aria-label="flow">
                <div className={centerStyles.flowItem}>
                  <div className={centerStyles.flowTitle}>标准</div>
                  <div className={centerStyles.flowText}>互认项目</div>
                </div>
                <div className={centerStyles.flowItem}>
                  <div className={centerStyles.flowTitle}>同质化</div>
                  <div className={centerStyles.flowText}>培训指导</div>
                </div>
                <div className={centerStyles.flowItem}>
                  <div className={centerStyles.flowTitle}>平台</div>
                  <div className={centerStyles.flowText}>PACS/DICOM</div>
                </div>
                <div className={centerStyles.flowItem}>
                  <div className={centerStyles.flowTitle}>数据库</div>
                  <div className={centerStyles.flowText}>专病资源</div>
                </div>
                <div className={centerStyles.flowItem}>
                  <div className={centerStyles.flowTitle}>AI</div>
                  <div className={centerStyles.flowText}>应用推广</div>
                </div>
              </div>
              <ul className={centerStyles.keyList}>
                {platformPoints.map((t) => (
                  <li key={t}>{emphasize(t)}</li>
                ))}
              </ul>
              <div className={centerStyles.moreRow}>
                {renderLearnMoreButton('了解更多', () => setMore({ title: '互认平台与共建合作', text: platform }))}
              </div>
            </div>

            <div className={`${centerStyles.card} ${centerStyles.bentoE}`}>
              <div className={centerStyles.title}>人才队伍与科研产出</div>
              <div className={centerStyles.tagRow} aria-label="key">
                {teamChips.map((t) => (
                  <span key={t} className={centerStyles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <ul className={centerStyles.keyList}>
                {teamPoints.map((t) => (
                  <li key={t}>{emphasize(t)}</li>
                ))}
              </ul>
              <div className={centerStyles.moreRow}>
                {renderLearnMoreButton('了解更多', () => setMore({ title: '人才队伍与科研产出', text: team }))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {more ? (
        <div className={centerStyles.overlay} onMouseDown={() => setMore(null)} role="dialog" aria-modal="true">
          <div className={centerStyles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={centerStyles.modalHeader}>
              <div className={centerStyles.modalTitle}>{more.title}</div>
              <button className={centerStyles.modalClose} type="button" onClick={() => setMore(null)} aria-label="close">
                ×
              </button>
            </div>
            <div className={centerStyles.modalBody}>
              <div className={centerStyles.modalText}>
                {moreParas.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
