import fs from "fs";
import path from "path";
import { ProjectsData, Project, ProjectInput } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

/** 确保 data 目录存在 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/** 读取所有项目数据 */
export function readProjects(): ProjectsData {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    const empty: ProjectsData = { projects: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as ProjectsData;
}

/** 写入项目数据 */
export function writeProjects(data: ProjectsData): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/** 获取所有项目（按创建时间倒序） */
export function getAllProjects(): Project[] {
  const data = readProjects();
  return data.projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** 根据 id 获取单个项目 */
export function getProjectById(id: string): Project | undefined {
  const data = readProjects();
  return data.projects.find((p) => p.id === id);
}

/** 新增项目 */
export function createProject(input: ProjectInput): Project {
  const data = readProjects();
  const now = new Date().toISOString();

  // 生成 URL 友好的 id
  const id = generateSlug(input.title);

  const project: Project = {
    ...input,
    id,
    stats: { views: 0, linkClicks: {} },
    createdAt: now,
    updatedAt: now,
  };

  data.projects.push(project);
  writeProjects(data);
  return project;
}

/** 更新项目 */
export function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Project | null {
  const data = readProjects();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Project = {
    ...data.projects[index],
    ...input,
    id: data.projects[index].id, // id 不可变
    stats: data.projects[index].stats, // stats 保持不变
    createdAt: data.projects[index].createdAt, // 创建时间不变
    updatedAt: new Date().toISOString(),
  };

  data.projects[index] = updated;
  writeProjects(data);
  return updated;
}

/** 删除项目 */
export function deleteProject(id: string): boolean {
  const data = readProjects();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index === -1) return false;

  data.projects.splice(index, 1);
  writeProjects(data);
  return true;
}

/** 增加项目浏览量 */
export function incrementViews(id: string): void {
  const data = readProjects();
  const project = data.projects.find((p) => p.id === id);
  if (project) {
    project.stats.views += 1;
    writeProjects(data);
  }
}

/** 增加链接点击量 */
export function incrementLinkClick(id: string, linkLabel: string): void {
  const data = readProjects();
  const project = data.projects.find((p) => p.id === id);
  if (project) {
    project.stats.linkClicks[linkLabel] =
      (project.stats.linkClicks[linkLabel] || 0) + 1;
    writeProjects(data);
  }
}

/** 根据中文标题生成 URL slug（简单拼音/英文混合） */
function generateSlug(title: string): string {
  const now = Date.now();
  // 简单策略：取标题前几个字 + 时间戳，保证唯一
  const base = title
    .replace(/[^一-龥a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30)
    .toLowerCase();
  return `${base}-${now}`;
}
