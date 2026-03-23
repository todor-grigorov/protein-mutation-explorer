import { apiFetch } from './client'
import type { BatchSubmissionResponse } from '@/types/api'

export async function submitBatch(variants: string[]): Promise<BatchSubmissionResponse> {
  return apiFetch<BatchSubmissionResponse>('/api/variants/batch', {
    method: 'POST',
    body: JSON.stringify({ variants }),
  })
}
