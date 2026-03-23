import { z } from 'zod'

export const invalidVariantEntrySchema = z.object({
  input: z.string(),
  reason: z.string(),
})

export const proteinVariantResponseSchema = z.object({
  variantId: z.string(),
  proteinId: z.string(),
  fromAminoAcid: z.string(),
  position: z.number(),
  toAminoAcid: z.string(),
  amPathogenicity: z.number(),
  amClass: z.enum(['Pathogenic', 'Ambiguous', 'Benign']),
  amLabel: z.boolean(),
  esm1bLlr: z.number(),
  esm1bIsPathogenic: z.enum(['Pathogenic', 'Benign']),
  predDdg: z.number().nullable(),
  predDdgLabel: z.boolean(),
  interfacePdockq: z.number().nullable(),
  interfaceLabel: z.boolean(),
  pocketLabel: z.boolean(),
  mechanisticLabel: z.enum(['Unassigned', 'Stability', 'Pockets', 'Interface']),
})

export const batchSubmissionResponseSchema = z.object({
  found: z.array(proteinVariantResponseSchema),
  notFound: z.array(z.string()),
  invalid: z.array(invalidVariantEntrySchema),
})
