import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearchHistory } from '@/hooks/useSearchHistory'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock crypto.randomUUID
let uuidCounter = 0
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => `mock-uuid-${++uuidCounter}`),
})

beforeEach(() => {
  localStorageMock.clear()
  vi.clearAllMocks()
  uuidCounter = 0
})

describe('useSearchHistory', () => {
  describe('initial state', () => {
    it('returns empty history when localStorage is empty', () => {
      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.history).toEqual([])
    })

    it('loads existing history from localStorage', () => {
      const existing = [
        {
          id: 'existing-1',
          variants: ['Q7Z4H8/A126C'],
          submittedAt: new Date().toISOString(),
          resultCount: 1,
        },
      ]
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existing))

      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].id).toBe('existing-1')
    })

    it('returns empty history when localStorage contains invalid JSON', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid-json{')
      const { result } = renderHook(() => useSearchHistory())
      expect(result.current.history).toEqual([])
    })
  })

  describe('addEntry', () => {
    it('adds a new entry to history', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })

      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].variants).toEqual(['Q7Z4H8/A126C'])
      expect(result.current.history[0].resultCount).toBe(1)
    })

    it('adds new entries at the beginning', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })
      act(() => {
        result.current.addEntry(['P12235/G100A'], 2)
      })

      expect(result.current.history[0].variants).toEqual(['P12235/G100A'])
      expect(result.current.history[1].variants).toEqual(['Q7Z4H8/A126C'])
    })

    it('persists entry to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
      const saved = JSON.parse(localStorageMock.setItem.mock.calls[0][1] as string)
      expect(saved[0].variants).toEqual(['Q7Z4H8/A126C'])
    })

    it('does not exceed MAX_HISTORY of 5 entries', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        for (let i = 0; i < 7; i++) {
          result.current.addEntry([`Q7Z4H8/A12${i}C`], i)
        }
      })

      expect(result.current.history).toHaveLength(5)
    })

    it('assigns a unique id to each entry', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
        result.current.addEntry(['P12235/G100A'], 2)
      })

      const ids = result.current.history.map((e) => e.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('removeEntry', () => {
    it('removes entry by id', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })

      const id = result.current.history[0].id

      act(() => {
        result.current.removeEntry(id)
      })

      expect(result.current.history).toHaveLength(0)
    })

    it('only removes the targeted entry', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
        result.current.addEntry(['P12235/G100A'], 2)
      })

      const idToRemove = result.current.history[1].id

      act(() => {
        result.current.removeEntry(idToRemove)
      })

      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].variants).toEqual(['P12235/G100A'])
    })

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })

      const id = result.current.history[0].id
      vi.clearAllMocks()

      act(() => {
        result.current.removeEntry(id)
      })

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('clearHistory', () => {
    it('removes all entries', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
        result.current.addEntry(['P12235/G100A'], 2)
      })

      act(() => {
        result.current.clearHistory()
      })

      expect(result.current.history).toHaveLength(0)
    })

    it('clears localStorage', () => {
      const { result } = renderHook(() => useSearchHistory())

      act(() => {
        result.current.addEntry(['Q7Z4H8/A126C'], 1)
      })

      act(() => {
        result.current.clearHistory()
      })

      const saved = JSON.parse(localStorageMock.setItem.mock.calls.at(-1)![1] as string)
      expect(saved).toEqual([])
    })
  })
})
