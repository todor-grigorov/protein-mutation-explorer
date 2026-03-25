'use client'

import { GitCompare } from 'lucide-react'
import { Button } from '../ui/button'
import { Download, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { ProteinVariantResponse } from '@/types/api'
import { exportVariantsToCsv } from '@/lib/export'

interface ToolbarProps {
  globalFilter: string
  variants: ProteinVariantResponse[]
  compareSelection: string[]
  setGlobalFilter: (value: string) => void
  handleCompare: () => void
}

const Toolbar = ({
  globalFilter,
  setGlobalFilter,
  variants,
  compareSelection,
  handleCompare,
}: ToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Filter mutations..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-surface border-border-dark placeholder:text-text-muted focus:border-primary h-12 pl-9 text-white"
        />
      </div>
      <Button
        onClick={() => exportVariantsToCsv(variants)}
        className="bg-primary hover:bg-primary/90 h-12 gap-2 px-4 font-bold text-white"
      >
        <Download className="size-4" />
        Export CSV
      </Button>
      <Button
        onClick={handleCompare}
        disabled={compareSelection.length !== 2}
        className="bg-surface-hover hover:bg-border-dark border-border-dark h-12 gap-2 border px-4 font-bold text-white"
      >
        <GitCompare className="size-4" />
        Compare
      </Button>
    </div>
  )
}

export default Toolbar
