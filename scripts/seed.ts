/**
 * 种子数据脚本 — 将示例项目写入 Upstash Redis
 *
 * 用法:
 *   npx tsx scripts/seed.ts
 *
 * 需要设置环境变量:
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { Redis } from "@upstash/redis";
import { Project } from "../src/lib/types";

const sampleProjects: Project[] = [
  {
    id: "2024-qinghai-zhijiao",
    title: "青海支教社会实践",
    summary: "为期两周的青海乡村支教活动，帮助当地小学生提升语文和数学基础。",
    description:
      "## 项目背景\n\n青海省某乡村小学教育资源匮乏，我们团队一行 8 人前往开展为期两周的暑期支教活动。\n\n## 活动内容\n\n1. **语文辅导**：通过趣味阅读提升学生兴趣\n2. **数学启蒙**：使用游戏化教学方式\n3. **美术手工**：培养创造力和动手能力\n\n## 成果\n\n- 辅导学生 120+ 人次\n- 捐赠图书 300 册\n- 建立长期线上辅导机制",
    coverImage: "/images/qinghai-cover.jpg",
    tags: ["教育", "乡村", "支教"],
    members: [
      { name: "张三", role: "队长", avatar: "", link: "https://github.com/zhangsan" },
      { name: "李四", role: "教学负责人", avatar: "", link: "https://github.com/lisi" },
      { name: "王五", role: "后勤保障", avatar: "", link: "" },
    ],
    links: [
      { label: "GitHub 仓库", url: "https://github.com/example/qinghai-zhijiao" },
      { label: "活动报道", url: "https://news.example.com/qinghai-zhijiao" },
    ],
    stats: { views: 156, linkClicks: { "GitHub 仓库": 42, "活动报道": 28 } },
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-07-15T00:00:00Z",
  },
  {
    id: "2024-huanbao-diaoyan",
    title: "城市垃圾分类调研",
    summary: "对上海市 5 个社区的垃圾分类实施情况进行实地调研和数据分析。",
    description:
      "## 项目背景\n\n上海市垃圾分类政策实施以来效果如何？我们团队深入 5 个社区开展调研。\n\n## 调研方法\n\n- 问卷调查：发放 500 份问卷\n- 实地观察：记录分类投放准确率\n- 访谈：采访社区工作者和居民\n\n## 主要发现\n\n1. 分类准确率平均达到 78%\n2. 老年人群体的分类意识有待加强\n3. 社区督导员制度效果显著",
    coverImage: "/images/huanbao-cover.jpg",
    tags: ["环保", "调研", "城市治理"],
    members: [
      { name: "赵六", role: "项目负责人", avatar: "", link: "https://github.com/zhaoliu" },
    ],
    links: [{ label: "调研报告", url: "https://example.com/report" }],
    stats: { views: 89, linkClicks: { "调研报告": 15 } },
    createdAt: "2024-06-15T00:00:00Z",
    updatedAt: "2024-06-30T00:00:00Z",
  },
  {
    id: "2024-keji-nongye",
    title: "智慧农业科技助农",
    summary: "将物联网传感器和数据分析技术应用于本地大棚种植，实现精准灌溉。",
    description:
      "## 项目概述\n\n利用物联网技术实现智慧农业。团队开发了一套低成本大棚环境监测系统。\n\n## 技术方案\n\n- **硬件**: ESP32 + 土壤湿度传感器 + DHT22 温湿度\n- **后端**: Node.js 数据采集服务\n- **前端**: 可视化仪表盘\n\n## 成果\n\n- 节水 30%\n- 产量提升 15%\n- 获得校级优秀实践项目",
    coverImage: "",
    tags: ["科技", "农业", "物联网"],
    members: [
      { name: "孙七", role: "技术负责人", avatar: "", link: "https://github.com/sunqi" },
      { name: "周八", role: "硬件工程师", avatar: "", link: "" },
    ],
    links: [
      { label: "GitHub 仓库", url: "https://github.com/example/smart-agri" },
      { label: "演示视频", url: "https://bilibili.com/video/example" },
    ],
    stats: { views: 210, linkClicks: { "GitHub 仓库": 67, "演示视频": 53 } },
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
];

async function seed() {
  console.log("🌱 正在写入种子数据到 Upstash Redis...");

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("❌ 请设置 KV_REST_API_URL 和 KV_REST_API_TOKEN 环境变量");
    process.exit(1);
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  await redis.set("projects", sampleProjects);
  console.log(`✅ 成功写入 ${sampleProjects.length} 个示例项目`);

  // 验证
  const data = await redis.get<Project[]>("projects");
  console.log(`🔍 验证: 读取到 ${data?.length || 0} 个项目`);
  process.exit(0);
}

seed();
