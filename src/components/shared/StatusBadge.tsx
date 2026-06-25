import type { TaskStatus, NodeStatus } from '@/types'
import { TASK_STATUS_LABELS, NODE_STATUS_LABELS, NODE_STATUS_COLORS } from '@/data/constants'

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending:     'bg-slate-700/50 text-slate-400 border-slate-600',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  done:        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  skipped:     'bg-slate-700/50 text-slate-500 border-slate-600 line-through',
  delayed:     'bg-amber-500/10 text-amber-400 border-amber-500/30',
}

interface StatusBadgeProps {
  status: TaskStatus | NodeStatus
  type?: 'task' | 'node'
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, type = 'task', size = 'sm' }: StatusBadgeProps) {
  const label = type === 'node' ? NODE_STATUS_LABELS[status as NodeStatus] : TASK_STATUS_LABELS[status]
  const style = type === 'node'
    ? NODE_STATUS_COLORS[status as NodeStatus] + ' border border-transparent'
    : STATUS_STYLES[status as TaskStatus] + ' border'

  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${style}`}>
      {label}
    </span>
  )
}
