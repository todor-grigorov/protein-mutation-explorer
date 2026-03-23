export type AlphaMissenseClass = 'Pathogenic' | 'Ambiguous' | 'Benign'
export type EsmPathogenicityClass = 'Pathogenic' | 'Benign'
export type MechanisticLabel = 'Unassigned' | 'Stability' | 'Pockets' | 'Interface'

export interface ProteinVariantResponse {
  variantId: string
  proteinId: string
  fromAminoAcid: string
  position: number
  toAminoAcid: string
  amPathogenicity: number
  amClass: AlphaMissenseClass
  amLabel: boolean
  esm1bLlr: number
  esm1bIsPathogenic: EsmPathogenicityClass
  predDdg: number | null
  predDdgLabel: boolean
  interfacePdockq: number | null
  interfaceLabel: boolean
  pocketLabel: boolean
  mechanisticLabel: MechanisticLabel
}

export interface InvalidVariantEntry {
  input: string
  reason: string
}

export interface BatchSubmissionResponse {
  found: ProteinVariantResponse[]
  notFound: string[]
  invalid: InvalidVariantEntry[]
}

export interface ProteinResponse {
  proteinId: string
}

export interface UniProtInfo {
  proteinName: string
  geneName: string
  organism: string
  function: string
}
