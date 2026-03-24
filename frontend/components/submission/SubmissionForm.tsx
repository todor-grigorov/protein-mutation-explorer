'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useVariantsBatch } from '@/hooks/useVariantsBatch'
import { submissionFormSchema, type SubmissionFormValues } from '@/dto/SubmissionFormDto'
import { useState } from 'react'
import { Input } from '../ui/input'

const modeStyles = {
  active:
    'bg-background-dark flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium text-white shadow-sm cursor-pointer',
  inactive:
    'text-text-muted flex h-full grow items-center justify-center px-2 text-sm font-medium cursor-pointer',
}

export function SubmissionForm() {
  const router = useRouter()
  const { mutate, isPending } = useVariantsBatch()
  const [mode, setMode] = useState<'bulk' | 'single'>('bulk')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
  })

  const onSubmit = (values: SubmissionFormValues) => {
    const lines = values.variants
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    mutate(lines, {
      onSuccess: (data) => {
        // Store results in sessionStorage — retrieved on results page
        sessionStorage.setItem('batchResults', JSON.stringify(data))
        // Pass raw input lines in URL for shareability
        const encoded = encodeURIComponent(lines.join(','))
        router.push(`/results?variants=${encoded}`)
      },
      onError: (error) => {
        console.error('Batch submission failed:', error)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Input mode toggle */}
      <div className="flex justify-center px-0 py-3">
        <div className="bg-surface-hover flex h-10 w-full max-w-sm items-center justify-center rounded-lg p-1">
          <span
            className={mode === 'bulk' ? modeStyles.active : modeStyles.inactive}
            onClick={() => setMode('bulk')}
          >
            Bulk Input
          </span>
          <span
            className={mode === 'single' ? modeStyles.active : modeStyles.inactive}
            onClick={() => setMode('single')}
          >
            Single Entry
          </span>
        </div>
      </div>

      {/* Textarea */}
      {mode === 'bulk' ? (
        <div className="flex flex-col gap-2">
          <label className="text-base leading-normal font-medium text-white">
            Paste your list of mutations here (one per line)
          </label>
          <Textarea
            {...register('variants')}
            placeholder={`Q7Z4H8 A126C\nP12235 G100A`}
            className="bg-surface border-border-dark placeholder:text-text-muted focus:border-primary focus:ring-primary/50 min-h-36 resize-y font-mono text-white"
          />
          {errors.variants && (
            <p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-base leading-normal font-medium text-white">
            Paste your single mutation here
          </label>
          <Input
            {...register('variants')}
            placeholder={`Q7Z4H8 A126C`}
            className="bg-surface border-border-dark placeholder:text-text-muted focus:border-primary focus:ring-primary/50 resize-y font-mono text-white"
          />
          {errors.variants && (
            <p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-start">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 h-11 rounded-lg px-6 font-bold text-white"
        >
          {isPending ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
    </form>
  )
}
