import { useAppContext } from '@/context/AppContext'
import { MAIN_LINE_COLORS, MAIN_LINE_LABELS } from '@/data/constants'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { Clock, FileText, Target, Milestone, TrendingUp } from 'lucide-react'
import type { MainLine } from '@/types'

function LineDetail({ line }: { line: MainLine }) {
  const colors = MAIN_LINE_COLORS[line.type]
  const yearPct = Math.round((line.yearProgress / line.yearTarget) * 100)
  const monthPct = Math.round((line.monthProgress / line.monthTarget) * 100)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          line.type === 'ai' ? 'bg-emerald-500' :
          line.type === 'english' ? 'bg-blue-500' : 'bg-amber-500'
        }`} />
        <h3 className={`text-lg font-bold ${colors.text}`}>
          {MAIN_LINE_LABELS[line.type]}
        </h3>
      </div>

      {/* 目标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">年目标</span>
            <span className={`text-xs ${colors.light} ml-auto`}>{yearPct}%</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">{line.yearGoal}</p>
          <ProgressBar
            value={line.yearProgress}
            max={line.yearTarget}
            color={line.type === 'ai' ? 'bg-emerald-500' : line.type === 'english' ? 'bg-blue-500' : 'bg-amber-500'}
            showPercent
            label={`年度 ${line.yearProgress}/${line.yearTarget}h`}
          />
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Milestone size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500">月目标</span>
            <span className={`text-xs ${colors.light} ml-auto`}>{monthPct}%</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">{line.monthGoal}</p>
          <ProgressBar
            value={line.monthProgress}
            max={line.monthTarget}
            color="bg-emerald-400"
            showPercent
            label={`本月 ${line.monthProgress}/${line.monthTarget}h`}
          />
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <Clock size={16} className="text-slate-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{line.totalHours}</div>
          <div className="text-[10px] text-slate-500">累计小时</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <FileText size={16} className="text-slate-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{line.totalOutputs}</div>
          <div className="text-[10px] text-slate-500">输出数量</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <TrendingUp size={16} className="text-slate-500 mx-auto mb-1" />
          <div className={`text-sm font-bold ${colors.text} truncate`}>{line.currentStage}</div>
          <div className="text-[10px] text-slate-500">当前阶段</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 text-center">
          <Target size={16} className="text-slate-500 mx-auto mb-1" />
          <div className="text-sm font-bold text-slate-300 truncate">{line.nextMilestone}</div>
          <div className="text-[10px] text-slate-500">下一个里程碑</div>
        </div>
      </div>
    </div>
  )
}

export function MainLinePage() {
  const { state } = useAppContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">主线进度</h2>
        <p className="text-sm text-slate-500 mt-0.5">三条主线的年目标、月目标、进度与里程碑</p>
      </div>

      <div className="space-y-6">
        {state.mainLines.map(line => (
          <LineDetail key={line.type} line={line} />
        ))}
      </div>
    </div>
  )
}
