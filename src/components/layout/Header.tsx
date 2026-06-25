import { useAppContext } from '@/context/AppContext'
import { formatDateCN } from '@/utils/helpers'
import { Calendar, Flame } from 'lucide-react'

export function Header() {
  const { state } = useAppContext()
  const todayStr = state.currentDate
  const todayTasks = state.tasks.filter(t => t.date === todayStr)
  const doneCount = todayTasks.filter(t => t.status === 'done').length
  const totalCount = todayTasks.length

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-slate-500" />
          <span className="text-sm text-slate-300">{formatDateCN(todayStr)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Flame size={16} className="text-amber-400" />
            <span className="text-slate-400">
              今日完成{' '}
              <span className="text-white font-semibold">{doneCount}</span>
              <span className="text-slate-600">/{totalCount}</span>
            </span>
          </div>
          <div className="hidden sm:block h-5 w-px bg-slate-700" />
          <div className="hidden sm:block text-xs text-slate-600">
            Growth OS
          </div>
        </div>
      </div>
    </header>
  )
}
