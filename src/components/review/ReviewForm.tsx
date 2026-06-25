import { useState, useEffect } from 'react'
import { useAppContext } from '@/context/AppContext'
import { getTodayStr } from '@/utils/helpers'
import { ClipboardCheck, Save, Check } from 'lucide-react'

const DAILY_QUESTIONS = [
  { key: 'q1_completed', label: '1. 今天完成了什么？' },
  { key: 'q2_biggest_output', label: '2. 今天最大的输出是什么？' },
  { key: 'q3_underestimated', label: '3. 哪个任务低估了时间？' },
  { key: 'q4_blocker', label: '4. 今天最大的卡点是什么？' },
  { key: 'q5_tomorrow_priority', label: '5. 明天最重要的一件事是什么？' },
]

export function DailyReviewForm() {
  const { state, saveDailyReview } = useAppContext()
  const todayStr = getTodayStr()
  const existing = state.dailyReviews.find(r => r.date === todayStr)

  const [answers, setAnswers] = useState({
    q1_completed: '',
    q2_biggest_output: '',
    q3_underestimated: '',
    q4_blocker: '',
    q5_tomorrow_priority: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (existing) {
      setAnswers({
        q1_completed: existing.q1_completed,
        q2_biggest_output: existing.q2_biggest_output,
        q3_underestimated: existing.q3_underestimated,
        q4_blocker: existing.q4_blocker,
        q5_tomorrow_priority: existing.q5_tomorrow_priority,
      })
    }
  }, [existing])

  const handleSave = () => {
    saveDailyReview(answers)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const allFilled = Object.values(answers).every(a => a.trim())

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <ClipboardCheck size={16} className="text-emerald-400" />
        <h3 className="text-sm font-semibold text-slate-300">每日复盘</h3>
        {existing && <span className="text-[10px] text-emerald-400 ml-auto">今日已复盘 ✓</span>}
      </div>

      {DAILY_QUESTIONS.map(q => (
        <div key={q.key}>
          <label className="text-sm text-slate-400 mb-1.5 block">{q.label}</label>
          <textarea
            value={answers[q.key as keyof typeof answers]}
            onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
            placeholder="写下你的想法..."
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={!allFilled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? 'bg-emerald-600 text-white'
            : allFilled
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? '已保存' : '保存复盘'}
      </button>
    </div>
  )
}

export function WeeklyReviewForm() {
  const { state, saveWeeklyReview } = useAppContext()
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const weekStart = monday.toISOString().slice(0, 10)
  const existing = state.weeklyReviews.find(r => r.weekStart === weekStart)

  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [nextWeekPlan, setNextWeekPlan] = useState(existing?.nextWeekPlan ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveWeeklyReview({ notes, nextWeekPlan })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <ClipboardCheck size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-300">本周复盘（{weekStart} 起）</h3>
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">本周总结</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="回顾这周的进展、收获、不足..."
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">下周计划</label>
        <textarea
          value={nextWeekPlan}
          onChange={e => setNextWeekPlan(e.target.value)}
          placeholder="下周最重要的 3 件事..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? 'bg-blue-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? '已保存' : '保存周复盘'}
      </button>
    </div>
  )
}

export function MonthlyReviewForm() {
  const { state, saveMonthlyReview } = useAppContext()
  const monthStr = new Date().toISOString().slice(0, 7)
  const existing = state.monthlyReviews.find(r => r.month === monthStr)

  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [nextMonthPlan, setNextMonthPlan] = useState(existing?.nextMonthPlan ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveMonthlyReview({ notes, nextMonthPlan })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <ClipboardCheck size={16} className="text-amber-400" />
        <h3 className="text-sm font-semibold text-slate-300">月度复盘（{monthStr}）</h3>
      </div>

      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">本月总结</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="回顾这个月的大进展、关键收获、主要问题..."
          rows={5}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
        />
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1.5 block">下月计划</label>
        <textarea
          value={nextMonthPlan}
          onChange={e => setNextMonthPlan(e.target.value)}
          placeholder="下个月的核心目标..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? 'bg-amber-600 text-white'
            : 'bg-amber-600 text-white hover:bg-amber-500'
        }`}
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? '已保存' : '保存月复盘'}
      </button>
    </div>
  )
}
