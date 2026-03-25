import { describe, it, expect } from 'vitest'
import { submissionFormSchema } from '@/dto/SubmissionFormDto'

describe('submissionFormSchema', () => {
  describe('valid inputs', () => {
    it('accepts a single variant', () => {
      const result = submissionFormSchema.safeParse({
        variants: 'Q7Z4H8 A126C',
      })
      expect(result.success).toBe(true)
    })

    it('accepts multiple variants', () => {
      const result = submissionFormSchema.safeParse({
        variants: 'Q7Z4H8 A126C\nP12235 G100A\nQ8IUR5 A100C',
      })
      expect(result.success).toBe(true)
    })

    it('accepts slash-separated format', () => {
      const result = submissionFormSchema.safeParse({
        variants: 'Q7Z4H8/A126C',
      })
      expect(result.success).toBe(true)
    })

    it('accepts variants with leading and trailing whitespace', () => {
      const result = submissionFormSchema.safeParse({
        variants: '  Q7Z4H8 A126C  ',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = submissionFormSchema.safeParse({ variants: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter at least one variant')
      }
    })

    it('rejects whitespace only', () => {
      const result = submissionFormSchema.safeParse({ variants: '   ' })
      expect(result.success).toBe(false)
    })

    it('rejects missing variants field', () => {
      const result = submissionFormSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })
})
