import { z } from 'zod'

export const uniProtInfoSchema = z.object({
  proteinName: z.string(),
  geneName: z.string(),
  organism: z.string(),
  function: z.string(),
})

export type UniProtInfoDto = z.infer<typeof uniProtInfoSchema>
