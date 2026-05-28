export function resolveBrandMediaId(value: unknown): number | null {
  if (typeof value === 'number') {
    return value
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }

  return null
}

export function resolveBrandMediaUrl(value: unknown): string | null {
  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as { url?: unknown }).url
    return typeof url === 'string' ? url : null
  }

  return null
}
