import { useState, useMemo } from 'react'
import { useAppContext } from '@/context/AppContext'
import { OutputCard } from './OutputCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { OUTPUT_TYPE_LABELS, MAIN_LINE_LABELS, MAIN_LINE_COLORS } from '@/data/constants'
import type { MainLineType, OutputType, Output } from '@/types'
import { Search, X, FileText, ChevronDown, ChevronRight } from 'lucide-react'

const MAIN_LINE_ORDER: MainLineType[] = ['ai', 'english', 'reading']

const MAIN_LINE_SECTION_COLORS: Record<MainLineType, string> = {
  ai: 'border-emerald-500/30',
  english: 'border-blue-500/30',
  reading: 'border-amber-500/30',
}

const MAIN_LINE_ICONS: Record<MainLineType, string> = {
  ai: '🤖',
  english: '🗣️',
  reading: '📚',
}

/** 将输出按照标签中的第一个标签（或类型）分组 */
function groupByTag(outputs: Output[]): Map<string, Output[]> {
  const groups = new Map<string, Output[]>()
  for (const o of outputs) {
    const key = o.tags.length > 0 ? o.tags[0] : OUTPUT_TYPE_LABELS[o.type]
    const existing = groups.get(key)
    if (existing) {
      existing.push(o)
    } else {
      groups.set(key, [o])
    }
  }
  return groups
}

export function OutputPage() {
  const { state } = useAppContext()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<OutputType | 'all'>('all')
  const [filterLine, setFilterLine] = useState<MainLineType | 'all'>('all')
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // 先按条件过滤
  const filtered = useMemo(() => {
    return state.outputs.filter(o => {
      if (filterType !== 'all' && o.type !== filterType) return false
      if (filterLine !== 'all' && o.mainLine !== filterLine) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          o.title.toLowerCase().includes(q) ||
          o.content.toLowerCase().includes(q) ||
          o.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [state.outputs, search, filterType, filterLine])

  // 按主线分组
  const groupedByMainLine = useMemo(() => {
    const map = new Map<MainLineType, Map<string, Output[]>>()
    for (const ml of MAIN_LINE_ORDER) {
      const mlOutputs = filtered.filter(o => o.mainLine === ml)
      if (mlOutputs.length > 0) {
        map.set(ml, groupByTag(mlOutputs))
      }
    }
    return map
  }, [filtered])

  const hasFilters = search || filterType !== 'all' || filterLine !== 'all'
  const totalCount = filtered.length
  const sectionsCount = groupedByMainLine.size

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">输出沉淀</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {totalCount > 0
            ? `全部 ${totalCount} 条输出 · ${sectionsCount} 个板块`
            : '完成任务后，在这里记录你的输出'}
        </p>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索输出内容..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as OutputType | 'all')}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">全部类型</option>
          {(Object.keys(OUTPUT_TYPE_LABELS) as OutputType[]).map(ot => (
            <option key={ot} value={ot}>{OUTPUT_TYPE_LABELS[ot]}</option>
          ))}
        </select>
        <select
          value={filterLine}
          onChange={e => setFilterLine(e.target.value as MainLineType | 'all')}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
        >
          <option value="all">全部板块</option>
          {(Object.keys(MAIN_LINE_LABELS) as MainLineType[]).map(ml => (
            <option key={ml} value={ml}>{MAIN_LINE_LABELS[ml]}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterType('all'); setFilterLine('all') }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={14} /> 清除
          </button>
        )}
      </div>

      {/* 输出内容 — 按板块分组 */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} />}
          title={hasFilters ? '没有匹配结果' : '还没有输出'}
          description={hasFilters ? '尝试调整筛选条件' : '完成任务后，在这里记录你的输出'}
        />
      ) : (
        <div className="space-y-6">
          {MAIN_LINE_ORDER.map(ml => {
            const subgroups = groupedByMainLine.get(ml)
            if (!subgroups) return null

            const sectionKey = ml
            const isCollapsed = collapsedSections.has(sectionKey)
            const colors = MAIN_LINE_COLORS[ml]
            const sectionTotal = Array.from(subgroups.values()).reduce((sum, arr) => sum + arr.length, 0)

            return (
              <div key={ml} className={`bg-slate-900 border rounded-xl overflow-hidden ${MAIN_LINE_SECTION_COLORS[ml]}`}>
                {/* 大板块标题 */}
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-xl">{MAIN_LINE_ICONS[ml]}</span>
                  <div className="flex-1 text-left">
                    <h3 className={`text-base font-bold ${colors.text}`}>
                      {MAIN_LINE_LABELS[ml]}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {sectionTotal} 条输出 · {subgroups.size} 个子分类
                    </p>
                  </div>
                  {isCollapsed
                    ? <ChevronRight size={18} className="text-slate-500" />
                    : <ChevronDown size={18} className="text-slate-500" />
                  }
                </button>

                {/* 子分类 */}
                {!isCollapsed && (
                  <div className="border-t border-slate-800 px-5 pb-5 pt-3 space-y-4">
                    {Array.from(subgroups.entries()).map(([groupName, outputs]) => (
                      <div key={groupName}>
                        {/* 子分类标题 */}
                        <div className="flex items-center gap-2 mb-2 pl-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            ml === 'ai' ? 'bg-emerald-500' :
                            ml === 'english' ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                          <span className="text-xs font-medium text-slate-400">
                            {groupName}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {outputs.length} 条
                          </span>
                        </div>
                        {/* 输出卡片列表 */}
                        <div className="space-y-2">
                          {outputs.map(output => (
                            <OutputCard key={output.id} output={output} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
