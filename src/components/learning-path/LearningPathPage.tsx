import { useAppContext } from '@/context/AppContext'
import { TreeNode } from './TreeNode'
import { Network } from 'lucide-react'

export function LearningPathPage() {
  const { state } = useAppContext()

  const completedCount = countCompleted(state.learningNodes)
  const totalCount = countTotal(state.learningNodes)
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI 学习路径</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          基于 awesome-agentic-ai-zh · Track A — Agent Builder · 已学习 {pct}%（{completedCount}/{totalCount} 节点）
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Network size={16} className="text-emerald-400" />
          <span className="text-sm text-slate-300 font-medium">Track A — Agent Builder 完整路径</span>
          <span className="text-[10px] text-slate-600 ml-auto">点击节点展开/折叠</span>
        </div>

        {state.learningNodes.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}

function countTotal(nodes: { children: { id: string }[] }[]): number {
  let count = nodes.length
  for (const n of nodes) {
    if (n.children.length > 0) {
      count += countTotal(n.children)
    }
  }
  return count
}

function countCompleted(nodes: { status: string; children: { status: string; children: any[] }[] }[]): number {
  let count = nodes.filter(n => n.status === 'completed').length
  for (const n of nodes) {
    if (n.children.length > 0) {
      count += countCompleted(n.children)
    }
  }
  return count
}
