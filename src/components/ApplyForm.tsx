"use client";

import { FormEvent, useState } from "react";

const outcomeOptions = ["调研报告", "公众号", "视频", "网站", "文创", "其他"];

export default function ApplyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [outcomeTypes, setOutcomeTypes] = useState<string[]>(["调研报告"]);

  const toggleOutcome = (value: string) => {
    setOutcomeTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const links = String(formData.get("links") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.includes("|")
          ? line.split("|")
          : ["成果链接", line];
        return { label: label.trim(), url: (url || "").trim() };
      })
      .filter((link) => link.url);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.get("projectName"),
          college: formData.get("college"),
          category: formData.get("category"),
          outcomeTypes,
          contactName: formData.get("contactName"),
          contactInfo: formData.get("contactInfo"),
          summary: formData.get("summary"),
          links,
          note: formData.get("note"),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "提交失败");
      }

      event.currentTarget.reset();
      setOutcomeTypes(["调研报告"]);
      setSuccess("申请已提交，后续可由管理员整理后收录到项目广场。");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="section-card p-5 sm:p-7">
      <div className="mb-6">
        <p className="eyebrow mb-2">项目信息</p>
        <h2 className="text-2xl font-black text-slate-950">基础资料</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">项目名称 *</span>
          <input name="projectName" required className="form-input" placeholder="如：蓁巷寻踪" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">所属学院 / 团队 *</span>
          <input name="college" required className="form-input" placeholder="如：建筑学院" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">项目类别 *</span>
          <input name="category" required className="form-input" placeholder="如：社区治理" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">联系人 *</span>
          <input name="contactName" required className="form-input" placeholder="负责人姓名" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700">联系方式 *</span>
          <input name="contactInfo" required className="form-input" placeholder="邮箱、微信或手机号" />
        </label>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="mb-2 text-sm font-semibold text-slate-700">成果形式</p>
        <div className="flex flex-wrap gap-2">
          {outcomeOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={outcomeTypes.includes(option)}
                onChange={() => toggleOutcome(option)}
              />
              <span className="tag-pill bg-slate-100 text-slate-600 peer-checked:bg-teal-700 peer-checked:text-white">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="mt-6 block space-y-2">
        <span className="text-sm font-semibold text-slate-700">项目简介 *</span>
        <textarea
          name="summary"
          required
          rows={4}
          className="form-input"
          placeholder="用一段话说明项目背景、实践内容和主要成果"
        />
      </label>

      <label className="mt-6 block space-y-2">
        <span className="text-sm font-semibold text-slate-700">成果链接</span>
        <textarea
          name="links"
          rows={3}
          className="form-input"
          placeholder={"项目报告|https://...\n公众号推文|https://..."}
        />
      </label>

      <label className="mt-6 block space-y-2">
        <span className="text-sm font-semibold text-slate-700">备注</span>
        <textarea name="note" rows={3} className="form-input" placeholder="其他想补充的信息" />
      </label>

      {success && <p className="mt-5 rounded-2xl bg-teal-50 p-4 text-sm text-teal-700">{success}</p>}
      {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary mt-6 disabled:opacity-60">
        {submitting ? "提交中..." : "提交申请"}
      </button>
    </form>
  );
}
