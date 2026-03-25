'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import type { ProteinVariantResponse } from '@/types/api'
import Toolbar from '@/components/variants-table/Toolbar'
import Pagination from '@/components/variants-table/Pagination'
import VariantsGrid from '@/components/variants-table/VariantsGrid'

interface VariantsTableProps {
  variants: ProteinVariantResponse[]
  selectedVariantId: string | null
  onVariantSelect: (variant: ProteinVariantResponse) => void
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

const PAGE_SIZE = 10

export function VariantsTable({
  variants,
  selectedVariantId,
  onVariantSelect,
}: VariantsTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [compareSelection, setCompareSelection] = useState<string[]>([])

  const toggleCompareSelection = (variantId: string) => {
    setCompareSelection((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : prev.length < 2
          ? [...prev, variantId]
          : prev
    )
  }

  const handleCompare = () => {
    if (compareSelection.length !== 2) return
    const [a, b] = compareSelection
    router.push(`/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`)
  }

  const columns = useMemo<ColumnDef<ProteinVariantResponse>[]>(
    () => [
      {
        id: 'compare',
        header: '',
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={compareSelection.includes(row.original.variantId)}
            onChange={(e) => {
              e.stopPropagation()
              toggleCompareSelection(row.original.variantId)
            }}
            disabled={
              !compareSelection.includes(row.original.variantId) && compareSelection.length >= 2
            }
            className="accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
          />
        ),
      },
      {
        accessorKey: 'variantId',
        header: 'Mutation',
        cell: ({ row }) => (
          <span className="font-mono font-medium text-white">{row.original.variantId}</span>
        ),
      },
      {
        accessorKey: 'amPathogenicity',
        header: 'AM Score',
        cell: ({ getValue }) => (
          <span className="text-text-muted">{(getValue() as number).toFixed(4)}</span>
        ),
      },
      {
        accessorKey: 'amClass',
        header: 'AM Class',
        cell: ({ getValue }) => <AmClassBadge value={getValue() as string} />,
      },
      {
        accessorKey: 'esm1bLlr',
        header: 'ESM1b LLR',
        cell: ({ getValue }) => (
          <span className="text-text-muted">{(getValue() as number).toFixed(3)}</span>
        ),
      },
      {
        accessorKey: 'predDdg',
        header: 'Stability (ΔΔG)',
        cell: ({ getValue }) => {
          const val = getValue() as number | null
          return <span className="text-text-muted">{val !== null ? val.toFixed(3) : 'N/A'}</span>
        },
      },
      {
        accessorKey: 'mechanisticLabel',
        header: 'Mechanism',
        cell: ({ getValue }) => <MechanisticBadge value={getValue() as string} />,
      },
      {
        accessorKey: 'interfaceLabel',
        header: 'Interface',
        cell: ({ getValue }) => (
          <span className="text-text-muted">{(getValue() as boolean) ? 'Yes' : 'No'}</span>
        ),
      },
      {
        accessorKey: 'pocketLabel',
        header: 'Pocket',
        cell: ({ getValue }) => (
          <span className="text-text-muted">{(getValue() as boolean) ? 'Yes' : 'No'}</span>
        ),
      },
    ],
    [compareSelection]
  )

  const table = useReactTable({
    data: variants,
    columns,
    state: { sorting, globalFilter },
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalFiltered = table.getFilteredRowModel().rows.length
  const firstRow = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalFiltered)

  useEffect(() => {
    table.setPageIndex(0)
  }, [globalFilter])

  return (
    <div className="flex h-full flex-col gap-4">
      <Toolbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        variants={variants}
        compareSelection={compareSelection}
        handleCompare={handleCompare}
      />
      <VariantsGrid
        table={table}
        selectedVariantId={selectedVariantId}
        columns={columns}
        onVariantSelect={onVariantSelect}
      />
      <Pagination
        table={table}
        pageIndex={pageIndex}
        firstRow={firstRow}
        lastRow={lastRow}
        totalFiltered={totalFiltered}
      />
    </div>
  )
}
