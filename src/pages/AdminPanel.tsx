import { useState, useEffect } from 'react'
import { supabase, type Price, QUALITY_TIERS } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Clock, MapPin, ImageOff } from 'lucide-react'
import { usePageTitle } from '../lib/usePageTitle'
import { Language, translations } from '../lib/i18n'

type FilterStatus = 'pending' | 'approved' | 'rejected'

export default function AdminPanel({ language }: { language: Language }) {
  const t = translations[language]
  usePageTitle(
    language === 'es' ? 'Administración — PrecioMercadoAQP' : 'Administration — PrecioMercadoAQP',
    language === 'es'
      ? 'Revisión y moderación de reportes de precios en mercados de Arequipa para mantener la información confiable.'
      : 'Review and moderation of price reports in Arequipa markets to keep information reliable.',
    '/admin',
  )
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadPrices()
  }, [filter])

  async function loadPrices() {
    setLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('prices')
        .select('*, products(*), markets(*)')
        .eq('status', filter)
        .order('created_at', { ascending: false })

      if (queryError) {
        throw new Error(queryError.message)
      }

      setPrices((data ?? []) as Price[])
    } catch (err) {
      console.error('Failed to load admin prices:', err)
      setError('No pudimos cargar los reportes. Intenta de nuevo en unos minutos.')
      setPrices([])
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setActionLoading(id)
    const { error } = await supabase
      .from('prices')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setPrices((prev) => prev.filter((p) => p.id !== id))
    }
    setActionLoading(null)
  }

  const counts = {
    pending: prices.filter((p) => p.status === 'pending').length,
    approved: 0,
    rejected: 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{t.adminTitle}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 pb-24">
        {/* Tabs */}
        <div className="flex gap-1.5 mb-5">
          {(['pending', 'approved', 'rejected'] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === 'pending' ? t.adminPending : s === 'approved' ? t.adminApproved : t.adminRejected}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-error-50 mb-3">
              <Check className="w-6 h-6 text-error-500" />
            </div>
            <p className="text-gray-700 font-medium">{error}</p>
            <button onClick={() => loadPrices()} className="btn-primary mt-5">
              Reintentar
            </button>
          </div>
        ) : prices.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
              <Check className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {filter === 'pending' ? t.adminNoPending : filter === 'approved' ? t.adminNoApproved : t.adminNoRejected}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prices.map((price) => {
              const tier = QUALITY_TIERS[price.quality_tier]
              return (
                <div key={price.id} className="card overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 capitalize">
                            {price.products?.name ?? '—'}
                          </h3>
                          <span className={`badge ${tier.color}`}>{tier.label}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {price.markets?.name?.replace('Mercado ', '') ?? '—'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {price.collected_at
                              ? new Date(price.collected_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
                              : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-gray-900">
                          S/ {Number(price.price_pen).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">/ {price.unit ?? 'kg'}</div>
                      </div>
                    </div>

                    {price.photo_url ? (
                      <img
                        src={price.photo_url}
                        alt={`Foto de ${price.products?.name ?? 'precio'}`}
                        className="mt-3 w-full h-40 object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="mt-3 flex items-center justify-center h-20 bg-gray-50 rounded-lg text-gray-400 text-xs">
                        <ImageOff className="w-5 h-5 mr-1.5" /> {t.withoutPhoto}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                      {price.reporter_name && <p>{t.reporter} {price.reporter_name}</p>}
                      {price.reporter_phone && <p>{t.cellphone} {price.reporter_phone}</p>}
                      {price.notes && <p className="bg-gray-50 rounded px-2 py-1.5 mt-1">{price.notes}</p>}
                    </div>
                  </div>

                  {filter === 'pending' && (
                    <div className="flex border-t border-gray-100">
                      <button
                        onClick={() => updateStatus(price.id, 'approved')}
                        disabled={actionLoading === price.id}
                        className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-success-600 hover:bg-success-50 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> {t.approve}
                      </button>
                      <div className="w-px bg-gray-100" />
                      <button
                        onClick={() => updateStatus(price.id, 'rejected')}
                        disabled={actionLoading === price.id}
                        className="flex-1 py-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-error-600 hover:bg-error-50 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> {t.reject}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
