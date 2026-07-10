# AI Skill 聚合展示平台 — 产品需求文档（PRD）

> 版本：v1.0 | 日期：2025-07-10 | 作者：产品需求协同助手
> 
> 关联文档：[需求规划文档](./AI-Skill聚合平台-需求规划.md)

---

## 一、文档修订记录

| 版本 | 日期 | 修订内容 | 修订人 |
|------|------|---------|--------|
| v1.0 | 2025-07-10 | 初版，MVP 范围 | AI 助手 |

---

## 二、产品背景与目标

### 2.1 背景

AI Agent Skill 生态正处于爆发期。Anthropic、OpenAI、Cursor 等主流平台已将 Skill 标准化（SKILL.md 格式），GitHub 上涌现出超过 200 万个公开 Skill。然而现有聚合平台（SkillsMP、skills.sh 等）均为英文主导，中文用户在发现、理解和复用 Skill 时存在明显语言障碍和信息分散问题。

### 2.2 产品目标

| 维度 | 目标 | 衡量标准 |
|------|------|---------|
| 内容覆盖 | 聚合全球主流渠道的 AI Skill | 上线时收录 ≥ 500 个，3 个月 ≥ 10,000 |
| 语言体验 | 消除中文用户的阅读障碍 | 100% Skill 提供中文简介 |
| 发现效率 | 让用户快速找到需要的 Skill | 支持分类筛选 + 最新/热度双维度排序 |
| 开发效率 | 单人可维护 | 全栈一体架构，自动化采集，零运维负担 |

### 2.3 团队约束

- 团队规模：1 人（负责前端/设计）
- AI 助手负责：后端开发、数据采集、部署运维
- 技术要求：极致轻量，最小化运维成本

---

## 三、用户故事

| 编号 | 角色 | 需求 | 目的 | 优先级 |
|------|------|------|------|--------|
| US-01 | 浏览用户 | 在首页看到 Skill 卡片列表，快速了解有什么 Skill 可用 | 发现感兴趣的 Skill | P0 |
| US-02 | 浏览用户 | 按「最新」和「最热」切换排序 | 不同场景下有不同的发现需求 | P0 |
| US-03 | 浏览用户 | 按分类筛选 Skill | 聚焦特定领域 | P0 |
| US-04 | 浏览用户 | 看到 Skill 的中文简介，名称保留原文 | 跨越语言障碍理解 Skill 用途 | P0 |
| US-05 | 浏览用户 | 点击卡片查看 Skill 详情 | 深入了解后决定是否使用 | P0 |
| US-06 | 浏览用户 | 通过详情页链接跳转到 Skill 原始来源 | 获取和安装 Skill | P0 |
| US-07 | 贡献用户 | 上传自己发现或创建的 Skill | 补充平台未覆盖的内容 | P1 |
| US-08 | 管理员 | 审核用户上传的 Skill | 确保内容质量 | P1 |

---

## 四、功能需求（EARS 原则）

### F1. Skill 首页展示

#### F1.1 卡片列表

> **[Ubiquitous]** 系统应以卡片网格布局展示 Skill 列表，每行 3 张卡片（桌面端），平板 2 张，手机 1 张。

> **[Ubiquitous]** 每张 Skill 卡片应展示以下信息：
> - Skill 名称（保留原始语言，英文显示英文，中文显示中文）
> - 中文简介（最多 120 字，超出截断并显示"…"）
> - 分类标签（最多显示 3 个，超出显示"+N"）
> - 来源渠道图标（GitHub / 技能市场 / 社区 / 其他）
> - 星标数（若来源支持）
> - 采集/发布时间（相对时间格式，如"3 小时前""2 天前"）

> **[State-driven]** 当 Skill 入库时间在 24 小时以内时，卡片左上角应显示 "NEW" 标记。

> **[Event-driven]** 当用户切换排序方式时，系统应重新请求数据并刷新卡片列表，同时保留当前分类筛选条件。

> **[Unwanted]** 若数据请求失败（网络超时/服务端错误），系统应显示"加载失败，请稍后重试"提示，并提供手动重试按钮。

> **[Unwanted]** 若当前筛选条件下无 Skill，系统应显示空状态：插图 + "暂无相关内容" + "清除筛选"按钮。

#### F1.2 排序切换

> **[Ubiquitous]** 系统应提供两个排序选项：「最新」和「最热」，以标签切换形式展示在卡片列表上方。

> **[State-driven]** 当用户选择「最新」排序时，系统应按 Skill 入库时间倒序排列。

> **[State-driven]** 当用户选择「最热」排序时，系统应按热度分值倒序排列。热度计算公式：
> ```
> 热度 = 星标数 × 0.5 + 浏览量 × 0.3 + 时间衰减因子
> 时间衰减因子 = 1 / (1 + 0.08 × 距今天数)
> ```

> **[Ubiquitous]** 默认排序方式为「最热」。

#### F1.3 分类筛选

> **[Ubiquitous]** 系统应提供分类筛选栏，展示所有一级分类，以横向滚动的标签形式呈现。

> **[Ubiquitous]** 分类列表第一项应为「全部」，默认选中。

> **[Event-driven]** 当用户点击某个分类标签时，系统应筛选仅显示该分类下的 Skill，并高亮选中标签。

> **[Ubiquitous]** 系统应支持的一级分类如下：

| 分类标识 | 中文名称 | 说明 |
|---------|---------|------|
| development | 开发工具 | 编码辅助、代码审查、调试等 |
| data-ai | 数据与 AI | 数据分析、机器学习、Prompt 工程等 |
| content-media | 内容创作 | 文案、翻译、音视频处理等 |
| design-creative | 设计创意 | UI/UX、图形设计、前端美化等 |
| office-productivity | 办公效率 | 文档、表格、PPT、日程管理等 |
| testing-security | 测试与安全 | 自动化测试、安全审计等 |
| business | 商业运营 | 营销、SEO、数据分析等 |
| other | 其他 | 未归类的通用 Skill |

### F2. Skill 详情页

#### F2.1 页面结构

> **[Ubiquitous]** Skill 详情页应展示以下信息：

| 信息项 | 说明 |
|--------|------|
| Skill 名称 | 保留原始语言 |
| 中文简介 | 完整中文描述 |
| 原始描述 | 来源的原始语言描述（折叠展示，默认收起） |
| 分类标签 | 可点击，跳转到对应分类筛选页 |
| 作者/来源 | 如 GitHub 仓库所有者 |
| 适用平台 | Claude Code / Codex / Cursor / 通用 等 |
| 更新时间 | 原始来源的最后更新时间 |
| 来源链接 | 外链到 GitHub / 原始页面 |
| 安装方式 | 如适用，展示安装命令或步骤 |
| 入库时间 | 本平台收录时间 |

> **[Event-driven]** 当用户点击分类标签时，系统应跳转到首页并自动选中该分类筛选。

> **[Event-driven]** 当用户点击来源链接时，系统应在新标签页打开原始来源。

> **[Unwanted]** 若 Skill 详情数据不存在（如 URL 参数错误），系统应显示 404 页面："Skill 不存在或已被移除" + 返回首页按钮。

#### F2.2 相关推荐

> **[Ubiquitous]** 详情页底部应展示「相关 Skill」区域，显示 4 张同分类下的热门 Skill 卡片。

> **[Unwanted]** 若同分类下无其他 Skill，则不显示相关推荐区域。

### F3. Skill 双语展示规则

> **[Ubiquitous]** Skill 名称应始终保留原始语言，不做翻译：
> - 原始名称是英文 → 展示英文名称
> - 原始名称是中文 → 展示中文名称
> - 原始名称是其他语言 → 保留原语言 + 中文译名括号标注

> **[Ubiquitous]** Skill 简介应始终展示中文：
> - 若原始描述为中文 → 直接使用
> - 若原始描述为英文 → 系统应自动翻译为中文（机器翻译）
> - 翻译结果应在详情页标注「机器翻译，仅供参考」

> **[Optional]** 若 Skill 原始描述包含代码块或命令示例，翻译时应保留原始代码块不翻译。

### F4. 自动采集系统

#### F4.1 采集源

> **[Ubiquitous]** 系统应至少支持以下采集源：

| 采集源 | 类型 | 采集方式 |
|--------|------|---------|
| GitHub 公开仓库 | SKILL.md 文件 | GitHub Search API |
| skills.sh 热门排行 | 聚合平台 | 网页解析 |
| 技术社区 RSS | 社区文章 | RSS 解析 |

> **[Optional]** 后续可通过配置文件扩展采集源，无需修改代码。

#### F4.2 采集规则

> **[Ubiquitous]** 采集任务应每日自动执行一次（建议 UTC 0:00）。

> **[Ubiquitous]** 系统应在采集时执行去重：若 Skill 的来源 URL 已存在于数据库，则跳过该 Skill，仅更新已有记录的元数据（星标数、更新时间等）。

> **[Ubiquitous]** 新采集的 Skill 入库后，系统应自动尝试匹配分类（基于 Skill 名称和描述的关键词匹配）。

> **[Event-driven]** 当采集到英文 Skill 时，系统应在入库前自动调用翻译 API 生成中文简介。

> **[Unwanted]** 若某个采集源连续 3 天采集失败，系统应记录错误日志但不影响其他采集源。

> **[Unwanted]** 若翻译 API 调用失败（超时/配额不足），系统应保留原始英文描述作为简介，并标记「待翻译」。

#### F4.3 质量筛选

> **[Ubiquitous]** 系统应过滤以下低质量 Skill，不予入库：
> - 描述内容为空或少于 20 个字符
> - Skill 来源链接返回 404
> - Skill 名称仅包含无意义字符（如"test""demo123"）

> **[Ubiquitous]** 系统应优先采集满足以下条件的 Skill：
> - GitHub 星标数 ≥ 5
> - 最近 6 个月内有更新
> - SKILL.md 文件内容 ≥ 200 字符

### F5. 用户上传功能

#### F5.1 上传表单

> **[Ubiquitous]** 系统应在首页顶部导航栏提供「上传 Skill」入口按钮。

> **[Event-driven]** 当用户点击「上传 Skill」时，系统应展示上传表单页面，包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Skill 名称 | 文本输入 | 是 | 保留原始语言 |
| 中文简介 | 文本域 | 是 | 100-500 字 |
| 原始描述 | 文本域 | 否 | 原始语言完整描述 |
| 分类 | 下拉单选 | 是 | 从预设分类中选择 |
| 来源链接 | URL 输入 | 是 | GitHub / 网页链接 |
| 适用平台 | 多选 | 否 | Claude Code / Codex / Cursor / 通用 |
| 安装方式 | 文本域 | 否 | 安装命令或步骤 |
| 作者名称 | 文本输入 | 否 | Skill 原作者 |

> **[Event-driven]** 当用户提交表单后，系统应显示「提交成功，等待审核」提示，并跳转回首页。

> **[Unwanted]** 若必填字段为空或格式不正确，系统应在对应字段下方显示红色错误提示，不提交表单。

> **[Unwanted]** 若提交时网络异常，系统应显示"提交失败，请稍后重试"并保留已填写内容。

#### F5.2 审核管理

> **[Ubiquitous]** 系统应提供一个简易审核页面（路径：`/admin`，通过简单密码保护）。

> **[State-driven]** 用户提交的 Skill 初始状态为「待审核」，在审核通过前不在首页展示。

> **[Event-driven]** 当管理员审核通过时，Skill 状态变为「已发布」，出现在首页列表中，入库时间设为审核通过时间。

> **[Event-driven]** 当管理员驳回时，Skill 状态变为「已驳回」，不出现在首页。

> **[Ubiquitous]** 审核页面应展示：提交时间、Skill 名称、简介、分类、来源链接、当前状态，以及「通过」和「驳回」操作按钮。

---

## 五、页面清单

### 5.1 页面结构

```
├── /                   首页（Skill 卡片列表 + 排序 + 分类筛选）
├── /skill/[id]          Skill 详情页
├── /upload             上传 Skill 页面
├── /admin              审核管理页面
└── /api/*              API 路由（后端）
```

### 5.2 页面状态

| 页面 | 状态 | 说明 |
|------|------|------|
| 首页 | 加载中 | 卡片骨架屏（灰色占位卡片） |
| 首页 | 正常 | 展示卡片列表 |
| 首页 | 空 | 当前筛选无结果 |
| 首页 | 错误 | 加载失败 + 重试按钮 |
| 详情页 | 加载中 | 内容骨架屏 |
| 详情页 | 正常 | 展示完整信息 |
| 详情页 | 404 | Skill 不存在 |
| 上传页 | 编辑中 | 表单正常填写 |
| 上传页 | 校验错误 | 必填项标红提示 |
| 上传页 | 提交成功 | 成功提示 + 跳转 |
| 上传页 | 提交失败 | 错误提示 + 保留内容 |
| 审核页 | 待审核列表 | 表格展示 |
| 审核页 | 空 | 无待审核项 |

---

## 六、数据模型

### 6.1 核心表结构

```sql
-- Skill 主表
CREATE TABLE skills (
  id            TEXT PRIMARY KEY,          -- UUID
  name          TEXT NOT NULL,             -- 原始名称
  name_lang     TEXT DEFAULT 'en',         -- 名称语言: en/zh/other
  summary_cn    TEXT NOT NULL,             -- 中文简介
  description   TEXT,                      -- 原始描述
  category      TEXT NOT NULL,             -- 分类标识
  tags          TEXT DEFAULT '[]',         -- JSON 数组，额外标签
  source_url    TEXT NOT NULL,             -- 来源链接
  source_type   TEXT NOT NULL,             -- github/marketplace/community/rss/user
  platform      TEXT DEFAULT '["通用"]',   -- JSON 数组，适用平台
  install_cmd   TEXT,                      -- 安装方式
  author        TEXT,                      -- 作者/来源名称
  stars         INTEGER DEFAULT 0,         -- 星标数
  view_count    INTEGER DEFAULT 0,         -- 浏览量
  source_updated_at TEXT,                  -- 原始来源更新时间
  status        TEXT DEFAULT 'published',  -- published/pending/rejected
  is_new        INTEGER DEFAULT 1,         -- 是否显示 NEW 标记
  created_at    TEXT NOT NULL,             -- 入库时间
  updated_at    TEXT NOT NULL              -- 更新时间
);

-- 采集日志表
CREATE TABLE collect_logs (
  id            TEXT PRIMARY KEY,
  source_name   TEXT NOT NULL,             -- 采集源名称
  status        TEXT NOT NULL,             -- success/partial/failed
  new_count     INTEGER DEFAULT 0,         -- 新增数量
  update_count  INTEGER DEFAULT 0,         -- 更新数量
  error_msg     TEXT,                      -- 错误信息
  created_at    TEXT NOT NULL
);

-- 翻译缓存表（可选，减少翻译 API 调用）
CREATE TABLE translation_cache (
  id            TEXT PRIMARY KEY,
  source_hash   TEXT NOT NULL UNIQUE,      -- 原文 hash
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at    TEXT NOT NULL
);
```

### 6.2 索引建议

```sql
CREATE INDEX idx_skills_status ON skills(status);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_created ON skills(created_at DESC);
CREATE INDEX idx_skills_stars ON skills(stars DESC);
CREATE INDEX idx_skills_source_url ON skills(source_url);
```

---

## 七、API 设计

### 7.1 接口清单

| 方法 | 路径 | 说明 | 优先级 |
|------|------|------|--------|
| GET | `/api/skills` | 获取 Skill 列表（支持排序、分类筛选、分页） | P0 |
| GET | `/api/skills/[id]` | 获取 Skill 详情 | P0 |
| POST | `/api/skills` | 用户上传 Skill | P1 |
| GET | `/api/categories` | 获取分类列表 | P0 |
| POST | `/api/admin/login` | 审核页登录 | P1 |
| GET | `/api/admin/skills` | 获取待审核列表 | P1 |
| PUT | `/api/admin/skills/[id]` | 审核操作（通过/驳回） | P1 |
| POST | `/api/collect/trigger` | 手动触发采集 | P1 |

### 7.2 核心接口详情

#### GET /api/skills

**请求参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| sort | string | 否 | hot | hot / new |
| category | string | 否 | all | 分类标识，all 为全部 |
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 24 | 每页数量 |

**响应示例：**

```json
{
  "data": [
    {
      "id": "uuid-xxx",
      "name": "frontend-design",
      "nameLang": "en",
      "summaryCn": "用于构建新UI或重塑现有UI的独特、有意图的视觉设计指导",
      "category": "design-creative",
      "sourceType": "github",
      "sourceUrl": "https://github.com/anthropics/skills",
      "author": "anthropics",
      "stars": 159000,
      "platform": ["Claude Code", "通用"],
      "isNew": true,
      "createdAt": "2025-07-10T08:00:00Z"
    }
  ],
  "total": 500,
  "page": 1,
  "pageSize": 24
}
```

#### POST /api/skills（上传）

**请求体：**

```json
{
  "name": "my-awesome-skill",
  "summaryCn": "这是一个很棒的技能，用于...",
  "description": "原始英文描述（可选）",
  "category": "development",
  "sourceUrl": "https://github.com/xxx/xxx",
  "platform": ["Claude Code"],
  "installCmd": "claude skills install xxx",
  "author": "原作者名"
}
```

---

## 八、交互说明

### 8.1 首页布局（桌面端）

```
┌──────────────────────────────────────────────────┐
│  Logo    [最新] [最热]    [🔍搜索(后续)]  [📤上传] │  ← 顶部导航
├──────────────────────────────────────────────────┤
│  [全部] [开发工具] [数据与AI] [内容创作] [设计] ... │  ← 分类筛选栏
├──────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ 🆕 NEW  │  │         │  │         │           │
│  │ 名称     │  │ 名称     │  │ 名称     │           │  ← 卡片网格
│  │ 中文简介 │  │ 中文简介 │  │ 中文简介 │           │
│  │ ⭐1.2k  │  │ ⭐856   │  │ ⭐3.4k  │           │
│  │ 🏷分类   │  │ 🏷分类   │  │ 🏷分类   │           │
│  └─────────┘  └─────────┘  └─────────┘           │
│  ...更多卡片...                                    │
├──────────────────────────────────────────────────┤
│              < 1  2  3 ... 10 >                   │  ← 分页
└──────────────────────────────────────────────────┘
```

### 8.2 移动端适配

- 卡片单列布局
- 分类筛选栏改为下拉选择或水平滚动
- 排序切换保持标签形式，全宽
- 分页改为「加载更多」按钮

### 8.3 卡片悬停效果

- 轻微上浮（translateY: -4px）
- 阴影加深
- 过渡动画 200ms ease
- 光标变为 pointer

### 8.4 加载状态

- 骨架屏：灰色脉冲动画占位卡片，形状与真实卡片一致
- 首次加载显示 6 张骨架卡片

---

## 九、非功能需求

### 9.1 性能

| 指标 | 目标 |
|------|------|
| 首页首屏加载（LCP） | < 2.5s |
| API 响应时间（P95） | < 500ms |
| 卡片列表分页 | 每页 24 条，支持无限滚动或分页 |
| 静态资源 | 图片使用 Next.js Image 优化，启用 CDN |

### 9.2 SEO

> **[Ubiquitous]** Skill 详情页应使用 Next.js SSR/SSG，确保搜索引擎可索引。

> **[Ubiquitous]** 每个 Skill 详情页应设置独立的 `<title>` 和 `<meta description>`。

### 9.3 可维护性

> **[Ubiquitous]** 采集源配置应集中在单个配置文件中，新增采集源只需添加配置项。

> **[Ubiquitous]** 分类列表应从配置文件读取，前端和后端共享同一份分类定义。

### 9.4 安全

> **[Ubiquitous]** 审核页面应通过环境变量配置的密码进行简单认证。

> **[Ubiquitous]** 用户上传的内容在展示前应进行 XSS 过滤（HTML 标签转义）。

> **[Ubiquitous]** API 路由应设置合理的请求频率限制（上传接口：每分钟最多 5 次）。

---

## 十、数据埋点需求

| 事件名 | 触发时机 | 属性 |
|--------|---------|------|
| page_view | 页面加载 | page, referrer |
| skill_card_click | 点击 Skill 卡片 | skill_id, skill_name, position |
| sort_switch | 切换排序方式 | sort_type |
| category_filter | 点击分类筛选 | category |
| source_link_click | 点击来源链接 | skill_id, source_type |
| upload_submit | 提交上传表单 | category |
| upload_success | 上传成功 | skill_id |

> 注：MVP 阶段可先用简单的 PV 统计（如 Umami / Plausible），后续再补精细化埋点。

---

## 十一、验收标准

### 11.1 首页浏览

| # | 验收项 | 预期结果 |
|---|--------|---------|
| AC-01 | 首页加载 | 默认按热度排序展示 Skill 卡片，每行 3 张（桌面端） |
| AC-02 | 排序切换 | 点击「最新」按时间倒序，点击「最热」按热度倒序 |
| AC-03 | 分类筛选 | 点击分类标签只显示该分类 Skill，点击「全部」恢复 |
| AC-04 | 排序+分类组合 | 切换排序时保留分类筛选条件，反之亦然 |
| AC-05 | 空状态 | 筛选条件无结果时显示空状态提示 |
| AC-06 | 加载失败 | 网络异常时显示错误提示 + 重试按钮 |
| AC-07 | NEW 标记 | 24 小时内入库的 Skill 显示 NEW 标记 |
| AC-08 | 响应式 | 平板 2 列，手机 1 列，布局不错乱 |

### 11.2 Skill 详情

| # | 验收项 | 预期结果 |
|---|--------|---------|
| AC-09 | 详情展示 | 展示名称、中文简介、分类、来源、平台、安装方式等 |
| AC-10 | 原始描述 | 默认折叠，点击可展开 |
| AC-11 | 来源链接 | 点击在新标签页打开 |
| AC-12 | 分类标签点击 | 跳转到首页并筛选该分类 |
| AC-13 | 相关推荐 | 底部展示同分类热门 Skill（最多 4 个） |
| AC-14 | 404 处理 | 无效 ID 显示 404 页面 |

### 11.3 上传功能

| # | 验收项 | 预期结果 |
|---|--------|---------|
| AC-15 | 表单校验 | 必填项为空时显示错误提示 |
| AC-16 | 提交成功 | 显示成功提示并跳转首页 |
| AC-17 | URL 格式校验 | 非法 URL 格式显示错误提示 |
| AC-18 | 提交失败 | 网络异常时保留已填内容并提示重试 |

### 11.4 审核管理

| # | 验收项 | 预期结果 |
|---|--------|---------|
| AC-19 | 密码保护 | 未登录无法访问 /admin |
| AC-20 | 待审核列表 | 显示所有待审核 Skill |
| AC-21 | 审核通过 | Skill 状态变为已发布，出现在首页 |
| AC-22 | 审核驳回 | Skill 状态变为已驳回，不出现在首页 |

### 11.5 自动采集

| # | 验收项 | 预期结果 |
|---|--------|---------|
| AC-23 | 定时执行 | 每日自动执行采集任务 |
| AC-24 | 去重 | 重复 URL 不新增记录，仅更新元数据 |
| AC-25 | 翻译 | 英文 Skill 自动生成中文简介 |
| AC-26 | 分类匹配 | 新 Skill 自动匹配分类 |
| AC-27 | 质量过滤 | 低质量/死链 Skill 不入库 |

---

## 十二、项目排期建议

| 阶段 | 内容 | 预估周期 | 负责人 |
|------|------|---------|--------|
| 第 1 周 | 项目初始化、数据模型、API 开发 | 3 天 | AI 助手 |
| 第 1-2 周 | 首页 + 详情页前端 | 4 天 | 用户 |
| 第 2 周 | 采集脚本开发 + 种子数据导入 | 3 天 | AI 助手 |
| 第 2-3 周 | 上传 + 审核功能 | 3 天 | AI 助手 + 用户 |
| 第 3 周 | 联调、部署、种子数据填充 | 2 天 | 双方 |
| 第 3 周末 | MVP 上线 | — | — |

> ⚠️ 以上为建议排期，具体请根据你的可用时间调整。涉及上线时间决策请自行确认。

---

## 十三、附录

### A. 分类定义完整配置

```typescript
// shared/categories.ts — 前后端共享
export const CATEGORIES = [
  { id: 'development',      label: '开发工具',   icon: '💻' },
  { id: 'data-ai',          label: '数据与AI',   icon: '🧠' },
  { id: 'content-media',    label: '内容创作',   icon: '✍️' },
  { id: 'design-creative',  label: '设计创意',   icon: '🎨' },
  { id: 'office-productivity', label: '办公效率', icon: '📋' },
  { id: 'testing-security', label: '测试与安全', icon: '🛡️' },
  { id: 'business',         label: '商业运营',   icon: '📈' },
  { id: 'other',            label: '其他',       icon: '📦' },
] as const;
```

### B. 翻译 Prompt 模板

```
You are a translator. Translate the following AI Skill description 
from English to Simplified Chinese. 

Rules:
- Keep code blocks, commands, and technical terms in original language
- Keep it concise, within 120 Chinese characters
- Use natural, professional Chinese

Original: {original_description}

Chinese summary:
```

### C. 采集源配置示例

```typescript
// config/collect-sources.ts
export const COLLECT_SOURCES = [
  {
    name: 'github-skills',
    type: 'github-search',
    enabled: true,
    config: {
      query: 'SKILL.md in:file language:markdown',
      sort: 'stars',
      perPage: 30,
      minStars: 5,
    }
  },
  {
    name: 'skills-sh-trending',
    type: 'web-scrape',
    enabled: true,
    config: {
      url: 'https://skills.sh/',
      selector: '.skill-card',
    }
  },
];
```

---

> 📋 **下一步**：PRD 确认后，可进入 **阶段三：设计与研发评审**，或直接开始开发。建议将 PRD 上传到项目资料库，并创建开发事项。
> 
> 💡 你的下一步是：设计首页和详情页的视觉稿（Figma/手绘都行），我同步开始搭建项目脚手架和数据层。
