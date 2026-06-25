interface ProgressBarProps {
  value: number       // 0-100
  max?: number        // 默认 100
  color?: string      // Tailwind bg class, 如 'bg-emerald-500'
  bgColor?: string    // 背景色，默认 'bg-slate-700'
  height?: string     // 默认 'h-2'
  label?: string
  showPercent?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-emerald-500',
  bgColor = 'bg-slate-700',
  height = 'h-2',
  label,
  showPercent = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showPercent && <span className="text-xs text-slate-500">{pct}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full ${bgColor} ${height} overflow-hidden`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// 环形进度条
export function RingProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = '#10b981',
  bgColor = '#334155',
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const pct = Math.min(value / max, 1)
  const offset = circumference - pct * circumference

  return (
    <svg width={size} height={size} className="ring-progress shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#e2e8f0"
        fontSize={size * 0.22}
        fontWeight="bold"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
        style={{ transformOrigin: 'center' }}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  )
}
