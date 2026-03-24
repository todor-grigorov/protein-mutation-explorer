'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useVariantsBatch } from '@/hooks/useVariantsBatch'
import { VariantsTable } from '@/app/results/VariantsTable'
import { BatchSummaryBanner } from '@/app/results/BatchSummaryBanner'
import { ProteinInfoPanel } from '@/app/results/ProteinInfoPanel'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { BatchSubmissionResponse, ProteinVariantResponse } from '@/types/api'

const MolstarViewer = dynamic(
  () => import('@/app/results/MolstarViewer').then((mod) => mod.MolstarViewer),
  {
    ssr: false,
    loading: () => (
      <div className="border-border-dark flex aspect-[4/3] w-full items-center justify-center rounded-lg border bg-slate-900">
        <p className="text-text-muted animate-pulse text-sm">Loading structure viewer...</p>
      </div>
    ),
  }
)

// Initialize from sessionStorage outside component
// to avoid setState in effect
function getInitialResults(): BatchSubmissionResponse | null {
  if (typeof window === 'undefined') return null
  const cached = sessionStorage.getItem('batchResults')
  if (!cached) return null
  try {
    return JSON.parse(cached) as BatchSubmissionResponse
  } catch {
    return null
  }
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutate, isPending } = useVariantsBatch()

  const [results, setResults] = useState<BatchSubmissionResponse | null>(getInitialResults)
  const [selectedVariant, setSelectedVariant] = useState<ProteinVariantResponse | null>(
    () => getInitialResults()?.found[0] ?? null
  )

  useEffect(() => {
    // Only fetch if we don't have cached results
    if (results) return

    const variantsParam = searchParams.get('variants')
    if (!variantsParam) {
      router.push('/')
      return
    }

    const variants = decodeURIComponent(variantsParam).split(',')

    mutate(variants, {
      onSuccess: (data) => {
        setResults(data)
        if (data.found.length > 0) {
          setSelectedVariant(data.found[0])
        }
      },
      onError: () => router.push('/'),
    })
  }, [])

  if (isPending || !results) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted animate-pulse">Analyzing variants...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl leading-tight font-black tracking-[-0.033em] text-white lg:text-4xl">
            Mutation Impact Analysis
          </h1>
          <p className="text-text-muted mt-1 text-base">
            Showing {results.found.length} matched variant
            {results.found.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Button
          onClick={() => {
            sessionStorage.removeItem('batchResults')
            router.push('/')
          }}
          variant="outline"
          className="border-border-dark text-text-muted gap-2 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          New Search
        </Button>
      </div>

      <BatchSummaryBanner notFound={results.notFound} invalid={results.invalid} />

      {results.found.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-text-muted text-lg">No variants were found in the dataset.</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Try Another Search
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <VariantsTable
              variants={results.found}
              selectedVariantId={selectedVariant?.variantId ?? null}
              onVariantSelect={setSelectedVariant}
            />
          </div>
          <div className="flex w-full flex-col gap-4 self-start lg:sticky lg:top-6 lg:w-1/2">
            {selectedVariant && (
              <>
                <ProteinInfoPanel proteinId={selectedVariant.proteinId} />
                <MolstarViewer
                  key={selectedVariant.proteinId}
                  proteinId={selectedVariant.proteinId}
                  highlightPosition={selectedVariant.position}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-text-muted animate-pulse">Loading results...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
