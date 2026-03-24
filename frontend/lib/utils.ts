import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitVariantLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

export function normalizeVariantSyntax(input: string): string {
  return input.trim().replace(/\s+/, ' ').replace(' ', '/').toUpperCase()
}
