// ===== 基础类型 =====

export type MainLineType = 'ai' | 'english' | 'reading'

export type TaskType = 'learning' | 'reading' | 'output' | 'exercise' | 'rest' | 'meal' | 'info' | 'review'

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped' | 'delayed'

export type NodeStatus = 'not_started' | 'in_progress' | 'completed' | 'need_review'

export type OutputType = 'note' | 'code' | 'article' | 'reading_card' | 'english_expression' | 'review'

// ===== 核心数据模型 =====

export interface TaskFeedback {
  difficulty: 1 | 2 | 3 | 4 | 5
  focus: 1 | 2 | 3 | 4 | 5
  notes: string
}

export interface Task {
  id: string
  mainLine: MainLineType
  type: TaskType
  title: string
  description: string
  startTime: string   // "HH:mm"
  endTime: string     // "HH:mm"
  inputContent: string
  outputRequirement: string
  completionCriteria: string
  status: TaskStatus
  feedback?: TaskFeedback
  date: string        // "YYYY-MM-DD"
  learningNodeId?: string
  sourceUrl?: string      // 资料链接，点击标题可跳转
  customTitle?: string    // 用户自定义的标题（在分类下具体编辑内容）
}

export interface MainLine {
  type: MainLineType
  label: string
  yearGoal: string
  monthGoal: string
  yearTarget: number
  monthTarget: number
  yearProgress: number
  monthProgress: number
  totalHours: number
  totalOutputs: number
  currentStage: string
  nextMilestone: string
}

export interface LearningNode {
  id: string
  title: string
  sourceUrl: string
  status: NodeStatus
  progress: number       // 0-100
  estimatedWeeks: string
  relatedTaskIds: string[]
  children: LearningNode[]
}

export interface Output {
  id: string
  type: OutputType
  title: string
  content: string
  tags: string[]
  mainLine: MainLineType
  taskId?: string
  learningNodeId?: string
  createdAt: string       // ISO datetime
}

export interface DailyReview {
  date: string
  q1_completed: string
  q2_biggest_output: string
  q3_underestimated: string
  q4_blocker: string
  q5_tomorrow_priority: string
}

export interface WeeklyReview {
  weekStart: string
  notes: string
  nextWeekPlan: string
}

export interface MonthlyReview {
  month: string
  notes: string
  nextMonthPlan: string
}

// ===== 应用全局状态 =====

export interface AppState {
  tasks: Task[]
  mainLines: MainLine[]
  learningNodes: LearningNode[]
  outputs: Output[]
  dailyReviews: DailyReview[]
  weeklyReviews: WeeklyReview[]
  monthlyReviews: MonthlyReview[]
  currentDate: string
}

// ===== Reducer Actions =====

export type AppAction =
  | { type: 'INIT_STATE'; payload: AppState }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TASK_STATUS'; payload: { id: string; status: TaskStatus; feedback?: TaskFeedback } }
  | { type: 'ADD_OUTPUT'; payload: Output }
  | { type: 'DELETE_OUTPUT'; payload: string }
  | { type: 'ADD_DAILY_REVIEW'; payload: DailyReview }
  | { type: 'ADD_WEEKLY_REVIEW'; payload: WeeklyReview }
  | { type: 'ADD_MONTHLY_REVIEW'; payload: MonthlyReview }
  | { type: 'UPDATE_MAIN_LINE'; payload: { type: MainLineType; updates: Partial<MainLine> } }
  | { type: 'UPDATE_LEARNING_NODE'; payload: { id: string; updates: Partial<LearningNode> } }
  | { type: 'SET_CURRENT_DATE'; payload: string }
