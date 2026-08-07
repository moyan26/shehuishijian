"use client";

import { useState, useEffect } from "react";
import { Project, ProjectInput } from "@/lib/types";

interface ProjectFormProps {
  project?: Project | null;
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({
  project,
  token,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const isEdit = !!project;

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [members, setMembers] = useState("");
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setSummary(project.summary);
      setDescription(project.description);
      setCoverImage(project.coverImage || "");
      setTags(project.tags.join(", "));
      setMembers(
        project.members
          .map((m) => `${m.name}|${m.role}|${m.link || ""}`)
          .join("\n")
      );
      setLinks(
        project.links.map((l) => `${l.label}|${l.url}`).join("\n")
      );
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const parsedMembers = members
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [name, role, link] = line.split("|");
          return { name: name.trim(), role: (role || "").trim(), link: (link || "").trim() };
        });

      const parsedLinks = links
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [label, url] = line.split("|");
          return { label: (label || "").trim(), url: (url || "").trim() };
        });

      const data: ProjectInput = {
        title,
        summary,
        description,
        coverImage,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        members: parsedMembers,
        links: parsedLinks,
      };

      const url = isEdit
        ? `/api/projects/${project!.id}`
        : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "操作失败");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {isEdit ? "编辑项目" : "新增项目"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="如：青海支教社会实践"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          摘要 *
        </label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="一句话概括项目"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          详细描述 *（支持 Markdown）
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono"
          placeholder="## 项目背景..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          封面图 URL
        </label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="/images/cover.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标签（逗号分隔）
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="教育, 乡村, 支教"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          成员（每行一个：姓名|角色|链接）
        </label>
        <textarea
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono"
          placeholder={"张三|队长|https://github.com/zhangsan\n李四|教学负责人|"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          链接（每行一个：标签|URL）
        </label>
        <textarea
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono"
          placeholder={"GitHub 仓库|https://github.com/example/repo\n活动报道|https://news.example.com"}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : isEdit ? "更新" : "创建"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
