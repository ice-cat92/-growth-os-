import { useState } from 'react'
import { DailyReviewForm, WeeklyReviewForm, MonthlyReviewForm } from './ReviewForm'
import { useAppContext } from '@/context/AppContext'
import { formatDateShort } from '@/utils/helpers'
import { Calendar } from 'lucide-react'

type TabType = 'daily' | 'weekly' | 'monthly'

export function ReviewPage() {
  const [tab, setTab] = useState<TabType>('daily')
  const { state } = useAppContext()

  const tabs: { key: TabType; label: string }[] = [
    { key: 'daily', label: '每日复盘' },
    { key: 'weekly', label: '每周复盘' },
    { key: 'monthly', label: '每月复盘' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">复盘</h2>
        <p className="text-sm text-slate-500 mt-0.5">目标 → 计划 → 执行 → 输出 → 反馈 → 迭代</p>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 bg-slate-900 rounded-lg p-1 w-fit border border-slate-800">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-slate-700 text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 表单 */}
      {tab === 'daily' && <DailyReviewForm />}
      {tab === 'weekly' && <WeeklyReviewForm />}
      {tab === 'monthly' && <MonthlyReviewForm />}

      {/* 历史记录 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Calendar size={16} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-300">历史{tab === 'daily' ? '每日' : tab === 'weekly' ? '每周' : '每月'}复盘</h3>
        </div>

        {tab === 'daily' && (
          state.dailyReviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">还没有每日复盘记录</p>
          ) : (
            <div className="space-y-3">
              {[...state.dailyReviews].reverse().map(review => (
                <div key={review.date} className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">{formatDateShort(review.date)}</div>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p><span className="text-slate-500">完成：</span>{review.q1_completed}</p>
                    <p><span className="text-slate-500">最大输出：</span>{review.q2_biggest_output}</p>
                    <p><span className="text-slate-500">低估：</span>{review.q3_underestimated}</p>
                    <p><span className="text-slate-500">卡点：</span>{review.q4_blocker}</p>
                    <p><span className="text-slate-500">明天重点：</span>{review.q5_tomorrow_priority}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'weekly' && (
          state.weeklyReviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">还没有每周复盘记录</p>
          ) : (
            <div className="space-y-3">
              {[...state.weeklyReviews].reverse().map(review => (
                <div key={review.weekStart} className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">{review.weekStart} 起</div>
                  <p className="text-sm text-slate-300 mb-2">{review.notes}</p>
                  <p className="text-xs text-slate-500">下周计划：{review.nextWeekPlan}</p>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'monthly' && (
          state.monthlyReviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">还没有每月复盘记录</p>
          ) : (
            <div className="space-y-3">
              {[...state.monthlyReviews].reverse().map(review => (
                <div key={review.month} className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2">{review.month}</div>
                  <p className="text-sm text-slate-300 mb-2">{review.notes}</p>
                  <p className="text-xs text-slate-500">下月计划：{review.nextMonthPlan}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
