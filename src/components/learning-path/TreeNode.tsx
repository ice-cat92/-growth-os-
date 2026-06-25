import { useState } from 'react'
import type { LearningNode } from '@/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ChevronRight, ChevronDown, ExternalLink, Clock } from 'lucide-react'

interface TreeNodeProps {
  node: LearningNode
  level?: number
}

export function TreeNode({ node, level = 0 }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 2)
  const hasChildren = node.children.length > 0

  const getNodeColor = () => {
    switch (node.status) {
      case 'completed': return 'bg-emerald-500'
      case 'in_progress': return 'bg-blue-500'
      case 'need_review': return 'bg-amber-500'
      default: return 'bg-slate-600'
    }
  }

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors ${level > 0 ? 'ml-6' : ''}`}
        style={{ paddingLeft: `${8 + level * 24}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* 展开/折叠图标 */}
        {hasChildren ? (
          expanded
            ? <ChevronDown size={14} className="text-slate-500 shrink-0" />
            : <ChevronRight size={14} className="text-slate-500 shrink-0" />
        ) : (
          <div className="w-[14px] shrink-0" />
        )}

        {/* 状态点 */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${getNodeColor()}`} />

        {/* 标题 */}
        <span className={`text-sm flex-1 truncate ${
          node.status === 'completed' ? 'text-slate-400' :
          node.status === 'in_progress' ? 'text-white font-medium' :
          'text-slate-300'
        }`}>
          {node.title}
        </span>

        {/* 进度 */}
        {node.progress > 0 && node.progress < 100 && (
          <div className="w-20 shrink-0 hidden md:block">
            <ProgressBar value={node.progress} height="h-1" color="bg-emerald-500" />
          </div>
        )}
        {node.progress === 100 && (
          <span className="text-[10px] text-emerald-400 shrink-0">✓</span>
        )}

        {/* 状态标签 */}
        <StatusBadge status={node.status} type="node" size="sm" />

        {/* 链接 */}
        {node.sourceUrl && (
          <a
            href={node.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && expanded && (
        <div className="border-l border-slate-800 ml-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}

      {/* 扩展信息 */}
      {expanded && node.estimatedWeeks && (
        <div className="ml-14 mb-1 flex items-center gap-1 text-[10px] text-slate-600">
          <Clock size={10} />
          {node.estimatedWeeks}
        </div>
      )}
    </div>
  )
}
