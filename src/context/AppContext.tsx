import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState, AppAction, Task, TaskStatus, TaskFeedback, Output, DailyReview, WeeklyReview, MonthlyReview, MainLineType, LearningNode } from '@/types'
import { getInitialState } from '@/data/mockData'
import { saveState } from '@/utils/storage'
import { generateId, getTodayStr } from '@/utils/helpers'

// ===== Reducer =====
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_STATE':
      return action.payload

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case 'SET_TASK_STATUS': {
      const { id, status, feedback } = action.payload
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === id ? { ...t, status, ...(feedback ? { feedback } : {}) } : t
        ),
      }
    }

    case 'ADD_OUTPUT':
      return { ...state, outputs: [...state.outputs, action.payload] }

    case 'DELETE_OUTPUT':
      return { ...state, outputs: state.outputs.filter(o => o.id !== action.payload) }

    case 'ADD_DAILY_REVIEW':
      return {
        ...state,
        dailyReviews: [
          ...state.dailyReviews.filter(r => r.date !== action.payload.date),
          action.payload,
        ],
      }

    case 'ADD_WEEKLY_REVIEW':
      return {
        ...state,
        weeklyReviews: [
          ...state.weeklyReviews.filter(r => r.weekStart !== action.payload.weekStart),
          action.payload,
        ],
      }

    case 'ADD_MONTHLY_REVIEW':
      return {
        ...state,
        monthlyReviews: [
          ...state.monthlyReviews.filter(r => r.month !== action.payload.month),
          action.payload,
        ],
      }

    case 'UPDATE_MAIN_LINE':
      return {
        ...state,
        mainLines: state.mainLines.map(ml =>
          ml.type === action.payload.type ? { ...ml, ...action.payload.updates } : ml
        ),
      }

    case 'UPDATE_LEARNING_NODE': {
      const updateNode = (nodes: LearningNode[]): LearningNode[] =>
        nodes.map(n => {
          if (n.id === action.payload.id) return { ...n, ...action.payload.updates }
          if (n.children.length > 0) return { ...n, children: updateNode(n.children) }
          return n
        })
      return { ...state, learningNodes: updateNode(state.learningNodes) }
    }

    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload }

    default:
      return state
  }
}

// ===== Context =====
interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // 便捷方法
  addTask: (task: Omit<Task, 'id' | 'status' | 'date'>) => void
  completeTask: (id: string, feedback: TaskFeedback) => void
  skipTask: (id: string, feedback: TaskFeedback) => void
  delayTask: (id: string, feedback: TaskFeedback) => void
  startTask: (id: string) => void
  deleteTask: (id: string) => void
  addOutput: (output: Omit<Output, 'id' | 'createdAt'>) => void
  saveDailyReview: (review: Omit<DailyReview, 'date'>) => void
  saveWeeklyReview: (review: Omit<WeeklyReview, 'weekStart'>) => void
  saveMonthlyReview: (review: Omit<MonthlyReview, 'month'>) => void
  updateLearningNode: (id: string, updates: Partial<LearningNode>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

// ===== Provider =====
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, () => getInitialState())

  // 每次状态变化自动持久化到 localStorage
  useEffect(() => {
    saveState(state)
  }, [state])

  const addTask = (task: Omit<Task, 'id' | 'status' | 'date'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      status: 'pending',
      date: getTodayStr(),
    }
    dispatch({ type: 'ADD_TASK', payload: newTask })
  }

  const completeTask = (id: string, feedback: TaskFeedback) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { id, status: 'done', feedback } })
  }

  const skipTask = (id: string, feedback: TaskFeedback) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { id, status: 'skipped', feedback } })
  }

  const delayTask = (id: string, feedback: TaskFeedback) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { id, status: 'delayed', feedback } })
  }

  const startTask = (id: string) => {
    dispatch({ type: 'SET_TASK_STATUS', payload: { id, status: 'in_progress' } })
  }

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }

  const addOutput = (output: Omit<Output, 'id' | 'createdAt'>) => {
    const newOutput: Output = {
      ...output,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_OUTPUT', payload: newOutput })
  }

  const saveDailyReview = (review: Omit<DailyReview, 'date'>) => {
    dispatch({
      type: 'ADD_DAILY_REVIEW',
      payload: { ...review, date: getTodayStr() },
    })
  }

  const saveWeeklyReview = (review: Omit<WeeklyReview, 'weekStart'>) => {
    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    dispatch({
      type: 'ADD_WEEKLY_REVIEW',
      payload: { ...review, weekStart: monday.toISOString().slice(0, 10) },
    })
  }

  const saveMonthlyReview = (review: Omit<MonthlyReview, 'month'>) => {
    const monthStr = new Date().toISOString().slice(0, 7)
    dispatch({
      type: 'ADD_MONTHLY_REVIEW',
      payload: { ...review, month: monthStr },
    })
  }

  const updateLearningNode = (id: string, updates: Partial<LearningNode>) => {
    dispatch({ type: 'UPDATE_LEARNING_NODE', payload: { id, updates } })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        completeTask,
        skipTask,
        delayTask,
        startTask,
        deleteTask,
        addOutput,
        saveDailyReview,
        saveWeeklyReview,
        saveMonthlyReview,
        updateLearningNode,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ===== Hook =====
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
