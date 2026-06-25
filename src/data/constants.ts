import type { MainLineType, TaskType, OutputType, NodeStatus } from '@/types'

// 主线颜色映射
export const MAIN_LINE_COLORS: Record<MainLineType, { bg: string; text: string; border: string; light: string; fill: string }> = {
  ai:        { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', light: 'text-emerald-300', fill: '#10b981' },
  english:   { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30',    light: 'text-blue-300',    fill: '#3b82f6' },
  reading:   { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30',   light: 'text-amber-300',   fill: '#f59e0b' },
}

// 主线中文标签
export const MAIN_LINE_LABELS: Record<MainLineType, string> = {
  ai:      'AI 深度学习',
  english: '英语提升',
  reading: '阅读积累',
}

// 任务类型中文
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  learning:  '学习',
  reading:   '阅读',
  output:    '输出',
  exercise:  '锻炼',
  rest:      '休息',
  meal:      '吃饭',
  info:      '资讯',
  review:    '复盘',
}

// 任务类型图标（lucide icon names）
export const TASK_TYPE_ICONS: Record<TaskType, string> = {
  learning:  'BookOpen',
  reading:   'BookMarked',
  output:    'PenTool',
  exercise:  'Dumbbell',
  rest:      'Coffee',
  meal:      'Utensils',
  info:      'Globe',
  review:    'ClipboardCheck',
}

// 任务状态中文
export const TASK_STATUS_LABELS: Record<string, string> = {
  pending:     '未开始',
  in_progress: '进行中',
  done:        '已完成',
  skipped:     '已跳过',
  delayed:     '已延期',
}

// 输出类型中文
export const OUTPUT_TYPE_LABELS: Record<OutputType, string> = {
  note:               '笔记',
  code:               '代码',
  article:            '文章',
  reading_card:       '读书卡片',
  english_expression: '英语表达',
  review:             '复盘',
}

// 学习路径节点状态
export const NODE_STATUS_LABELS: Record<NodeStatus, string> = {
  not_started:  '未开始',
  in_progress:  '学习中',
  completed:    '已完成',
  need_review:  '需要复习',
}

export const NODE_STATUS_COLORS: Record<NodeStatus, string> = {
  not_started:  'bg-slate-600 text-slate-400',
  in_progress:  'bg-blue-500/20 text-blue-400',
  completed:    'bg-emerald-500/20 text-emerald-400',
  need_review:  'bg-amber-500/20 text-amber-400',
}

// 任务过载阈值
export const OVERLOAD_TASK_COUNT = 8
export const OVERLOAD_HOURS = 10
