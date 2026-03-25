'use client'

import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProteinVariantResponse } from '@/types/api'
import { Table } from '@tanstack/react-table'

interface PaginationProps {
  table: Table<ProteinVariantResponse>
  pageIndex: number
  firstRow: number
  lastRow: number
  totalFiltered: number
}

const Pagination = ({ table, pageIndex, firstRow, lastRow, totalFiltered }: PaginationProps) => {
  return (
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
  )
}

export default Pagination
