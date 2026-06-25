import { TodayProgress } from './TodayProgress'
import { MainLineCards } from './MainLineCards'
import { TimelineCard } from './TimelineCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export function DashboardPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">仪表盘</h2>
          <p className="text-sm text-slate-500 mt-0.5">目标 → 计划 → 执行 → 输出 → 反馈 → 迭代</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showForm
              ? 'bg-slate-700 text-slate-300'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? '取消' : '添加任务'}
        </button>
      </div>

      {/* 任务添加表单 */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* 今日执行 + 进度概览 */}
      <TodayProgress />

      {/* 三主线进度卡片 */}
      <MainLineCards />

      {/* 今日时间轴 */}
      <TimelineCard />
    </div>
  )
}
