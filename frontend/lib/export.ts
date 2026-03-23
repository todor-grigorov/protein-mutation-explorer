import Papa from 'papaparse'
import type { ProteinVariantResponse } from '@/types/api'

export function exportVariantsToCsv(
  variants: ProteinVariantResponse[],
  filename = 'mutation-impact-results.csv'
): void {
  const data = variants.map((v) => ({
    'Variant ID': v.variantId,
    'Protein ID': v.proteinId,
    'From AA': v.fromAminoAcid,
    Position: v.position,
    'To AA': v.toAminoAcid,
    'AM Pathogenicity': v.amPathogenicity,
    'AM Class': v.amClass,
    'AM Label': v.amLabel,
    'ESM1b LLR': v.esm1bLlr,
    'ESM1b Pathogenic': v.esm1bIsPathogenic,
    'Pred DDG': v.predDdg ?? 'N/A',
    'DDG Label': v.predDdgLabel,
    'Interface pDockQ': v.interfacePdockq ?? 'N/A',
    'Interface Label': v.interfaceLabel,
    'Pocket Label': v.pocketLabel,
    'Mechanistic Label': v.mechanisticLabel,
  }))

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
