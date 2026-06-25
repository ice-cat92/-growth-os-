import { useState } from 'react'
import type { MainLineType, TaskType } from '@/types'
import { useAppContext } from '@/context/AppContext'
import { MAIN_LINE_LABELS, TASK_TYPE_LABELS } from '@/data/constants'
import { Plus, X } from 'lucide-react'

interface TaskFormProps {
  onClose?: () => void
}

const DEFAULT_TIMES: Record<number, { start: string; end: string }> = {
  0: { start: '09:00', end: '10:30' },
  1: { start: '10:45', end: '12:00' },
  2: { start: '14:00', end: '15:00' },
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { addTask, state } = useAppContext()
  const todayTasks = state.tasks.filter(t => t.date === state.currentDate)
  const nextSlot = DEFAULT_TIMES[Math.min(todayTasks.length, 2)]

  const [mainLine, setMainLine] = useState<MainLineType>('ai')
  const [type, setType] = useState<TaskType>('learning')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState(nextSlot.start)
  const [endTime, setEndTime] = useState(nextSlot.end)
  const [inputContent, setInputContent] = useState('')
  const [outputRequirement, setOutputRequirement] = useState('')
  const [completionCriteria, setCompletionCriteria] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      mainLine,
      type,
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime,
      inputContent: inputContent.trim(),
      outputRequirement: outputRequirement.trim(),
      completionCriteria: completionCriteria.trim(),
      sourceUrl: sourceUrl.trim(),
    })

    // 重置表单
    setTitle('')
    setDescription('')
    setInputContent('')
    setOutputRequirement('')
    setCompletionCriteria('')
    setSourceUrl('')
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Plus size={16} className="text-emerald-400" />
          添加今日任务
        </h3>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 标题 */}
        <div className="md:col-span-2">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="任务标题 *"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            required
          />
        </div>

        {/* 主线 */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">所属主线</label>
          <select
            value={mainLine}
            onChange={e => setMainLine(e.target.value as MainLineType)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          >
            {(Object.keys(MAIN_LINE_LABELS) as MainLineType[]).map(ml => (
              <option key={ml} value={ml}>{MAIN_LINE_LABELS[ml]}</option>
            ))}
          </select>
        </div>

        {/* 任务类型 */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">任务类型</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as TaskType)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          >
            {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map(tt => (
              <option key={tt} value={tt}>{TASK_TYPE_LABELS[tt]}</option>
            ))}
          </select>
        </div>

        {/* 时间 */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">开始时间</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">结束时间</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* 输入内容 */}
        <div className="md:col-span-2">
          <label className="text-xs text-slate-500 mb-1 block">输入内容（要阅读/观看的资料）</label>
          <input
            type="text"
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            placeholder="例如：Anthropic Tool Use 英文文档"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* 输出要求 */}
        <div className="md:col-span-2">
          <label className="text-xs text-slate-500 mb-1 block">输出要求</label>
          <input
            type="text"
            value={outputRequirement}
            onChange={e => setOutputRequirement(e.target.value)}
            placeholder="例如：一篇笔记 / 一段代码 / 一张思维导图"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* 完成标准 */}
        <div className="md:col-span-2">
          <label className="text-xs text-slate-500 mb-1 block">完成标准（怎么判断做完了？）</label>
          <input
            type="text"
            value={completionCriteria}
            onChange={e => setCompletionCriteria(e.target.value)}
            placeholder="例如：能不看资料用自己的话讲出来"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* 资料链接 */}
        <div className="md:col-span-2">
          <label className="text-xs text-slate-500 mb-1 block">资料链接（点击标题跳转）</label>
          <input
            type="url"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            placeholder="例如：https://docs.anthropic.com/..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* 备注 */}
        <div className="md:col-span-2">
          <label className="text-xs text-slate-500 mb-1 block">备注</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="其他说明（可选）"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
      >
        添加任务
      </button>
    </form>
  )
}
