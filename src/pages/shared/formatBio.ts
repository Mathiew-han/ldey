export function formatBioParagraphs(raw: string) {
  const input = String(raw ?? '').replace(/\r/g, '').trim()
  if (!input) return []

  const lines = input
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/[ \t]+/g, ' '))

  const paragraphs: string[] = []
  let buf = ''

  const flush = () => {
    const t = buf.trim()
    if (t) paragraphs.push(t)
    buf = ''
  }

  const isHardBreak = (line: string) => {
    if (/^(\d+)[.、)]\s*/.test(line)) return true
    if (/^(研究方向|主要研究方向|学术兼职|社会兼职|工作经历|教育经历|科研成果|代表作|获奖|主持项目|承担项目|联系方式)\s*[：:]/.test(line)) return true
    if (line.length <= 32 && /[：:]$/.test(line)) return true
    return false
  }

  const endsSentence = (line: string) => /[。！？.!?]$/.test(line)

  for (const line0 of lines) {
    const line = line0.replace(/:/g, '：')
    if (!buf) {
      buf = line
      if (endsSentence(line) || isHardBreak(line)) flush()
      continue
    }

    if (isHardBreak(line)) {
      flush()
      buf = line
      if (endsSentence(line) || /[：]$/.test(line)) flush()
      continue
    }

    const joiner = /[，、：]$/.test(buf) ? '' : ' '
    buf = `${buf}${joiner}${line}`
    if (endsSentence(line)) flush()
  }

  flush()

  return paragraphs.map((p) => p.replace(/\s+/g, ' ').trim())
}

export type BioSection = { title: string; items: string[] }

export function parseBioSections(raw: string): BioSection[] {
  const input = String(raw ?? '').replace(/\r/g, '').trim()
  if (!input) return []

  const normalized = input.replace(/:/g, '：').replace(/[\u00A0\t]+/g, ' ')
  const clauses = normalized
    .split(/[。；;]\s*/)
    .map((s) => s.trim())
    .filter(Boolean)

  const buckets = new Map<string, string[]>()
  const push = (title: string, text: string) => {
    const list = buckets.get(title) ?? []
    list.push(text)
    buckets.set(title, list)
  }

  const isRole = (t: string) => /(现任|任|主任|院长|负责人|组长|委员|理事|主委|副主任|副会长|会长|秘书长|编委|副主编|主编|教授|研究员|博导|硕导)/.test(t)
  const isResearch = (t: string) => /(研究方向|主要研究方向|主要从事|擅长|研究工作)/.test(t)
  const isProject = (t: string) => /(主持|承担|项目|课题|基金)/.test(t)
  const isPublication = (t: string) => /(发表|论文|SCI|著作|主编|参编)/.test(t)
  const isAward = (t: string) => /(获奖|荣获|一等奖|二等奖|三等奖|优秀|称号|先进个人|优秀医师)/.test(t)
  const isTraining = (t: string) => /(学习|进修|培训|访问|交流)/.test(t)

  for (const clause of clauses) {
    if (isResearch(clause)) {
      push('研究方向', clause)
      continue
    }
    if (isRole(clause)) {
      push('任职与职责', clause)
      continue
    }
    if (isProject(clause)) {
      push('科研与项目', clause)
      continue
    }
    if (isPublication(clause)) {
      push('论文与著作', clause)
      continue
    }
    if (isAward(clause)) {
      push('获奖与荣誉', clause)
      continue
    }
    if (isTraining(clause)) {
      push('进修与经历', clause)
      continue
    }
    push('其他信息', clause)
  }

  const order = ['任职与职责', '研究方向', '科研与项目', '论文与著作', '获奖与荣誉', '进修与经历', '其他信息']
  return order
    .map((title) => ({ title, items: buckets.get(title) ?? [] }))
    .filter((s) => s.items.length > 0)
}
