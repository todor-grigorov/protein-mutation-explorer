import { useMutation } from '@tanstack/react-query'
import { submitBatch } from '@/lib/api/variants'
import type { BatchSubmissionResponse } from '@/types/api'

export function useVariantsBatch() {
  return useMutation<BatchSubmissionResponse, Error, string[]>({
    mutationFn: submitBatch,
  })
}
