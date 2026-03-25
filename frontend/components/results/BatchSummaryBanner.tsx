import type { InvalidVariantEntry } from '@/types/api'

interface BatchSummaryBannerProps {
  notFound: string[]
  invalid: InvalidVariantEntry[]
}

export function BatchSummaryBanner({ notFound, invalid }: BatchSummaryBannerProps) {
  if (notFound.length === 0 && invalid.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Not found warning */}
      {notFound.length > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <p className="mb-1 text-sm font-medium text-yellow-400">
            {notFound.length} variant{notFound.length > 1 ? 's' : ''} not found in dataset
          </p>
          <ul className="space-y-0.5 font-mono text-xs text-yellow-300/70">
            {notFound.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Invalid format warning */}
      {invalid.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="mb-1 text-sm font-medium text-red-400">
            {invalid.length} variant{invalid.length > 1 ? 's' : ''} had invalid format
          </p>
          <ul className="space-y-0.5 font-mono text-xs text-red-300/70">
            {invalid.map((entry) => (
              <li key={entry.input}>
                {entry.input} <span className="text-red-400/50">— {entry.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
