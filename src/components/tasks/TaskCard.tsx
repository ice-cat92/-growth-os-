import { useState } from 'react'
import type { Task, TaskFeedback } from '@/types'
import { useAppContext } from '@/context/AppContext'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { MAIN_LINE_COLORS, TASK_TYPE_LABELS } from '@/data/constants'
import { timeDiffMinutes, formatMinutes } from '@/utils/helpers'
import {
  Play, CheckCircle, SkipForward, HelpCircle,
  ChevronDown, ChevronUp, Trash2, ExternalLink, Pencil, RotateCcw
} from 'lucide-react'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, skipTask, delayTask, startTask, deleteTask, dispatch } = useAppContext()
  const [expanded, setExpanded] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editValue, setEditValue] = useState(task.customTitle || task.title)
  const [feedback, setFeedback] = useState<TaskFeedback>({
    difficulty: 3, focus: 3, notes: ''
  })

  const colors = MAIN_LINE_COLORS[task.mainLine]
  const duration = timeDiffMinutes(task.startTime, task.endTime)
  const displayTitle = task.customTitle || task.title

  const handleComplete = () => {
    completeTask(task.id, feedback)
    setShowFeedback(false)
    setShowRecovery(false)
  }

  const handleSkip = () => {
    skipTask(task.id, feedback)
    setShowFeedback(false)
    setShowRecovery(false)
  }

  const handleDelay = () => {
    delayTask(task.id, feedback)
    setShowFeedback(false)
    setShowRecovery(false)
  }

  const handleStart = () => {
    startTask(task.id)
  }

  const handleUndoComplete = () => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { id: task.id, status: 'pending' } })
  }

  const handleSaveTitle = () => {
    const trimmed = editValue.trim()
    if (trimmed) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: task.id, updates: { customTitle: trimmed } },
      })
    }
    setEditingTitle(false)
  }

  // 点击标题：有链接则跳转，否则展开
  const handleTitleClick = (e: React.MouseEvent) => {
    if (task.sourceUrl) {
      e.stopPropagation()
      window.open(task.sourceUrl, '_blank', 'noopener')
    } else {
      setExpanded(!expanded)
    }
  }

  return (
    <div className={`relative pl-8 py-2 group ${task.status === 'skipped' ? 'opacity-50' : ''}`}>
      {/* 时间轴上的点 */}
      <div className={`absolute left-[11px] top-[14px] w-2.5 h-2.5 rounded-full border-2 z-10 transition-colors ${
        task.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
        task.status === 'in_progress' ? 'bg-blue-500 border-blue-500 animate-pulse' :
        task.status === 'delayed' ? 'bg-amber-500 border-amber-500' :
        task.status === 'skipped' ? 'bg-slate-600 border-slate-600' :
        'bg-slate-700 border-slate-600'
      }`} />

      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
        {/* 主行 */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div
            className={`w-1.5 h-8 rounded-full shrink-0 ${
              task.mainLine === 'ai' ? 'bg-emerald-500' :
              task.mainLine === 'english' ? 'bg-blue-500' : 'bg-amber-500'
            }`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* 标题区域：可点击跳转；可编辑 */}
              {editingTitle ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveTitle()
                    if (e.key === 'Escape') { setEditValue(task.customTitle || task.title); setEditingTitle(false) }
                  }}
                  onClick={e => e.stopPropagation()}
                  className="flex-1 bg-slate-700 border border-emerald-500/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none"
                  autoFocus
                />
              ) : (
                <h4
                  className={`text-sm font-medium truncate group/title ${
                    task.status === 'done' ? 'text-slate-400' : 'text-slate-200'
                  } ${task.sourceUrl ? 'hover:text-emerald-400 cursor-pointer underline decoration-dotted underline-offset-2' : ''}`}
                  onClick={handleTitleClick}
                  title={task.sourceUrl ? `点击打开：${task.sourceUrl}` : '点击展开详情'}
                >
                  {displayTitle}
                  {task.sourceUrl && (
                    <ExternalLink size={10} className="inline ml-1 text-slate-600 group-hover/title:text-emerald-400" />
                  )}
                  {!task.sourceUrl && (
                    <span className="text-[10px] text-slate-600 ml-1">（点击展开）</span>
                  )}
                </h4>
              )}

              {/* 编辑标题按钮 */}
              {!editingTitle && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setEditValue(task.customTitle || task.title)
                    setEditingTitle(true)
                  }}
                  className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
                  title="编辑任务标题"
                >
                  <Pencil size={12} />
                </button>
              )}

              <StatusBadge status={task.status} />
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
              <span>{task.startTime} - {task.endTime}</span>
              <span>{formatMinutes(duration)}</span>
              <span>{TASK_TYPE_LABELS[task.type]}</span>
              <span className={colors.light}>{task.mainLine === 'ai' ? 'AI' : task.mainLine === 'english' ? '英语' : '阅读'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {expanded ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
          </div>
        </div>

        {/* 展开区域 */}
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-slate-700/30 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">输入：</span>
                <span className="text-slate-300">{task.inputContent || '无'}</span>
              </div>
              <div>
                <span className="text-slate-500">输出要求：</span>
                <span className="text-slate-300">{task.outputRequirement || '无'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500">完成标准：</span>
                <span className="text-slate-300">{task.completionCriteria}</span>
              </div>
              {task.sourceUrl && (
                <div className="md:col-span-2">
                  <span className="text-slate-500">资料链接：</span>
                  <a
                    href={task.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline break-all"
                    onClick={e => e.stopPropagation()}
                  >
                    {task.sourceUrl}
                  </a>
                </div>
              )}
            </div>

            {/* 操作按钮 — 所有任务都显示 */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* 未开始的任务：显示"开始"按钮 */}
              {(task.status === 'pending' || task.status === 'delayed') && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
                >
                  <Play size={12} /> 开始
                </button>
              )}

              {/* 所有任务都显示"完成"按钮（已完成可撤销） */}
              {task.status !== 'done' ? (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
                >
                  <CheckCircle size={12} /> 完成
                </button>
              ) : (
                <button
                  onClick={handleUndoComplete}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 text-xs hover:bg-slate-500/20 transition-colors"
                >
                  <RotateCcw size={12} /> 撤销完成
                </button>
              )}

              {/* 所有任务都显示"需要帮助"按钮 */}
              <button
                onClick={() => setShowRecovery(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs hover:bg-amber-500/20 transition-colors"
              >
                <HelpCircle size={12} /> 需要帮助
              </button>

              {/* 删除按钮 */}
              <button
                onClick={() => deleteTask(task.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors ml-auto"
              >
                <Trash2 size={12} /> 删除
              </button>
            </div>

            {/* 反馈表单 */}
            {showFeedback && (
              <div className="bg-slate-700/30 rounded-lg p-3 space-y-3">
                <p className="text-xs text-slate-400 font-medium">任务反馈</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500">难度（1-5）</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setFeedback(f => ({ ...f, difficulty: n as TaskFeedback['difficulty'] }))}
                          className={`w-6 h-6 rounded text-[10px] transition-colors ${
                            feedback.difficulty === n ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">专注度（1-5）</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setFeedback(f => ({ ...f, focus: n as TaskFeedback['focus'] }))}
                          className={`w-6 h-6 rounded text-[10px] transition-colors ${
                            feedback.focus === n ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  className="w-full bg-slate-700 rounded-lg p-2 text-xs text-slate-300 placeholder-slate-500 border border-slate-600 resize-none"
                  rows={2}
                  placeholder="记录感受、卡点、收获..."
                  value={feedback.notes}
                  onChange={e => setFeedback(f => ({ ...f, notes: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleComplete}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 transition-colors"
                  >
                    ✓ 完成
                  </button>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-600 text-slate-300 text-xs hover:bg-slate-500 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {/* 失败恢复弹窗 */}
            {showRecovery && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 space-y-3">
                <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <HelpCircle size={12} /> 需要帮助吗？
                </p>
                <p className="text-xs text-slate-400">这个任务遇到了什么困难？选择一种处理方式：</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      skipTask(task.id, { ...feedback, notes: '需要拆小重排：' + feedback.notes })
                      setShowRecovery(false)
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors"
                  >
                    ✂️ 拆小（标记跳过，建议拆分后重新添加）
                  </button>
                  <button
                    onClick={handleDelay}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-400 text-xs hover:bg-amber-600/30 transition-colors"
                  >
                    ⏰ 延期到明天
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-3 py-1.5 rounded-lg bg-slate-600/50 text-slate-400 text-xs hover:bg-slate-600 transition-colors"
                  >
                    ⏭️ 跳过
                  </button>
                </div>
                <textarea
                  className="w-full bg-slate-700 rounded-lg p-2 text-xs text-slate-300 placeholder-slate-500 border border-slate-600 resize-none"
                  rows={1}
                  placeholder="记录原因（可选）"
                  value={feedback.notes}
                  onChange={e => setFeedback(f => ({ ...f, notes: e.target.value }))}
                />
                <button
                  onClick={() => setShowRecovery(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  关闭
                </button>
              </div>
            )}

            {/* 已有反馈展示 */}
            {task.feedback && !showFeedback && (
              <div className="bg-slate-700/20 rounded-lg p-2 text-xs text-slate-500 flex items-center gap-4">
                <span>难度：{'⭐'.repeat(task.feedback.difficulty)}</span>
                <span>专注：{'🔵'.repeat(task.feedback.focus)}</span>
                {task.feedback.notes && <span className="text-slate-400">"{task.feedback.notes}"</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
