import { Outlet } from 'react-router-dom'
import { SiteNav } from './SiteNav'
import styles from './site.module.css'

export function SiteLayout() {
  return (
    <div className={styles.shell}>
      <SiteNav />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerTitle}>甘肃省医学影像科学数据中心</div>
              <div className={styles.footerText}>
                致力于构建统一的医学影像数据平台，推动标准化、共享化与临床科研协同。
              </div>
            </div>
            <div>
              <div className={styles.footerTitle}>快速链接</div>
              <div className={styles.footerLinks}>
                <a href="/">首页</a>
                <a href="/experts">专家组成员</a>
                <a href="/staff">主要工作人员</a>
                <a href="/center">数据中心</a>
                <a href="/database">数据库建设</a>
                <a href="/achievements">项目成果</a>
              </div>
            </div>
            <div>
              <div className={styles.footerTitle}>联系我们</div>
              <div className={styles.footerText}>甘肃省兰州市城关区天水南路222号</div>
              <div className={styles.footerText}>contact@gansu-medical-imaging.cn</div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 甘肃省医学影像科学数据中心</span>
            <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" target="_blank" rel="noreferrer">
              陇ICP备2025023677号
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

