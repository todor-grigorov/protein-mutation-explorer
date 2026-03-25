import { useState } from 'react'

const STORAGE_KEY = 'mutation-impact:search-history'
const MAX_HISTORY = 5

export interface SearchHistoryEntry {
  id: string
  variants: string[]
  submittedAt: string
  resultCount: number
}

function loadHistory(): SearchHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history: SearchHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // localStorage might be full or disabled
  }
}

export function useSearchHistory() {
  // Lazy initializer — runs once on mount, never triggers re-render
  const [history, setHistory] = useState<SearchHistoryEntry[]>(loadHistory)

  const addEntry = (variants: string[], resultCount: number) => {
    const entry: SearchHistoryEntry = {
      id: crypto.randomUUID(),
      variants,
      submittedAt: new Date().toISOString(),
      resultCount,
    }

    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      saveHistory(updated)
      return updated
    })
  }

  const removeEntry = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      saveHistory(updated)
      return updated
    })
  }

  const clearHistory = () => {
    saveHistory([])
    setHistory([])
  }

  return { history, addEntry, removeEntry, clearHistory }
}
