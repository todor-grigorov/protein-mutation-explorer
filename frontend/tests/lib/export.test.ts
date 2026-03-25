import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportVariantsToCsv } from '@/lib/export'
import type { ProteinVariantResponse } from '@/types/api'

// Mock papaparse
vi.mock('papaparse', () => ({
  default: {
    unparse: vi.fn((data) => {
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map((row: Record<string, unknown>) => Object.values(row).join(','))
      return [headers, ...rows].join('\n')
    }),
  },
}))

// Mock DOM APIs
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
const mockRevokeObjectURL = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  Object.defineProperty(window, 'URL', {
    value: {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    },
    writable: true,
  })

  vi.spyOn(document, 'createElement').mockReturnValue({
    href: '',
    download: '',
    click: mockClick,
  } as unknown as HTMLAnchorElement)
})

const mockVariant: ProteinVariantResponse = {
  variantId: 'Q7Z4H8/A126C',
  proteinId: 'Q7Z4H8',
  fromAminoAcid: 'A',
  position: 126,
  toAminoAcid: 'C',
  amPathogenicity: 0.6158,
  amClass: 'Pathogenic',
  amLabel: true,
  esm1bLlr: -10.388,
  esm1bIsPathogenic: 'Pathogenic',
  predDdg: -0.353881,
  predDdgLabel: false,
  interfacePdockq: null,
  interfaceLabel: false,
  pocketLabel: false,
  mechanisticLabel: 'Unassigned',
}

const nullVariant: ProteinVariantResponse = {
  ...mockVariant,
  variantId: 'Q8IUR5/A100C',
  predDdg: null,
  interfacePdockq: null,
}

describe('exportVariantsToCsv', () => {
  it('triggers a file download', () => {
    exportVariantsToCsv([mockVariant])
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it('uses default filename when none provided', () => {
    const createElement = vi.spyOn(document, 'createElement')
    exportVariantsToCsv([mockVariant])
    const anchor = createElement.mock.results[0].value
    expect(anchor.download).toBe('mutation-impact-results.csv')
  })

  it('uses custom filename when provided', () => {
    const createElement = vi.spyOn(document, 'createElement')
    exportVariantsToCsv([mockVariant], 'my-results.csv')
    const anchor = createElement.mock.results[0].value
    expect(anchor.download).toBe('my-results.csv')
  })

  it('replaces null predDdg with N/A', async () => {
    const Papa = vi.mocked(await import('papaparse')).default
    exportVariantsToCsv([nullVariant])
    const callArg = (Papa.unparse as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(callArg[0]['Pred DDG']).toBe('N/A')
  })

  it('replaces null interfacePdockq with N/A', async () => {
    const Papa = vi.mocked(await import('papaparse')).default
    exportVariantsToCsv([nullVariant])
    const callArg = (Papa.unparse as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(callArg[0]['Interface pDockQ']).toBe('N/A')
  })

  it('exports all variants not just current page', async () => {
    const Papa = vi.mocked(await import('papaparse')).default
    exportVariantsToCsv([mockVariant, nullVariant])
    const callArg = (Papa.unparse as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(callArg).toHaveLength(2)
  })

  it('revokes object URL after download', () => {
    exportVariantsToCsv([mockVariant])
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})
