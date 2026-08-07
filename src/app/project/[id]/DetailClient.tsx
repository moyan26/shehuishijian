"use client";

import { useEffect } from "react";

interface DetailClientProps {
  projectId: string;
  linkLabels: string[];
}

/** 客户端组件：自动记录浏览量，为链接绑定点击追踪 */
export default function DetailClient({
  projectId,
  linkLabels,
}: DetailClientProps) {
  useEffect(() => {
    // 记录浏览量
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, type: "view" }),
    }).catch(() => {});

    // 为链接绑定点击追踪
    const links = document.querySelectorAll("[data-link-label]");
    const handleClick = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const label = el.getAttribute("data-link-label");
      if (label) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, type: "click", linkLabel: label }),
        }).catch(() => {});
      }
    };

    links.forEach((link) => {
      link.addEventListener("click", handleClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleClick);
      });
    };
  }, [projectId, linkLabels]);

  return null;
}
