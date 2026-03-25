import { ScoreRow } from './ScoreRow'
import type { ProteinVariantResponse } from '@/types/api'

interface ComparePanelProps {
  variantA: ProteinVariantResponse
  variantB: ProteinVariantResponse
}

function AmClassBadge({ value }: { value: string }) {
  const styles =
    {
      Pathogenic: 'bg-red-500/10 text-red-500',
      Ambiguous: 'bg-orange-500/10 text-orange-500',
      Benign: 'bg-green-500/10 text-green-500',
    }[value] ?? 'bg-gray-500/10 text-gray-400'

  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-medium ${styles}`}
    >
      {value}
    </span>
  )
}

function MechanisticBadge({ value }: { value: string }) {
  const styles =
    {
      Stability: 'bg-blue-500/10 text-blue-400',
      Pockets: 'bg-purple-500/10 text-purple-400',
      Interface: 'bg-cyan-500/10 text-cyan-400',
      Unassigned: 'bg-gray-500/10 text-gray-400',
    }[value] ?? 'bg-gray-500/10 text-gray-400'

  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-medium ${styles}`}
    >
      {value}
    </span>
  )
}

function DeltaIndicator({
  valueA,
  valueB,
  lowerIsBetter = false,
}: {
  valueA: number | null
  valueB: number | null
  lowerIsBetter?: boolean
}) {
  if (valueA === null || valueB === null) return <span className="text-text-muted">N/A</span>

  const diff = valueB - valueA
  const isWorse = lowerIsBetter ? diff > 0 : diff < 0
  const isBetter = lowerIsBetter ? diff < 0 : diff > 0

  return (
    <span className={isBetter ? 'text-green-400' : isWorse ? 'text-red-400' : 'text-text-muted'}>
      {diff > 0 ? '+' : ''}
      {diff.toFixed(3)}
    </span>
  )
}

export function ComparePanel({ variantA, variantB }: ComparePanelProps) {
  return (
    <div className="border-border-dark flex flex-col gap-0 overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="bg-surface grid grid-cols-3 gap-4 px-4 py-3">
        <span className="text-text-muted text-xs font-medium tracking-wider uppercase">Score</span>
        <span className="text-primary text-center font-mono text-sm font-bold">
          {variantA.variantId}
        </span>
        <span className="text-primary text-center font-mono text-sm font-bold">
          {variantB.variantId}
        </span>
      </div>

      <div className="px-4">
        {/* Protein */}
        <ScoreRow
          label="Protein"
          valueA={<span className="text-text-muted font-mono">{variantA.proteinId}</span>}
          valueB={<span className="text-text-muted font-mono">{variantB.proteinId}</span>}
        />

        {/* Position */}
        <ScoreRow label="Position" valueA={variantA.position} valueB={variantB.position} />

        {/* Substitution */}
        <ScoreRow
          label="Substitution"
          valueA={
            <span className="font-mono">
              {variantA.fromAminoAcid}→{variantA.toAminoAcid}
            </span>
          }
          valueB={
            <span className="font-mono">
              {variantB.fromAminoAcid}→{variantB.toAminoAcid}
            </span>
          }
        />

        {/* AlphaMissense */}
        <ScoreRow
          label="AM Pathogenicity"
          highlight
          valueA={variantA.amPathogenicity.toFixed(4)}
          valueB={variantB.amPathogenicity.toFixed(4)}
        />

        <ScoreRow
          label="AM Class"
          valueA={<AmClassBadge value={variantA.amClass} />}
          valueB={<AmClassBadge value={variantB.amClass} />}
        />

        {/* ESM1b */}
        <ScoreRow
          label="ESM1b LLR"
          highlight
          valueA={variantA.esm1bLlr.toFixed(3)}
          valueB={variantB.esm1bLlr.toFixed(3)}
        />

        <ScoreRow
          label="ESM1b Class"
          valueA={variantA.esm1bIsPathogenic}
          valueB={variantB.esm1bIsPathogenic}
        />

        {/* Stability */}
        <ScoreRow
          label="Stability (ΔΔG)"
          highlight
          valueA={variantA.predDdg !== null ? variantA.predDdg.toFixed(3) : 'N/A'}
          valueB={variantB.predDdg !== null ? variantB.predDdg.toFixed(3) : 'N/A'}
        />

        <ScoreRow
          label="ΔΔG Difference"
          valueA="baseline"
          valueB={
            <DeltaIndicator
              valueA={variantA.predDdg}
              valueB={variantB.predDdg}
              lowerIsBetter={false}
            />
          }
        />

        <ScoreRow
          label="Destabilizing"
          valueA={variantA.predDdgLabel ? 'Yes' : 'No'}
          valueB={variantB.predDdgLabel ? 'Yes' : 'No'}
        />

        {/* Interface */}
        <ScoreRow
          label="Interface"
          valueA={variantA.interfaceLabel ? 'Yes' : 'No'}
          valueB={variantB.interfaceLabel ? 'Yes' : 'No'}
        />

        <ScoreRow
          label="Interface pDockQ"
          valueA={variantA.interfacePdockq !== null ? variantA.interfacePdockq.toFixed(3) : 'N/A'}
          valueB={variantB.interfacePdockq !== null ? variantB.interfacePdockq.toFixed(3) : 'N/A'}
        />

        {/* Pocket */}
        <ScoreRow
          label="Pocket"
          valueA={variantA.pocketLabel ? 'Yes' : 'No'}
          valueB={variantB.pocketLabel ? 'Yes' : 'No'}
        />

        {/* Mechanism */}
        <ScoreRow
          label="Mechanism"
          highlight
          valueA={<MechanisticBadge value={variantA.mechanisticLabel} />}
          valueB={<MechanisticBadge value={variantB.mechanisticLabel} />}
        />
      </div>
    </div>
  )
}
