// ============================================================
// 社会实践项目展示网站 — 统一类型定义
// ============================================================

/** 团队成员 */
export interface Member {
  name: string;
  role: string;
  avatar?: string;
  link?: string;
}

/** 项目相关链接 */
export interface ProjectLink {
  label: string;
  url: string;
}

/** 项目统计 */
export interface ProjectStats {
  views: number;
  linkClicks: Record<string, number>; // { "链接label": 点击次数 }
}

/** 单个社会实践项目 */
export interface Project {
  id: string; // URL 友好 slug，唯一标识
  title: string;
  summary: string;
  description: string; // 支持 Markdown
  coverImage?: string;
  tags: string[];
  members: Member[];
  links: ProjectLink[];
  stats: ProjectStats;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** projects.json 的顶层结构 */
export interface ProjectsData {
  projects: Project[];
}

/** 创建/更新项目的输入（不含 id 和 stats） */
export type ProjectInput = Omit<Project, "id" | "stats" | "createdAt" | "updatedAt">;

/** 分析事件类型 */
export interface AnalyticsEvent {
  projectId: string;
  type: "view" | "click";
  linkLabel?: string; // click 时必填
}
