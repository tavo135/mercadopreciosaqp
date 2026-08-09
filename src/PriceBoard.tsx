import { useState, useEffect } from 'react'
import { supabase, type Price, type Market, type Product, QUALITY_TIERS } from './lib/supabase'
import { Link } from 'react-router-dom'
import { Search, MapPin, TrendingUp, Clock, Camera, Filter, ChevronRight } from 'lucide-react'
import { usePageTitle } from './lib/usePageTitle'
import { Language, translations } from './lib/i18n'

const FAQS = [
  {
    q: '¿Qué es PrecioMercadoAQP?',
    a: 'Es una plataforma comunitaria que muestra precios reales de frutas y verduras en los mercados de Arequipa. Los precios son reportados por compradores y vendedores, y verificados antes de publicarse.',
  },
  {
    q: '¿Qué mercados de Arequipa cubre?',
    a: 'Actualmente cubrimos el Mercado San Camilo, Mercado Rio Seco, Mercado Acomare y Mercado Avelino. Planeamos expandir a más mercados de la región.',
  },
  {
    q: '¿Cómo reporto un precio?',
    a: 'Toca "Reportar precio", toma una foto del producto con su precio, selecciona el producto y el mercado, e ingresa el precio en soles. Tu reporte será revisado y publicado en menos de 24 horas.',
  },
  {
    q: '¿Qué significa bolsa de rescate?',
    a: 'Es una opción donde el vendedor empaca productos maduros o con defectos menores a un precio reducido. No hay elección ni devoluciones. Es una forma de evitar el desperdicio de alimentos y ahorrar dinero.',
  },
  {
    q: '¿Los precios son exactos?',
    a: 'Los precios son referenciales y reportados por la comunidad. Cada reporte incluye foto, calidad del producto y la hora del reporte. Los precios pueden variar según el día, el puesto y la temporada. Verifica directamente con el vendedor.',
  },
]

const FAQS_EN = [
  {
    q: 'What is PrecioMercadoAQP?',
    a: 'It is a community platform that shows real prices for fruits and vegetables in Arequipa markets. Prices are reported by buyers and sellers and verified before publication.',
  },
  {
    q: 'Which Arequipa markets does it cover?',
    a: 'We currently cover San Camilo Market, Rio Seco Market, Acomare Market and Avelino Market. We plan to expand to more markets in the region.',
  },
  {
    q: 'How do I report a price?',
    a: 'Tap “Report price”, take a photo of the product with its price, select the product and market, and enter the price in soles. Your report will be reviewed and published in under 24 hours.',
  },
  {
    q: 'What does rescue bag mean?',
    a: 'It is an option where the seller packs ripe products or products with minor defects at a reduced price. There is no choice or returns. It helps reduce food waste and save money.',
  },
  {
    q: 'Are the prices exact?',
    a: 'Prices are reference values reported by the community. Each report includes a photo, product quality and time of report. Prices can vary by day, stall and season. Verify directly with the seller.',
  },
]

export default function PriceBoard({ language }: { language: Language }) {
  const t = translations[language]
  usePageTitle(
    language === 'es'
      ? 'Precios reales de mercados de Arequipa — PrecioMercadoAQP'
      : 'Real market prices in Arequipa — PrecioMercadoAQP',
    language === 'es'
      ? 'Consulta precios reales de papa, cebolla, tomate, limón, palta y más en los mercados de Arequipa. Información actualizada por la comunidad.'
      : 'Check real prices for potatoes, onions, tomatoes, lemons, avocados and more in Arequipa markets. Updated by the community.',
    '/',
  )

  const faqItems = language === 'es' ? FAQS : FAQS_EN

  const [prices, setPrices] = useState<Price[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedMarket, setSelectedMarket] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [selectedTier, setSelectedTier] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)

    try {
      const [pricesRes, marketsRes, productsRes] = await Promise.all([
        supabase
          .from('prices')
          .select('*, products(*), markets(*)')
          .eq('status', 'approved')
          .order('collected_at', { ascending: false }),
        supabase.from('markets').select('*').eq('status', 'active').order('name'),
        supabase.from('products').select('*').eq('status', 'active').order('name'),
      ])

      const firstError = [pricesRes, marketsRes, productsRes].find((result) => result.error)
      if (firstError?.error) {
        throw new Error(firstError.error.message)
      }

      if (pricesRes.data) setPrices(pricesRes.data as Price[])
      if (marketsRes.data) setMarkets(marketsRes.data as Market[])
      if (productsRes.data) setProducts(productsRes.data as Product[])
    } catch (err) {
      console.error('Failed to load market data:', err)
      setError('No pudimos cargar los precios en este momento. Intenta de nuevo más tarde.')
      setPrices([])
      setMarkets([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = prices.filter((p) => {
    const matchSearch = !search || (p.products?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchMarket = selectedMarket === 'all' || p.market_id === selectedMarket
    const matchProduct = selectedProduct === 'all' || p.product_id === selectedProduct
    const matchTier = selectedTier === 'all' || p.quality_tier === selectedTier
    return matchSearch && matchMarket && matchProduct && matchTier
  })

  // Group by product for a cleaner display
  const groupedByProduct = filtered.reduce((acc, p) => {
    const key = p.products?.name ?? 'Otros'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {} as Record<string, Price[]>)

  function formatTime(iso: string | null) {
    if (!iso) return 'Recién'
    const date = new Date(iso)
    const now = new Date()
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000)
    if (diffH < 1) return 'Hace menos de 1h'
    if (diffH < 24) return `Hace ${diffH}h`
    const diffD = Math.floor(diffH / 24)
    return `Hace ${diffD}d`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t.appTitle}
          </h1>
          <p className="mt-1.5 text-primary-100 text-sm sm:text-base hero-description">
            {t.appSubtitle}
          </p>

          {/* Search */}
          <div className="mt-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-white pl-11 pr-4 py-3.5 text-sm text-gray-900 shadow-lg outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          {/* Quick stats */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>
                {filtered.length} {t.pricesCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>
                {markets.length} {t.marketsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 space-y-2.5">
          {/* Market filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <Chip active={selectedMarket === 'all'} onClick={() => setSelectedMarket('all')}>
              {t.filterAllMarkets}
            </Chip>
            {markets.map((m) => (
              <Chip key={m.id} active={selectedMarket === m.id} onClick={() => setSelectedMarket(m.id)}>
                {m.name.replace('Mercado ', '')}
              </Chip>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-primary-400"
            >
              <option value="all">{t.filterAllProducts}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-primary-400"
            >
              <option value="all">{t.filterAllTiers}</option>
              {Object.entries(QUALITY_TIERS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price list */}
      <div className="max-w-5xl mx-auto px-4 py-5 pb-24">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-50 mb-4">
              <Filter className="w-7 h-7 text-error-500" />
            </div>
            <p className="text-gray-700 font-medium">{error}</p>
            <button onClick={() => loadData()} className="btn-primary mt-5">
              {t.retry}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">{t.noResults}</p>
            <p className="text-gray-400 text-sm mt-1">{t.noResultsText}</p>
            <Link to="/reportar" className="btn-primary mt-5">
              <Camera className="w-4 h-4" /> {t.reportPrice}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByProduct).map(([productName, productPrices]) => (
              <div key={productName}>
                <h2 className="text-lg font-bold text-gray-900 mb-2.5 capitalize flex items-center gap-2">
                  {productName}
                  <span className="text-xs font-normal text-gray-400">
                    {productPrices.length} {productPrices.length === 1 ? 'precio' : 'precios'}
                  </span>
                </h2>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {productPrices.map((price) => {
                    const tier = QUALITY_TIERS[price.quality_tier]
                    return (
                      <div key={price.id} className="card p-3.5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary-500" />
                              <span className="font-medium truncate">
                                {price.markets?.name?.replace('Mercado ', '') ?? '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`badge ${tier.color}`}>{tier.label}</span>
                              <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                {formatTime(price.collected_at)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-bold text-gray-900">
                              S/ {Number(price.price_pen).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">/ {price.unit ?? 'kg'}</div>
                          </div>
                        </div>
                        {price.notes && (
                          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
                            {price.notes}
                          </p>
                        )}
                        {price.photo_url && (
                          <img
                            src={price.photo_url}
                            alt={`Foto del precio de ${productName}`}
                            className="mt-2.5 w-full h-32 object-cover rounded-lg"
                            loading="lazy"
                          />
                        )}
                        {price.reporter_name && (
                          <p className="mt-2 text-xs text-gray-400">
                            Reportado por {price.reporter_name}
                            {price.reporter_reputation ? ` · ${'★'.repeat(price.reporter_reputation)}` : ''}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO content section */}
      <section className="max-w-5xl mx-auto px-4 py-8 border-t border-gray-100">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Precios de mercados de Arequipa
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              PrecioMercadoAQP es la plataforma comunitaria de transparencia de precios
              para los mercados de Arequipa, Perú. Aquí encuentdas precios reales de
              papa, cebolla, tomate, limón, palta y otros productos reportados por
              compradores y vendedores del Mercado San Camilo, Mercado Rio Seco,
              Mercado Acomare y Mercado Avelino. Cada precio incluye información sobre la calidad del
              producto — primera, segunda o bolsa de rescate — para que tomes la mejor
              decisión de compra.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ¿Por qué usar PrecioMercadoAQP?
            </h2>
            <ul className="text-sm text-gray-500 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                Precios actualizados regularmente por la comunidad arequipeña
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                Compara precios entre mercados antes de salir de casa
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                Identifica productos en bolsa de rescate y ahorra en alimentos
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                Información con foto y hora del reporte para mayor confianza
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {language === 'es' ? 'Preguntas frecuentes sobre precios en mercados de Arequipa' : 'Frequently asked questions about prices in Arequipa markets'}
        </h2>
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <div key={faq.q} className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{faq.q}</h3>
              <p className="faq-answer text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <Link
        to="/reportar"
        className="fixed bottom-5 right-5 z-20 btn-primary rounded-full shadow-lg shadow-primary-500/30 px-4 py-3 sm:px-5 sm:py-3.5"
      >
        <Camera className="w-5 h-5" />
        <span className="hidden sm:inline">{t.reportPrice}</span>
      </Link>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-primary-500 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
