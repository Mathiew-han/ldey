import { useEffect, useMemo, useState } from 'react'
import { useAppSettings } from '../../app/providers/useAppSettings'
import styles from './home.module.css'

const CONTENT = {
  'zh-CN': {
    nav: {
      hero: '首页',
      carousel: '概览',
      capability: '核心能力',
      pipeline: '数据流程',
      partners: '合作单位',
    },
    hero: {
      kicker: '甘肃省医学影像科学数据中心',
      title: '医学影像数据库',
      lead: '面向多中心联合共建与资源共享，推动医学影像数据标准化、共享化与科研临床协同。',
      tags: ['多中心共建', '数据治理', '标准化', '科研协同'],
      cta: {
        primary: '了解数据中心',
        secondary: '查看专家团队',
      },
      stats: [
        { value: '8000+', label: '病例数据库' },
        { value: '10+', label: '疾病种类' },
        { value: '32', label: '合作医院' },
      ],
      notice: {
        label: '最近更新',
        text: '项目成果与图片展示已整理更新',
      },
    },
    carousel: {
      title: '内容概览',
      lead: '聚焦数据治理、平台建设与科研产出三条主线。',
      items: [
        { title: '数据库建设', text: '多模态入库、标准映射、质控脱敏与版本化管理。' },
        { title: '数据中心', text: '工具链与协作机制，支撑多中心共建与合规流程。' },
        { title: '项目成果', text: '沉淀资源与研究产出，推动模型训练评估与临床转化。' },
      ]
    },
    capability: {
      title: '核心能力',
      lead: '以数据治理为底座，以科研平台为支撑，连接临床与研究。',
      cards: [
        { title: '多模态数据集成', text: '整合 CT、MRI、X 光、超声等影像数据，统一存储与管理。' },
        { title: 'AI 辅助诊断研究', text: '面向疾病筛查与诊断，支撑模型训练、评估与临床转化。' },
        { title: '协作与共享', text: '支持多中心共建与数据共享，促进资源下沉与协同创新。' },
      ],
      visual: {
        data: 'DATA',
        ai: 'AI MODEL',
        collab: 'COLLAB'
      }
    },
    pipeline: {
      title: '数据流程',
      lead: '从采集到共享的一体化流程，强调合规与可追溯。',
      steps: [
        { title: '采集', text: '多中心接入与结构化元数据登记。' },
        { title: '治理', text: '脱敏、质控、标准映射与版本管理。' },
        { title: '标注', text: '多学科协作标注与一致性校验。' },
        { title: '共享', text: '分级授权访问，支撑科研与临床协同。' },
      ],
      visual: {
        collect: 'COLLECT',
        govern: 'GOVERN',
        label: 'LABEL',
        share: 'SHARE',
        sub: ['接入', '脱敏', '一致性', '授权']
      }
    },
    partners: {
      title: '合作单位',
      lead: '多中心共建合作网络（灰度展示，可替换为真实 Logo）。',
      list: ['合作单位 01', '合作单位 02', '合作单位 03', '合作单位 04', '合作单位 05', '合作单位 06', '合作单位 07', '合作单位 08']
    }
  },
  'en': {
    nav: {
      hero: 'Home',
      carousel: 'Overview',
      capability: 'Capabilities',
      pipeline: 'Pipeline',
      partners: 'Partners',
    },
    hero: {
      kicker: 'Gansu Medical Imaging Science Data Center',
      title: 'Medical Imaging Database',
      lead: 'Promoting standardization, sharing, and clinical-research synergy in medical imaging through multi-center collaboration.',
      tags: ['Multi-center', 'Data Governance', 'Standardization', 'Research Synergy'],
      cta: {
        primary: 'Learn More',
        secondary: 'Expert Team',
      },
      stats: [
        { value: '8000+', label: 'Cases' },
        { value: '10+', label: 'Diseases' },
        { value: '32', label: 'Hospitals' },
      ],
      notice: {
        label: 'Latest Update',
        text: 'Project achievements and gallery updated.',
      },
    },
    carousel: {
      title: 'Overview',
      lead: 'Focusing on data governance, platform construction, and research output.',
      items: [
        { title: 'Database Construction', text: 'Multimodal ingestion, standard mapping, QC, de-identification, and versioning.' },
        { title: 'Data Center', text: 'Toolchains and collaboration mechanisms supporting multi-center compliance.' },
        { title: 'Achievements', text: 'Resources and research outputs driving model training and clinical translation.' },
      ]
    },
    capability: {
      title: 'Core Capabilities',
      lead: 'Connecting clinical practice and research with data governance and research platforms.',
      cards: [
        { title: 'Multimodal Integration', text: 'Unified storage and management of CT, MRI, X-ray, Ultrasound, etc.' },
        { title: 'AI Diagnosis Research', text: 'Supporting model training, evaluation, and translation for screening and diagnosis.' },
        { title: 'Collaboration & Sharing', text: 'Supporting multi-center sharing to promote resource accessibility and innovation.' },
      ],
      visual: {
        data: 'DATA',
        ai: 'AI MODEL',
        collab: 'COLLAB'
      }
    },
    pipeline: {
      title: 'Data Pipeline',
      lead: 'Integrated process from collection to sharing, emphasizing compliance and traceability.',
      steps: [
        { title: 'Collect', text: 'Multi-center access and structured metadata registration.' },
        { title: 'Govern', text: 'De-identification, QC, mapping, and version management.' },
        { title: 'Label', text: 'Multi-disciplinary collaborative annotation and consistency check.' },
        { title: 'Share', text: 'Tiered authorized access supporting research and clinical synergy.' },
      ],
      visual: {
        collect: 'COLLECT',
        govern: 'GOVERN',
        label: 'LABEL',
        share: 'SHARE',
        sub: ['Access', 'De-id', 'Consist', 'Auth']
      }
    },
    partners: {
      title: 'Partners',
      lead: 'Multi-center collaboration network (Placeholder for logos).',
      list: ['Partner 01', 'Partner 02', 'Partner 03', 'Partner 04', 'Partner 05', 'Partner 06', 'Partner 07', 'Partner 08']
    }
  }
}

export function HomePage() {
  const { lang } = useAppSettings()
  const t = CONTENT[lang]
  const partners = t.partners.list
  const [activeSection, setActiveSection] = useState('hero')

  const rail = useMemo(
    () => [
      { id: 'hero', label: t.nav.hero },
      { id: 'carousel', label: t.nav.carousel },
      { id: 'capability', label: t.nav.capability },
      { id: 'pipeline', label: t.nav.pipeline },
      { id: 'partners', label: t.nav.partners },
    ],
    [t],
  )

  useEffect(() => {
    const sections = rail
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (best?.target?.id) setActiveSection(best.target.id)
      },
      { root: null, rootMargin: '-25% 0px -55% 0px', threshold: [0.01, 0.2, 0.4, 0.6] },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rail])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.page}>
      <nav className={styles.rail} aria-label="page">
        <div className={styles.railLine} aria-hidden="true" />
        {rail.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeSection ? styles.railItemActive : styles.railItem}
            onClick={() => scrollToSection(item.id)}
          >
            <span className={styles.railMark} aria-hidden="true" />
            <span className={styles.railLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <section className={styles.hero} id="hero">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCard}>
            <div className={styles.kicker}>{t.hero.kicker}</div>
            <h1 className={styles.title}>{t.hero.title}</h1>
            <p className={styles.lead}>
              {t.hero.lead}
            </p>

            <div className={styles.tagsRow} aria-label="keywords">
              {t.hero.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <a className={styles.ctaPrimary} href="/center">
                {t.hero.cta.primary}
              </a>
              <a className={styles.ctaGhost} href="/experts">
                {t.hero.cta.secondary}
              </a>
            </div>
            <div className={styles.stats}>
              {t.hero.stats.map((stat, i) => (
                <div key={i} className={styles.stat}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.notice} aria-label="latest update">
              <span className={styles.noticeLabel}>{t.hero.notice.label}</span>
              <a className={styles.noticeLink} href="/achievements">
                {t.hero.notice.text}
              </a>
              <span className={styles.noticeMeta}>2026-02</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.carousel} id="carousel" aria-label="overview">
        <div className={styles.container}>
          <div className={styles.carouselHead}>
            <div className={styles.carouselTitle}>{t.carousel.title}</div>
            <div className={styles.carouselLead}>{t.carousel.lead}</div>
          </div>
          <div className={styles.carouselGrid}>
            <a className={styles.carouselItem} href="/database">
              <div className={styles.carouselItemTitle}>{t.carousel.items[0].title}</div>
              <div className={styles.carouselItemText}>{t.carousel.items[0].text}</div>
            </a>
            <a className={styles.carouselItem} href="/center">
              <div className={styles.carouselItemTitle}>{t.carousel.items[1].title}</div>
              <div className={styles.carouselItemText}>{t.carousel.items[1].text}</div>
            </a>
            <a className={styles.carouselItem} href="/achievements">
              <div className={styles.carouselItemTitle}>{t.carousel.items[2].title}</div>
              <div className={styles.carouselItemText}>{t.carousel.items[2].text}</div>
            </a>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionFull} ${styles.sectionScience}`} id="capability">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>{t.capability.title}</h2>
            <p className={styles.p}>{t.capability.lead}</p>
          </div>
          <div className={styles.capLayout}>
            <div className={styles.capText}>
              <div className={styles.grid3}>
                {t.capability.cards.map((card, i) => (
                  <div key={i} className={styles.card}>
                    <div className={styles.cardTitle}>{card.title}</div>
                    <div className={styles.cardText}>{card.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.capVisual} aria-label="visual">
              <svg className={styles.visualSvg} viewBox="0 0 600 420" role="img" aria-label="能力可视化">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="560" height="380" rx="24" fill="currentColor" fillOpacity="0.03" />
                <g stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" strokeWidth="1">
                  <line x1="120" y1="60" x2="120" y2="360" />
                  <line x1="300" y1="60" x2="300" y2="360" />
                  <line x1="480" y1="60" x2="480" y2="360" />
                </g>
                <path d="M 120 300 C 180 300, 220 120, 300 120 C 380 120, 420 240, 480 240" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 120 300 C 180 300, 220 120, 300 120 C 380 120, 420 240, 480 240 V 360 H 120 Z" fill="url(#curveGradient)" stroke="none" />
                <g fill="currentColor">
                  <circle cx="120" cy="300" r="12" fillOpacity="0.1" />
                  <circle cx="120" cy="300" r="5" />
                  <circle cx="300" cy="120" r="16" fillOpacity="0.15" />
                  <circle cx="300" cy="120" r="6" />
                  <circle cx="480" cy="240" r="12" fillOpacity="0.1" />
                  <circle cx="480" cy="240" r="5" />
                </g>
                <g fill="currentColor" fontSize="14" fontWeight="600" textAnchor="middle" style={{ letterSpacing: '0.05em' }}>
                  <text x="120" y="340" fillOpacity="0.7">{t.capability.visual.data}</text>
                  <text x="300" y="90" fillOpacity="1">{t.capability.visual.ai}</text>
                  <text x="480" y="280" fillOpacity="0.7">{t.capability.visual.collab}</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionFull} ${styles.sectionSurface} ${styles.roundTop}`} id="pipeline">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>{t.pipeline.title}</h2>
            <p className={styles.p}>{t.pipeline.lead}</p>
          </div>
          <div className={styles.pipelineLayout}>
            <div className={styles.pipeline} aria-label="pipeline">
              {t.pipeline.steps.map((step, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepText}>{step.text}</div>
                </div>
              ))}
            </div>
            <div className={styles.pipelineVisual} aria-label="visual">
              <svg className={styles.visualSvg} viewBox="0 0 640 420" role="img" aria-label="流程可视化">
                <rect x="20" y="20" width="600" height="380" rx="24" fill="currentColor" fillOpacity="0.03" />
                <line x1="110" y1="210" x2="530" y2="210" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" strokeLinecap="round" />
                <g>
                  <g transform="translate(110, 210)">
                    <circle r="24" fill="currentColor" fillOpacity="0.05" />
                    <circle r="8" fill="currentColor" stroke="var(--bg)" strokeWidth="3" />
                  </g>
                  <g transform="translate(250, 210)">
                    <circle r="24" fill="currentColor" fillOpacity="0.05" />
                    <circle r="8" fill="currentColor" stroke="var(--bg)" strokeWidth="3" />
                  </g>
                  <g transform="translate(390, 210)">
                    <circle r="24" fill="currentColor" fillOpacity="0.05" />
                    <circle r="8" fill="currentColor" stroke="var(--bg)" strokeWidth="3" />
                  </g>
                  <g transform="translate(530, 210)">
                    <circle r="24" fill="currentColor" fillOpacity="0.05" />
                    <circle r="8" fill="currentColor" stroke="var(--bg)" strokeWidth="3" />
                  </g>
                </g>
                <g fill="currentColor" textAnchor="middle" style={{ fontFamily: 'sans-serif' }}>
                  <g fontSize="13" fontWeight="700" style={{ letterSpacing: '0.08em' }}>
                    <text x="110" y="255">{t.pipeline.visual.collect}</text>
                    <text x="250" y="255">{t.pipeline.visual.govern}</text>
                    <text x="390" y="255">{t.pipeline.visual.label}</text>
                    <text x="530" y="255">{t.pipeline.visual.share}</text>
                  </g>
                  <g fontSize="11" fontWeight="400" fillOpacity="0.5">
                    <text x="110" y="175">{t.pipeline.visual.sub[0]}</text>
                    <text x="250" y="175">{t.pipeline.visual.sub[1]}</text>
                    <text x="390" y="175">{t.pipeline.visual.sub[2]}</text>
                    <text x="530" y="175">{t.pipeline.visual.sub[3]}</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="partners">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>{t.partners.title}</h2>
            <p className={styles.p}>{t.partners.lead}</p>
          </div>
          <div className={styles.logoWall} aria-label="partners">
            {partners.map((name) => (
              <div key={name} className={styles.logoMark}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
