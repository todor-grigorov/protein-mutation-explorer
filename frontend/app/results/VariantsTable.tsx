'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Download, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { exportVariantsToCsv } from '@/lib/export'
import type { ProteinVariantResponse } from '@/types/api'

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
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<ProteinVariantResponse>[]>(
    () => [
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
    []
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
    autoResetPageIndex: true, // reset to page 1 when filter changes
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalFiltered = table.getFilteredRowModel().rows.length
  const firstRow = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalFiltered)

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Toolbar */}
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
      </div>

      {/* Table */}
      <div className="border-border-dark h-full overflow-hidden rounded-lg border">
        <div className="h-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-surface">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="hover:text-primary cursor-pointer px-4 py-3 text-sm leading-normal font-medium whitespace-nowrap text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-text-muted px-4 py-8 text-center text-sm"
                  >
                    No variants found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onVariantSelect(row.original)}
                    className={`border-border-dark cursor-pointer border-t transition-colors ${
                      selectedVariantId === row.original.variantId
                        ? 'bg-primary/20'
                        : 'hover:bg-surface-hover'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="h-[60px] px-4 py-2 text-sm leading-normal font-normal"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-xs">
          {totalFiltered === 0
            ? 'No results'
            : `Showing ${firstRow}–${lastRow} of ${totalFiltered} variants`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border-dark text-text-muted h-8 w-8 p-0 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-text-muted text-xs">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border-dark text-text-muted h-8 w-8 p-0 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
