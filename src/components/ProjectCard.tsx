import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all overflow-hidden group"
    >
      {/* 封面图 */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-4xl text-blue-300">📋</span>
        )}
      </div>

      <div className="p-4">
        {/* 标题 */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>

        {/* 摘要 */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {project.summary}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>👥 {project.members.length} 人</span>
          <span>👁 {project.stats.views} 次浏览</span>
          <span>
            {new Date(project.createdAt).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
