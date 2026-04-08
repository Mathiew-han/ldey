# New_ldey（React 重构版）前端整体架构

## 目标与边界

**目标**
- 将现有 `ldey/` 的多页面静态站点重构为 React 前端（SPA），保留页面信息架构与核心内容表达。
- 在不牺牲性能的前提下，统一视觉语言与交互规范，降低后续迭代与内容维护成本。
- 后台管理能力与 Flask API 对接：复用现有 `ldey/backend` 提供的 `/api/*` 接口体系（Session Cookie 鉴权）。

**边界与约束**
- 不修改 `d:\甘肃省医学影像数据库\ldey\images\` 目录及其子目录中的任何素材（保持原样）。
- 重构输出路径固定为：`d:\甘肃省医学影像数据库\New_ldey\`。
- 本阶段仅重写前端；后端 Flask/MySQL 仅做必要的接入适配（如代理、CORS、部署路径）。

**静态素材（images）**
- 你已将 `images/` 迁移到 `New_ldey/` 中，建议作为 Vite 的公共静态资源放置在 `New_ldey/public/images/`。
- 组件中统一用绝对路径引用：`/images/...`（例如 `/images/experts/1.png`、`/images/center/center.mp4`）。
- 该目录视为“素材库”，仅做引用与组织，不在代码重构过程中对素材做编辑处理。

## 信息架构（IA）与路由规划

**前台（公众站点）**
- `/`：首页（原 index）
- `/experts`：专家组成员（原 experts）
- `/staff`：主要工作人员（原 staff）
- `/center`：数据中心（原 center）
- `/database`：数据库建设（原 database）
- `/achievements`：项目成果（原 achievements）

**后台（管理端）**
- `/admin/login`：管理员登录
- `/admin`：管理端壳（仪表盘/专家/工作人员/轮播/新闻/系统设置）
- `/admin/*`：子路由（按模块拆分，支持直达与刷新保持）

**导航与可用性原则**
- 顶部主导航固定 6 个一级入口，移动端折叠菜单。
- 统一页脚信息（简介/快捷链接/联系方式/备案）。
- 全站 i18n：默认中文简体，提供繁体与英文；页面文本通过字典驱动。

## 视觉系统（极简一致性）

**设计基调**
- 用“留白 + 中性色 + 单一强调色”的方式降低视觉噪音；以层级（字号/间距/对比度）替代过度装饰。

**设计令牌（Design Tokens）建议**
- 颜色：
  - `--bg`（页面底色）、`--surface`（卡片底色）、`--text`/`--muted`（文本）、`--primary`（科技蓝强调）、`--border`（分割线）
- 排版：
  - 字体栈：`Noto Sans SC` 优先；英文字体可保留现有 `Playfair Display` 仅用于标题点缀
  - 标题层级：H1/H2/H3 固定比例，避免多处自定义
- 间距：
  - 8px 网格：`4/8/12/16/24/32/48/64`
- 圆角/阴影：
  - 圆角：`12/16`
  - 阴影：最多两档（浅/中），避免“厚重浮雕感”

## 页面重写策略（按“数据-布局-交互”拆分）

### 首页（/）
- 模块：Hero/轮播、最新动态、科研平台 Tab、团队荣誉与时间线、AI 助手浮窗、页脚。
- 数据：
  - 首先以本地 JSON（从 `ldey/json/index.json` 迁移/抽取）驱动文案。
  - 新闻/轮播可先静态落地，后续再对接 `/api/news`、`/api/carousel`（与后台联动）。

### 专家（/experts）
- 模块：筛选、搜索、卡片网格、详情抽屉/弹窗。
- 数据：先本地 JSON（迁移 `experts-data.json`），预留未来改为 API。

### 工作人员（/staff）
- 模块：筛选、搜索、卡片网格、详情抽屉/弹窗、加入我们表单。
- 数据：先本地 JSON（迁移 `staff-data.json`）。
- 表单：前端校验 + 提交接口占位（后续落到后端存储/邮件通知）。

### 数据中心（/center）
- 模块：横幅与规模指标、视频模块、依托单位、合作与成果。
- 数据：文案字典 + 指标数据对象化（便于调整与多语言）。

### 数据库建设（/database）
- 模块：平台介绍、轮播、专病库手风琴。
- 数据：病种条目以结构化数据驱动（标题/病例数/来源/特点/联系人/联系方式）。

### 项目成果（/achievements）
- 模块：指标摘要、项目列表与进度条、交流与获奖时间线、AI 助手。
- 数据：从 HTML 现有内容提炼为数据结构（便于维护与复用）。

### 后台（/admin）
- 模块：登录页、主壳（侧边栏/顶部栏/内容区）、各表格 CRUD、上传、系统接口面板。
- 鉴权：
  - 登录：`POST /api/admin/login`
  - 状态检查：`GET /api/admin/check`
  - 退出：`POST /api/admin/logout`
  - 所有管理请求需携带 Cookie：`credentials: 'include'`

## 数据层与 API 约定

**请求封装**
- `src/shared/api/client.ts`：统一 `fetch` 封装（baseUrl、credentials、错误映射、超时、JSON 解析）。

**资源模块（示例）**
- `expertsApi`：`GET/POST/PUT/DELETE /api/experts`
- `staffApi`：`GET/POST/PUT/DELETE /api/staff`
- `carouselApi`：`GET/POST/PUT/DELETE /api/carousel`
- `newsApi`：`GET/POST/PUT/DELETE /api/news`
- `uploadApi`：`POST /api/upload`（multipart）

**本地数据（前台优先）**
- 前台页面优先使用本地 `src/shared/content/*.json`，保证“无后端也可浏览”。
- 后续切换到 API 时，通过同一套 `useQuery`/`useResource` 风格 hooks 替换数据来源，不改 UI 组件。

## i18n 方案（统一字典）

**目录建议**
- `src/shared/i18n/locales/zh-CN.json`
- `src/shared/i18n/locales/zh-TW.json`
- `src/shared/i18n/locales/en.json`

**约定**
- 以 key 驱动所有 UI 文本（包含按钮、表单 placeholder、标题与段落）。
- 内容型长文（如病种介绍）也使用字典 key 引用，避免散落在组件里。

## 代码结构（建议目录树）

```
New_ldey/
  README.md
  package.json
  vite.config.*
  public/
    images/            # 从旧站迁移的素材（通过 /images/... 引用）
    assets/            # 仅放可复制/可替换的静态资源
  src/
    app/
      App.tsx
      router.tsx
      providers/       # i18n、auth、query、theme
      layout/
        SiteLayout.tsx
        AdminLayout.tsx
    pages/
      home/
      experts/
      staff/
      center/
      database/
      achievements/
      admin/
    features/
      language-switch/
      ai-assistant/
      people-cards/
      modal-drawer/
      carousel/
      timeline/
      admin-crud/
    shared/
      ui/              # Button/Card/Input/Modal 等基础组件
      styles/          # tokens.css, global.css
      api/
      i18n/
      utils/
      content/         # 前台静态数据（json）
```

## 状态管理与性能策略

**状态划分**
- 路由状态：React Router。
- 轻量 UI 状态：组件内 state（筛选、搜索、弹窗开关）。
- 全局状态：仅保留语言、主题（如需要）、管理员登录态。

**性能**
- 路由级懒加载：前台/后台分包；后台模块按需加载。
- 列表渲染：专家/工作人员卡片网格支持分页或虚拟滚动（数据量增大时再启用）。
- 图片：统一 `loading="lazy"`，并控制卡片封面比例。

## 部署与联调（推荐路径）

**本地联调**
- React 开发服务器代理 `/api` 到 Flask（避免 CORS 与 Cookie 丢失）。
- 管理端所有请求显式 `credentials: 'include'`。

**生产部署**
- 方案 A：React build 输出静态文件，由 Flask 提供静态托管（同源最稳，Cookie 也最简单）。
- 方案 B：前端静态站点独立部署（Nginx），后端单独部署；需配置 CORS + SameSite/secure 策略。

## 迁移计划（实施顺序）

1. 建立 React 工程骨架与路由（前台 + 后台）。
2. 抽出统一 Layout 与 UI 基础组件（极简卡片/按钮/表单/弹窗）。
3. 先完成前台 6 个页面的静态内容与交互复刻（数据来自本地 JSON）。
4. 重写后台管理端：登录、仪表盘、CRUD、上传、系统设置（直连 Flask API）。
5. 将首页轮播/新闻切换为后台可配置（对接 `/api/carousel`、`/api/news`）。
