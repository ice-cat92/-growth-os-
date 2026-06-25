import type { Output } from '@/types'
import { OUTPUT_TYPE_LABELS } from '@/data/constants'
import { formatRelativeDate } from '@/utils/helpers'
import { FileText, Tag, Link as LinkIcon, Trash2 } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'

const TYPE_ICONS: Record<string, string> = {
  note: '📝',
  code: '💻',
  article: '📄',
  reading_card: '📇',
  english_expression: '🗣️',
  review: '🔄',
}

export function OutputCard({ output }: { output: Output }) {
  const { deleteOutput } = useAppContext()

  const mainLineColor =
    output.mainLine === 'ai' ? 'border-emerald-500/30 bg-emerald-500/5' :
    output.mainLine === 'english' ? 'border-blue-500/30 bg-blue-500/5' :
    'border-amber-500/30 bg-amber-500/5'

  return (
    <div className={`bg-slate-900 border rounded-xl p-4 hover:border-slate-700 transition-colors ${mainLineColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{TYPE_ICONS[output.type] ?? '📝'}</span>
            <h4 className="text-sm font-medium text-slate-200 truncate">{output.title}</h4>
            <span className="text-[10px] text-slate-600 bg-slate-800 rounded-full px-2 py-0.5">
              {OUTPUT_TYPE_LABELS[output.type]}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {output.content}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[10px] text-slate-500">{formatRelativeDate(output.createdAt)}</span>

            {output.tags.map(tag => (
              <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-slate-800 text-slate-400 rounded-full px-2 py-0.5">
                <Tag size={8} />
                {tag}
              </span>
            ))}

            {(output.taskId || output.learningNodeId) && (
              <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
                <LinkIcon size={8} />
                已关联
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteOutput(output.id)}
          className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
