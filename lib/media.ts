export interface MediaAsset {
  alt: string
  src?: string
  publicId?: string
  caption?: string
  note?: string
}

interface MediaOptions {
  width?: number
  height?: number
  fit?: 'fill' | 'fit' | 'limit'
}

const DEFAULT_TRANSFORMS = ['f_auto', 'q_auto']

export function getMediaUrl(asset: MediaAsset, options: MediaOptions = {}) {
  if (asset.src) {
    return asset.src
  }

  if (!asset.publicId) {
    return '/images/poster.jpg'
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'
  const fit = options.fit || 'fill'
  const transforms = [...DEFAULT_TRANSFORMS]

  if (options.width) {
    transforms.push(`w_${options.width}`)
  }

  if (options.height) {
    transforms.push(`h_${options.height}`)
  }

  if (options.width || options.height) {
    transforms.push(`c_${fit}`)
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${asset.publicId}`
}
