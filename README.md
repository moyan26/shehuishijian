# 🌍 社会实践项目展示

展示社会实践项目成果与团队风采的网站。

## 技术栈

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — 样式
- **JSON 文件** — 数据存储（`data/projects.json`）
- **Vercel** — 部署

## 本地运行

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 管理后台

访问 `/admin`，使用 Token 登录。

默认 Token: `admin123`（通过环境变量 `ADMIN_TOKEN` 修改）

## 项目数据结构

查看 `data/projects.json`，每个项目包含：

- `id` — URL slug
- `title` / `summary` / `description`
- `tags` / `coverImage`
- `members` — 团队成员
- `links` — 相关链接
- `stats` — 浏览量和链接点击统计
