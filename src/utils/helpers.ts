import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 格式化日期 "YYYY-MM-DD" → "2026年6月25日 星期四"
export function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return format(d, 'yyyy年M月d日 EEEE', { locale: zhCN })
}

// 格式化日期简短版 → "6月25日 周四"
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return format(d, 'M月d日 EEE', { locale: zhCN })
}

// 格式化 ISO 时间为相对可读格式
export function formatRelativeDate(isoStr: string): string {
  const d = parseISO(isoStr)
  if (isToday(d)) return '今天'
  if (isYesterday(d)) return '昨天'
  return format(d, 'M月d日', { locale: zhCN })
}

// 获取今天的日期字符串
export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// 计算时间差（分钟）
export function timeDiffMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

// 格式化分钟为小时显示
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
}

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// 计算今日完成率
export function calcTodayCompletion(tasks: { status: string }[]): { done: number; total: number; rate: number } {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  return { done, total, rate: total > 0 ? Math.round((done / total) * 100) : 0 }
}

// 计算今日任务总时长（分钟）
export function calcTodayTotalMinutes(tasks: { startTime: string; endTime: string }[]): number {
  return tasks.reduce((sum, t) => sum + timeDiffMinutes(t.startTime, t.endTime), 0)
}

// 计算已投入小时数（针对已完成和进行中的任务）
export function calcInvestedMinutes(tasks: { status: string; startTime: string; endTime: string }[]): number {
  return tasks
    .filter(t => t.status === 'done' || t.status === 'in_progress')
    .reduce((sum, t) => sum + timeDiffMinutes(t.startTime, t.endTime), 0)
}

// 截断文本
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '...'
}
