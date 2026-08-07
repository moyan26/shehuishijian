"use client";

import { useState, useEffect, useCallback } from "react";
import { Project } from "@/lib/types";
import ProjectForm from "@/components/ProjectForm";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  // 检查 localStorage 中的 token
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      setLoggedIn(true);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchProjects();
    }
  }, [loggedIn, fetchProjects]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem("admin_token", token.trim());
      setLoggedIn(true);
      setError("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setLoggedIn(false);
    setProjects([]);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`确定删除「${project.title}」？此操作不可撤销。`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "删除失败");
      }
      await fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  // 未登录 → 登录表单
  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔐 管理员登录
        </h1>
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="请输入管理密钥"
              autoFocus
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            登录
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          请在环境变量 <code className="bg-gray-100 px-1 rounded">ADMIN_TOKEN</code> 中设置管理密钥
        </p>
      </div>
    );
  }

  // 已登录 → 管理面板
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">📋 项目管理</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? "收起表单" : "+ 新增项目"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            退出
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* 新增/编辑表单 */}
      {showForm && (
        <div className="mb-8">
          <ProjectForm
            project={editingProject}
            token={token}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </div>
      )}

      {/* 项目表格 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                项目名称
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                标签
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                成员
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                浏览
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">
                    {project.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-500 hidden md:table-cell">
                  {project.members.length}
                </td>
                <td className="px-4 py-3 text-center text-gray-500 hidden md:table-cell">
                  {project.stats.views}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p>暂无项目，点击上方按钮添加</p>
          </div>
        )}
      </div>
    </div>
  );
}
