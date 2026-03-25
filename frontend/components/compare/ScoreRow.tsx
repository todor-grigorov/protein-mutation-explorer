interface ScoreRowProps {
  label: string
  valueA: React.ReactNode
  valueB: React.ReactNode
  highlight?: boolean
}

export function ScoreRow({ label, valueA, valueB, highlight = false }: ScoreRowProps) {
  return (
    <div
      className={`border-border-dark grid grid-cols-3 gap-4 border-b py-3 ${
        highlight ? 'bg-primary/5' : ''
      }`}
    >
      <span className="text-text-muted text-sm font-medium">{label}</span>
      <span className="text-center text-sm text-white">{valueA}</span>
      <span className="text-center text-sm text-white">{valueB}</span>
    </div>
  )
}
