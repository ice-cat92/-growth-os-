import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Route, Network, FileText, ClipboardCheck } from 'lucide-react'

const navItems = [
  { to: '/',         icon: LayoutDashboard,  label: '仪表盘' },
  { to: '/today',    icon: ListTodo,         label: '今日执行' },
  { to: '/progress', icon: Route,            label: '主线进度' },
  { to: '/learning', icon: Network,           label: '学习路径' },
  { to: '/output',   icon: FileText,          label: '输出沉淀' },
  { to: '/review',   icon: ClipboardCheck,    label: '复盘' },
]

export function Sidebar() {
  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:flex flex-col w-56 bg-slate-900 border-r border-slate-800 min-h-screen shrink-0">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-white">Growth</span>
            <span className="text-emerald-400"> OS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">个人成长操作系统</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-600">
          Growth OS v0.1.0
        </div>
      </aside>

      {/* 移动端底部导航 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50">
        <div className="flex justify-around py-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-500'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
