const DEFAULT_IMAGE_SRC = '/placeholder.svg'

export function resolveImageSrc(value?: string | null): string {
  if (typeof value !== 'string') {
    return DEFAULT_IMAGE_SRC
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return DEFAULT_IMAGE_SRC
  }

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      new URL(trimmed)
      return trimmed
    } catch {
      // Ignore malformed absolute URLs and use the local placeholder.
    }

    return DEFAULT_IMAGE_SRC
  }

  if (trimmed.startsWith('//')) {
    return `${window.location.protocol}${trimmed}`
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  if (trimmed.startsWith('storage/') || trimmed.startsWith('uploads/')) {
    return `/${trimmed}`
  }

  return DEFAULT_IMAGE_SRC
}

export { DEFAULT_IMAGE_SRC }