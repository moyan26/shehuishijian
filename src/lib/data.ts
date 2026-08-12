import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import {
  Project,
  ProjectApplication,
  ProjectApplicationInput,
  ProjectInput,
} from "./types";

// ============================================================
// 本地开发用 JSON 文件存储（没有 Redis 时自动回退）
// ============================================================

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readFromFile(): Project[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ projects: [] }, null, 2),
      "utf-8"
    );
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : (data.projects || []);
}

function writeToFile(projects: Project[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

function readApplicationsFromFile(): ProjectApplication[] {
  ensureDataDir();
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(APPLICATIONS_FILE, "utf-8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : (data.applications || []);
}

function writeApplicationsToFile(applications: ProjectApplication[]): void {
  ensureDataDir();
  fs.writeFileSync(
    APPLICATIONS_FILE,
    JSON.stringify(applications, null, 2),
    "utf-8"
  );
}

// ============================================================
// Upstash Redis（仅在生产环境可用时使用）
// ============================================================

function hasRedis(): boolean {
  return !!(
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

/** 延迟初始化 Redis，避免构建时因缺少环境变量而报错 */
let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

const KV_KEY = "projects";
const APPLICATIONS_KV_KEY = "project_applications";

// ============================================================
// 公共 API（自动选择存储后端）
// ============================================================

/** 获取所有项目（按创建时间倒序） */
export async function getAllProjects(): Promise<Project[]> {
  if (hasRedis()) {
    const redis = getRedis();
    const data = await redis.get<Project[]>(KV_KEY);
    const projects = data || [];
    return projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const projects = readFromFile();
  return projects.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** 根据 id 获取单个项目 */
export async function getProjectById(
  id: string
): Promise<Project | undefined> {
  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    return projects.find((p) => p.id === id);
  }
  return readFromFile().find((p) => p.id === id);
}

/** 新增项目 */
export async function createProject(input: ProjectInput): Promise<Project> {
  const now = new Date().toISOString();
  const id = generateSlug(input.title);

  const project: Project = {
    ...input,
    id,
    stats: { views: 0, linkClicks: {} },
    createdAt: now,
    updatedAt: now,
  };

  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    projects.push(project);
    await redis.set(KV_KEY, projects);
    return project;
  }

  const projects = readFromFile();
  projects.push(project);
  writeToFile(projects);
  return project;
}

/** 更新项目 */
export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<Project | null> {
  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...input,
      id: projects[index].id,
      stats: projects[index].stats,
      createdAt: projects[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    await redis.set(KV_KEY, projects);
    return projects[index];
  }

  const projects = readFromFile();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...input,
    id: projects[index].id,
    stats: projects[index].stats,
    createdAt: projects[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  writeToFile(projects);
  return projects[index];
}

/** 删除项目 */
export async function deleteProject(id: string): Promise<boolean> {
  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    projects.splice(index, 1);
    await redis.set(KV_KEY, projects);
    return true;
  }

  const projects = readFromFile();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  writeToFile(projects);
  return true;
}

/** 增加项目浏览量 */
export async function incrementViews(id: string): Promise<void> {
  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.stats.views += 1;
      await redis.set(KV_KEY, projects);
    }
    return;
  }

  const projects = readFromFile();
  const project = projects.find((p) => p.id === id);
  if (project) {
    project.stats.views += 1;
    writeToFile(projects);
  }
}

/** 增加链接点击量 */
export async function incrementLinkClick(
  id: string,
  linkLabel: string
): Promise<void> {
  if (hasRedis()) {
    const redis = getRedis();
    const projects = (await redis.get<Project[]>(KV_KEY)) || [];
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.stats.linkClicks[linkLabel] =
        (project.stats.linkClicks[linkLabel] || 0) + 1;
      await redis.set(KV_KEY, projects);
    }
    return;
  }

  const projects = readFromFile();
  const project = projects.find((p) => p.id === id);
  if (project) {
    project.stats.linkClicks[linkLabel] =
      (project.stats.linkClicks[linkLabel] || 0) + 1;
    writeToFile(projects);
  }
}

/** 提交项目入驻申请 */
export async function createProjectApplication(
  input: ProjectApplicationInput
): Promise<ProjectApplication> {
  const now = new Date().toISOString();
  const application: ProjectApplication = {
    ...input,
    id: `application-${Date.now()}`,
    status: "pending",
    createdAt: now,
  };

  if (hasRedis()) {
    const redis = getRedis();
    const applications =
      (await redis.get<ProjectApplication[]>(APPLICATIONS_KV_KEY)) || [];
    applications.push(application);
    await redis.set(APPLICATIONS_KV_KEY, applications);
    return application;
  }

  const applications = readApplicationsFromFile();
  applications.push(application);
  writeApplicationsToFile(applications);
  return application;
}

/** 生成唯一 URL slug */
function generateSlug(title: string): string {
  const now = Date.now();
  const base = title
    .replace(/[^一-龥a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30)
    .toLowerCase();
  return `${base}-${now}`;
}
