export interface Member {
  name: string;
  role: string;
  avatar?: string;
  link?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectStats {
  views: number;
  linkClicks: Record<string, number>;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  coverImage?: string;
  category?: string;
  outcomeTypes?: string[];
  college?: string;
  recommended?: boolean;
  tags: string[];
  members: Member[];
  links: ProjectLink[];
  stats: ProjectStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsData {
  projects: Project[];
}

export type ProjectInput = Omit<Project, "id" | "stats" | "createdAt" | "updatedAt">;

export interface AnalyticsEvent {
  projectId: string;
  type: "view" | "click";
  linkLabel?: string;
}

export interface ProjectApplication {
  id: string;
  projectName: string;
  college: string;
  category: string;
  outcomeTypes: string[];
  contactName: string;
  contactInfo: string;
  summary: string;
  links: ProjectLink[];
  note?: string;
  status: "pending" | "reviewed";
  createdAt: string;
}

export type ProjectApplicationInput = Omit<
  ProjectApplication,
  "id" | "status" | "createdAt"
>;
