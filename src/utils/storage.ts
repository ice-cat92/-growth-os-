import type { AppState } from '@/types'

const STORAGE_KEY = 'growth-os-state'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AppState
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('保存状态失败：localStorage 可能已满', e)
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
