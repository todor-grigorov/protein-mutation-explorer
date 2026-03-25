'use client'

import { useUniProtInfo } from '@/hooks/useUniProtInfo'

interface ProteinInfoPanelProps {
  proteinId: string
}

export function ProteinInfoPanel({ proteinId }: ProteinInfoPanelProps) {
  const { data, isLoading, isError } = useUniProtInfo(proteinId)

  return (
    <div className="border-border-dark bg-surface rounded-lg border px-4 py-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-white">
          Protein: <span className="text-primary font-mono">{proteinId}</span>
        </p>
        <a
          href={`https://www.uniprot.org/uniprotkb/${proteinId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs hover:underline"
        >
          View on UniProt ↗
        </a>
      </div>

      {isLoading && (
        <p className="text-text-muted animate-pulse text-xs">Loading protein info...</p>
      )}

      {isError && <p className="text-xs text-red-400/70">Could not load UniProt data.</p>}

      {data && (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex gap-2">
            <span className="text-text-muted w-20 shrink-0">Name</span>
            <span className="text-white">{data.proteinName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted w-20 shrink-0">Gene</span>
            <span className="text-white">{data.geneName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted w-20 shrink-0">Organism</span>
            <span className="text-white">{data.organism}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted w-20 shrink-0">Function</span>
            <span className="line-clamp-3 text-white">{data.function}</span>
          </div>
        </div>
      )}
    </div>
  )
}
