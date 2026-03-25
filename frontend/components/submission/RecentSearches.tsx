'use client'

import { X, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SearchHistoryEntry } from '@/hooks/useSearchHistory'

interface RecentSearchesProps {
  history: SearchHistoryEntry[]
  onReuse: (variants: string[]) => void
  onRemove: (id: string) => void
  onClear: () => void
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString()
}

export function RecentSearches({ history, onReuse, onRemove, onClear }: RecentSearchesProps) {
  if (history.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-text-muted flex items-center gap-2">
          <Clock className="size-4" />
          <span className="text-sm font-medium">Recent Searches</span>
        </div>
        <button
          onClick={onClear}
          className="text-text-muted text-xs transition-colors hover:text-white"
        >
          Clear all
        </button>
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="group border-border-dark bg-surface hover:border-primary/50 hover:bg-surface-hover flex items-center justify-between rounded-lg border px-4 py-3 transition-colors"
          >
            {/* Left — variants preview */}
            <button
              onClick={() => onReuse(entry.variants)}
              className="flex flex-1 flex-col gap-1 text-left"
            >
              <p className="max-w-[400px] truncate font-mono text-sm text-white">
                {entry.variants.slice(0, 3).join(', ')}
                {entry.variants.length > 3 && (
                  <span className="text-text-muted"> +{entry.variants.length - 3} more</span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xs">{formatDate(entry.submittedAt)}</span>
                <span className="text-text-muted text-xs">·</span>
                <span
                  className={`text-xs font-medium ${
                    entry.resultCount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {entry.resultCount} found
                </span>
                <span className="text-text-muted text-xs">·</span>
                <span className="text-text-muted text-xs">
                  {entry.variants.length} {entry.variants.length === 1 ? 'variant' : 'variants'}
                </span>
              </div>
            </button>

            {/* Right — actions */}
            <div className="flex items-center gap-2">
              <ChevronRight className="text-text-muted group-hover:text-primary size-4 transition-colors" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(entry.id)
                }}
                className="text-text-muted opacity-0 transition-colors group-hover:opacity-100 hover:text-red-400"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
