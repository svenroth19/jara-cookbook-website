export function getImageSrc(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  const idx = imageUrl.indexOf('#fp=')
  return idx !== -1 ? imageUrl.slice(0, idx) : imageUrl
}

export function getObjectPosition(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '50% 50%'
  const idx = imageUrl.indexOf('#fp=')
  if (idx === -1) return '50% 50%'
  const parts = imageUrl.slice(idx + 4).split(',')
  if (parts.length !== 2) return '50% 50%'
  const x = parseFloat(parts[0])
  const y = parseFloat(parts[1])
  if (isNaN(x) || isNaN(y)) return '50% 50%'
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`
}

export function parseFocalPoint(imageUrl: string | null | undefined): { x: number; y: number } {
  if (!imageUrl) return { x: 0.5, y: 0.5 }
  const idx = imageUrl.indexOf('#fp=')
  if (idx === -1) return { x: 0.5, y: 0.5 }
  const parts = imageUrl.slice(idx + 4).split(',')
  if (parts.length !== 2) return { x: 0.5, y: 0.5 }
  const x = parseFloat(parts[0])
  const y = parseFloat(parts[1])
  if (isNaN(x) || isNaN(y)) return { x: 0.5, y: 0.5 }
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  }
}

export function buildImageUrl(blobUrl: string, focalX: number, focalY: number): string {
  const base = getImageSrc(blobUrl) ?? blobUrl
  return `${base}#fp=${focalX.toFixed(4)},${focalY.toFixed(4)}`
}
