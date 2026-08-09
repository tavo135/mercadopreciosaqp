import { useEffect } from 'react'

const DEFAULT_SITE_URL = 'https://mercadoaqp.js.org'

function setMeta(name: string, value: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!tag) {
    tag = document.createElement('meta')
    if (property) {
      tag.setAttribute('property', name)
    } else {
      tag.setAttribute('name', name)
    }
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', value)
}

export function usePageTitle(title: string, description?: string, path = '/') {
  useEffect(() => {
    document.title = title

    const metaDescription =
      description ??
      'Consulta precios reales de frutas y verduras en los mercados de Arequipa. Precios verificados por la comunidad.'

    setMeta('description', metaDescription)
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('og:title', title, true)
    setMeta('og:description', metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:locale', 'es_PE', true)

    const canonicalUrl = `${DEFAULT_SITE_URL}${path === '/' ? '' : path}`
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }

    canonical.setAttribute('href', canonicalUrl)
  }, [title, description, path])
}
