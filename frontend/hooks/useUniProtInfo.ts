import { useQuery } from '@tanstack/react-query'
import type { UniProtInfo } from '@/types/api'

async function fetchUniProtInfo(proteinId: string): Promise<UniProtInfo> {
  const res = await fetch(`https://rest.uniprot.org/uniprotkb/${proteinId}.json`)

  if (!res.ok) throw new Error('Failed to fetch UniProt data')

  const data = await res.json()

  return {
    proteinName:
      data.proteinDescription?.recommendedName?.fullName?.value ??
      data.proteinDescription?.submissionNames?.[0]?.fullName?.value ??
      proteinId,
    geneName: data.genes?.[0]?.geneName?.value ?? 'Unknown',
    organism: data.organism?.scientificName ?? 'Unknown',
    function:
      data.comments?.find((c: { commentType: string }) => c.commentType === 'FUNCTION')?.texts?.[0]
        ?.value ?? 'No function description available',
  }
}

export function useUniProtInfo(proteinId: string | null) {
  return useQuery<UniProtInfo, Error>({
    queryKey: ['uniprot', proteinId],
    queryFn: () => fetchUniProtInfo(proteinId!),
    enabled: !!proteinId,
    staleTime: Infinity, // protein data never changes
    retry: 1,
  })
}
