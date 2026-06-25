import { useAppContext } from '@/context/AppContext'
import { MAIN_LINE_COLORS, MAIN_LINE_LABELS } from '@/data/constants'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ArrowRight, Clock, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MainLineCards() {
  const { state } = useAppContext()
  const lines = state.mainLines

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {lines.map(line => {
        const colors = MAIN_LINE_COLORS[line.type]
        return (
          <Link
            key={line.type}
            to="/progress"
            className={`bg-slate-900 border ${colors.border} rounded-xl p-5 hover:bg-slate-800/50 transition-colors group`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${colors.text}`}>
                {MAIN_LINE_LABELS[line.type]}
              </h3>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>

            {/* 月进度 */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">月目标</span>
                <span className={colors.light}>{line.monthProgress}/{line.monthTarget}h</span>
              </div>
              <ProgressBar
                value={line.monthProgress}
                max={line.monthTarget}
                color={colors.fill === '#10b981' ? 'bg-emerald-500' : colors.fill === '#3b82f6' ? 'bg-blue-500' : 'bg-amber-500'}
                height="h-1.5"
              />
            </div>

            {/* 年进度 */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">年进度</span>
                <span className={colors.light}>{line.yearProgress}/{line.yearTarget}h</span>
              </div>
              <ProgressBar
                value={line.yearProgress}
                max={line.yearTarget}
                color="bg-slate-500"
                height="h-1"
              />
            </div>

            {/* 统计 */}
            <div className="flex gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {line.totalHours}h
              </div>
              <div className="flex items-center gap-1">
                <FileText size={12} />
                {line.totalOutputs} 输出
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed line-clamp-1">
              {line.currentStage} → {line.nextMilestone}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
