import { useMemo, useState } from 'react'
import styles from './contact.module.css'

type FormState = {
  name: string
  org: string
  title: string
  phone: string
  email: string
  message: string
}

const empty: FormState = { name: '', org: '', title: '', phone: '', email: '', message: '' }

export function ContactPage() {
  const [form, setForm] = useState<FormState>(empty)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false
    if (!form.org.trim()) return false
    if (!form.phone.trim() && !form.email.trim()) return false
    return true
  }, [form.email, form.name, form.org, form.phone])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitted(true)
    setForm(empty)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.h1}>联系我们</h1>
          <p className={styles.lead}>填写资料后，我们会根据合作方向尽快与你联系（可仅留手机号或邮箱）。</p>
        </header>

        <div className={styles.card}>
          {submitted ? <div className={styles.hint}>已提交，我们会尽快与你联系。</div> : null}
          <form onSubmit={onSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>姓名</div>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="请输入姓名"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.label}>单位</div>
                <input
                  className={styles.input}
                  value={form.org}
                  onChange={(e) => setForm((s) => ({ ...s, org: e.target.value }))}
                  placeholder="医院 / 高校 / 企业 / 机构"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.label}>职务/角色</div>
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="例如：放射科主任 / 研究员 / 工程师"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.label}>手机号</div>
                <input
                  className={styles.input}
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="可选（手机号或邮箱至少填一个）"
                />
              </div>
              <div className={`${styles.field} ${styles.rowFull}`}>
                <div className={styles.label}>邮箱</div>
                <input
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="可选（手机号或邮箱至少填一个）"
                />
              </div>
              <div className={`${styles.field} ${styles.rowFull}`}>
                <div className={styles.label}>合作意向/需求</div>
                <textarea
                  className={styles.textarea}
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                  placeholder="例如：数据共享合作、标注协作、模型训练评估、多中心研究等"
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btn}
                type="button"
                onClick={() => {
                  setForm(empty)
                  setSubmitted(false)
                }}
              >
                清空
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" disabled={!canSubmit}>
                提交
              </button>
            </div>

            <div className={styles.hint}>提示：此页面为前端演示表单，如需接入后台保存/邮件通知，可继续扩展。</div>
          </form>
        </div>
      </div>
    </div>
  )
}

