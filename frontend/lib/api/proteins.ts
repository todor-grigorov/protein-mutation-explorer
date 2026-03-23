import { apiFetch } from './client'
import type { ProteinResponse } from '@/types/api'

export async function getProteins(): Promise<ProteinResponse[]> {
  return apiFetch<ProteinResponse[]>('/api/proteins')
}
