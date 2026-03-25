'use client'

import { ProteinVariantResponse } from '@/types/api'
import { ColumnDef, flexRender, Table } from '@tanstack/react-table'

interface TableProps {
  table: Table<ProteinVariantResponse>
  selectedVariantId: string | null
  columns: ColumnDef<ProteinVariantResponse>[]
  onVariantSelect: (variant: ProteinVariantResponse) => void
}

const VariantsGrid = ({ table, selectedVariantId, columns, onVariantSelect }: TableProps) => {
  return (
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
  )
}

export default VariantsGrid
