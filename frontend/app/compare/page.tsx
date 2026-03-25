'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useMemo } from 'react'
import { ComparePanel } from '@/components/compare/ComparePanel'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { BatchSubmissionResponse, ProteinVariantResponse } from '@/types/api'

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { variantA, variantB, error } = useMemo(() => {
    const idA = searchParams.get('a')
    const idB = searchParams.get('b')

    if (!idA || !idB) {
      return {
        variantA: null as ProteinVariantResponse | null,
        variantB: null as ProteinVariantResponse | null,
        error: 'Two variant IDs are required for comparison.',
      }
    }

    if (typeof window === 'undefined') {
      return {
        variantA: null,
        variantB: null,
        error: null,
      }
    }

    const cached = sessionStorage.getItem('batchResults')
    if (!cached) {
      return {
        variantA: null,
        variantB: null,
        error: 'No results found. Please go back and search first.',
      }
    }

    try {
      const results: BatchSubmissionResponse = JSON.parse(cached)

      const decodedA = decodeURIComponent(idA)
      const decodedB = decodeURIComponent(idB)

      const foundA = results.found.find((v) => v.variantId === decodedA) ?? null
      const foundB = results.found.find((v) => v.variantId === decodedB) ?? null

      if (!foundA || !foundB) {
        return {
          variantA: null,
          variantB: null,
          error: 'One or both variants not found in current results.',
        }
      }

      return {
        variantA: foundA,
        variantB: foundB,
        error: null,
      }
    } catch {
      return {
        variantA: null,
        variantB: null,
        error: 'Failed to read cached results.',
      }
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-400">{error}</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border-border-dark text-text-muted gap-2 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
      </div>
    )
  }

  if (!variantA || !variantB) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted animate-pulse text-sm">Loading comparison...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl leading-tight font-black tracking-[-0.033em] text-white">
            Variant Comparison
          </h1>
          <p className="text-text-muted mt-1 text-base">
            Side-by-side impact analysis of two protein variants.
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border-border-dark text-text-muted gap-2 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Results
        </Button>
      </div>

      {/* Comparison panel */}
      <ComparePanel variantA={variantA} variantB={variantB} />
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-text-muted animate-pulse">Loading results...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
