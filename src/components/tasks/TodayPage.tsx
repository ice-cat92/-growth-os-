import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { TodayProgress } from '@/components/dashboard/TodayProgress'
import { TimelineCard } from '@/components/dashboard/TimelineCard'
import { TaskForm } from './TaskForm'
import { Plus, X } from 'lucide-react'

export function TodayPage() {
  const { state } = useAppContext()
  const todayStr = state.currentDate
  const todayTasks = state.tasks.filter(t => t.date === todayStr)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">今日执行</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {todayTasks.length} 个任务 · 按时间轴排列
          </p>
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

      {/* 今日进度概览 */}
      <TodayProgress />

      {/* 今日时间轴 */}
      <TimelineCard />
    </div>
  )
}
