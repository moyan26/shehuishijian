import ApplyForm from "@/components/ApplyForm";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f5]">
      <section className="hero-surface border-b border-teal-950/10">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
          <p className="eyebrow mb-4">申请入驻</p>
          <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">提交你的社会实践项目</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            填写项目基础信息、成果形式和外部链接。申请提交后会先进入待整理状态，后续可由管理员审核并收录到项目广场。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="section-card h-fit p-5 sm:p-6">
          <p className="eyebrow mb-3">提交流程</p>
          <div className="space-y-4">
            {[
              ["填写申请", "补充项目基础信息、成果形式和联系方式"],
              ["整理审核", "管理员根据申请内容整理展示字段"],
              ["进入广场", "通过项目卡片和详情页公开展示成果"],
            ].map(([title, description], index) => (
              <div key={title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-black text-teal-700">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <ApplyForm />
      </section>
    </main>
  );
}
