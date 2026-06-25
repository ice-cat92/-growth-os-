import { useAppContext } from '@/context/AppContext'
import { calcTodayCompletion, calcTodayTotalMinutes, formatMinutes } from '@/utils/helpers'
import { RingProgress } from '@/components/shared/ProgressBar'
import { OVERLOAD_TASK_COUNT, OVERLOAD_HOURS } from '@/data/constants'
import { AlertTriangle } from 'lucide-react'

export function TodayProgress() {
  const { state } = useAppContext()
  const todayStr = state.currentDate
  const todayTasks = state.tasks.filter(t => t.date === todayStr)
  const { done, total, rate } = calcTodayCompletion(todayTasks)
  const totalMin = calcTodayTotalMinutes(todayTasks)
  const isOverloaded = total > OVERLOAD_TASK_COUNT || totalMin / 60 > OVERLOAD_HOURS

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">今日执行</h3>
        {isOverloaded && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle size={14} />
            计划过载
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <RingProgress value={done} max={Math.max(total, 1)} size={88} color="#10b981" />
        <div className="space-y-2 flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">已完成</span>
            <span className="text-white font-semibold">{done} / {total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">预计总时长</span>
            <span className="text-white">{formatMinutes(totalMin)}</span>
          </div>
          {isOverloaded && (
            <p className="text-xs text-amber-400/80 leading-relaxed">
              今日计划任务 {total > OVERLOAD_TASK_COUNT ? '数量偏多' : '总时长偏长'}，建议考虑拆分或延期低优任务
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
