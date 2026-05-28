export { cn } from '@iva360/ui/lib/utils'

export function pluralizeRu(count: number, one: string, few: string, many: string) {
  const n = Math.abs(count)
  const n10 = n % 10
  const n100 = n % 100
  if (n100 >= 11 && n100 <= 14) return many
  if (n10 === 1) return one
  if (n10 >= 2 && n10 <= 4) return few
  return many
}
