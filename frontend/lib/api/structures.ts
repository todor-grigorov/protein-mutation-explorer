export function getStructureUrl(proteinId: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/structures/${proteinId}`
}
