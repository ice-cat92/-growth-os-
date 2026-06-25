import { useAppContext } from '@/context/AppContext'
import { TaskCard } from '@/components/tasks/TaskCard'
import { Clock } from 'lucide-react'

export function TimelineCard() {
  const { state } = useAppContext()
  const todayStr = state.currentDate
  const todayTasks = state.tasks.filter(t => t.date === todayStr)

  // 按开始时间排序
  const sorted = [...todayTasks].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">今日时间轴</h3>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">暂无今日任务，去仪表盘添加吧</p>
      ) : (
        <div className="space-y-1 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
          {sorted.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
