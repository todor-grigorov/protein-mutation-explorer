import { z } from 'zod'

const variantLineRegex = /^[A-Z0-9]+(?:\/|\s+)[ACDEFGHIKLMNPQRSTVWY]\d+[ACDEFGHIKLMNPQRSTVWY]$/i

export const submissionFormSchema = z.object({
  variants: z
    .string()
    .min(1, 'Please enter at least one variant')
    .superRefine((value, ctx) => {
      const lines = value
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (lines.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please enter at least one variant',
        })
        return
      }

      const invalidLines = lines
        .map((line, index) => ({
          line,
          index,
          isValid: variantLineRegex.test(line),
        }))
        .filter((entry) => !entry.isValid)

      if (invalidLines.length > 0) {
        ctx.addIssue({
          code: 'custom',
          message: invalidLines
            .map(
              ({ line, index }) =>
                `Line ${index + 1}: "${line}" is invalid. Use "UniProtID A123C" or "UniProtID/A123C".`
            )
            .join(' '),
        })
      }
    }),
})

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>
