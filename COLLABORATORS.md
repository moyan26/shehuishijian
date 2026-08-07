# 合作者指南 — 社会实践项目展示网站

## 项目概况

已从零搭建了一个完整的社会实践项目展示网站，包含前端展示、后台管理、分析追踪。

- **线上地址**: https://shehuishijian.vercel.app
- **管理后台**: https://shehuishijian.vercel.app/admin
- **GitHub**: https://github.com/moyan26/shehuishijian

---

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | Upstash Redis（生产）/ JSON 文件（本地开发） |
| 部署 | Vercel（主分支推送自动部署） |

---

## 项目结构

```
shehuishijian/
├── data/
│   └── projects.json          # 本地开发用 JSON 数据源
├── scripts/
│   └── seed.ts                # 种子数据脚本（导入到 Redis）
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页 — 项目列表
│   │   ├── layout.tsx         # 根布局（导航栏 + 页脚）
│   │   ├── admin/page.tsx     # 管理后台（增删改 + Token 登录）
│   │   ├── project/[id]/
│   │   │   ├── page.tsx       # 项目详情页
│   │   │   └── DetailClient.tsx  # 浏览/点击追踪组件
│   │   └── api/
│   │       ├── projects/route.ts        # GET 列表 / POST 新增
│   │       ├── projects/[id]/route.ts   # GET 详情 / PUT 更新 / DELETE 删除
│   │       └── analytics/route.ts       # POST 记录浏览/点击
│   ├── components/
│   │   ├── Navbar.tsx         # 导航栏
│   │   ├── ProjectCard.tsx    # 项目卡片
│   │   └── ProjectForm.tsx    # 新增/编辑项目表单
│   └── lib/
│       ├── types.ts           # TypeScript 类型定义
│       └── data.ts            # 数据读写层（Redis + JSON 双模式）
├── .env.local                 # 本地环境变量（不提交到 Git）
└── package.json
```

---

## 数据格式

每个项目的数据结构如下（详见 `data/projects.json`）：

```json
{
  "id": "2024-qinghai-zhijiao",
  "title": "青海支教社会实践",
  "summary": "一句话摘要",
  "description": "详细描述（支持 Markdown）",
  "coverImage": "/images/cover.jpg",
  "tags": ["教育", "支教"],
  "members": [
    { "name": "张三", "role": "队长", "avatar": "", "link": "" }
  ],
  "links": [
    { "label": "GitHub 仓库", "url": "https://github.com/..." }
  ],
  "stats": {
    "views": 156,
    "linkClicks": { "GitHub 仓库": 42 }
  },
  "createdAt": "2024-07-01T00:00:00Z",
  "updatedAt": "2024-07-15T00:00:00Z"
}
```

---

## 如何开始本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/moyan26/shehuishijian.git
cd shehuishijian

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# 首页:     http://localhost:3000
# 管理后台: http://localhost:3000/admin
```

### 管理后台登录

本地开发时，在 `.env.local` 中设置：

```
ADMIN_TOKEN=fazeclan_1
```

然后在管理页面输入该 Token 即可登录。如果没有设置，API 会返回 500 错误。

### 添加/修改示例数据

本地开发使用 `data/projects.json`，直接编辑该文件即可，支持热更新。

---

## API 接口

| 方法 | 路径 | 说明 | 需要 Token |
|------|------|------|-----------|
| GET | `/api/projects` | 获取所有项目 | 否 |
| GET | `/api/projects/[id]` | 获取单个项目 | 否 |
| POST | `/api/projects` | 新增项目 | 是 |
| PUT | `/api/projects/[id]` | 更新项目 | 是 |
| DELETE | `/api/projects/[id]` | 删除项目 | 是 |
| POST | `/api/analytics` | 记录浏览/点击 | 否 |

Token 通过请求头传递：`Authorization: Bearer <token>`

### 分析追踪

```bash
# 记录浏览量
curl -X POST https://shehuishijian.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"projectId":"2024-qinghai-zhijiao","type":"view"}'

# 记录链接点击
curl -X POST https://shehuishijian.vercel.app/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"projectId":"2024-qinghai-zhijiao","type":"click","linkLabel":"GitHub 仓库"}'
```

---

## 部署

推送到 `main` 分支会自动触发 Vercel 部署。也可以手动部署：

```bash
npx vercel --prod
```

需要在 Vercel 项目设置中配置以下环境变量：

| 变量名 | 说明 |
|--------|------|
| `ADMIN_TOKEN` | 管理后台登录密钥 |
| `KV_REST_API_URL` | Upstash Redis 地址（已自动配置） |
| `KV_REST_API_TOKEN` | Upstash Redis Token（已自动配置） |

---

## 后续工作建议

### 可以改进的地方

1. **图片上传** — 目前封面图使用 URL，可接入 Vercel Blob 或 Cloudinary 实现本地上传
2. **搜索/筛选** — 首页可添加标签筛选和关键词搜索
3. **分页** — 项目多了以后需要分页
4. **Markdown 渲染** — 详情页描述目前是纯文本显示，可集成 `react-markdown`
5. **更安全的认证** — 目前是简单的 Token 认证，可接入 NextAuth.js
6. **成员独立页面** — 目前成员信息在项目内，可创建 `/member/[name]` 独立页面
7. **数据导出** — 添加导出 CSV/JSON 功能

### 如何贡献

1. 从 `main` 分支创建 feature 分支
2. 开发完成后发起 Pull Request
3. 审核通过后合并到 `main`
4. 自动部署到生产环境

---

## 联系人

如有问题，请在 GitHub 上提 Issue。
