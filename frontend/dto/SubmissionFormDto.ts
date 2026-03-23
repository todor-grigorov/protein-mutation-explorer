import { z } from 'zod'

export const submissionFormSchema = z.object({
  variants: z
    .string()
    .min(1, 'Please enter at least one variant')
    .refine(
      (val) => {
        const lines = val
          .trim()
          .split('\n')
          .filter((line) => line.trim().length > 0)
        return lines.length > 0
      },
      { message: 'Please enter at least one variant' }
    ),
})

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>
