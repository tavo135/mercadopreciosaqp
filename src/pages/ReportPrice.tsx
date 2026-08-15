import { useState, useEffect } from 'react'
import { supabase, type Market, type Product, QUALITY_TIERS } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Check, Upload, X } from 'lucide-react'
import { usePageTitle } from '../lib/usePageTitle'
import { Language, translations } from '../lib/i18n'

export default function ReportPrice({ language }: { language: Language }) {
  const navigate = useNavigate()
  const t = translations[language]
  usePageTitle(
    language === 'es' ? 'Reportar precio de mercado — PrecioMercadoAQP' : 'Report market price — PrecioMercadoAQP',
    language === 'es'
      ? 'Reporta precios reales de productos en mercados de Arequipa para ayudar a la comunidad y mantener el tablero actualizado.'
      : 'Report real product prices in Arequipa markets to help the community and keep the board up to date.',
    '/reportar',
  )
  const [markets, setMarkets] = useState<Market[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    product_id: '',
    market_id: '',
    price_pen: '',
    quality_tier: 'primera' as 'primera' | 'segunda' | 'rescate',
    purchase_mode: 'choice' as 'choice' | 'surprise_bag' | 'rescue',
    source_type: 'manual' as 'manual' | 'whatsapp' | 'voice' | 'vendor_self',
    reporter_name: '',
    reporter_phone: '',
    notes: '',
    collected_at: new Date().toISOString().slice(0, 16),
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('markets').select('*').eq('status', 'active').order('name'),
      supabase.from('products').select('*').eq('status', 'active').order('name'),
    ]).then(([mRes, pRes]) => {
      if (mRes.data) setMarkets(mRes.data as Market[])
      if (pRes.data) setProducts(pRes.data as Product[])
    })
  }, [])

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function clearPhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.product_id || !form.market_id || !form.price_pen) {
      setError(t.errorRequired)
      return
    }

    setLoading(true)

    let photoUrl: string | null = null

    // Upload photo if provided
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('price-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        console.warn('Photo upload failed:', uploadError.message)
      } else {
        const { data: pubData } = supabase.storage
          .from('price-photos')
          .getPublicUrl(fileName)
        photoUrl = pubData.publicUrl
      }
    }

    const { error: insertError } = await supabase.from('prices').insert({
      product_id: form.product_id,
      market_id: form.market_id,
      price_pen: parseFloat(form.price_pen),
      quality_tier: form.quality_tier,
      purchase_mode: form.purchase_mode,
      source_type: form.source_type,
      photo_url: photoUrl,
      status: 'pending',
      reporter_name: form.reporter_name || null,
      reporter_phone: form.reporter_phone || null,
      notes: form.notes || null,
      collected_at: form.collected_at ? new Date(form.collected_at).toISOString() : null,
    })

    setLoading(false)

    if (insertError) {
      setError(t.errorSubmit)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-4">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t.reportSubmitted}</h2>
          <p className="mt-2 text-gray-500 text-sm">{t.reportDialogText}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="btn-secondary">
              {t.seeBoard}
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setForm({
                  product_id: '', market_id: '', price_pen: '',
                  quality_tier: 'primera', purchase_mode: 'choice',
                  source_type: 'manual', reporter_name: '', reporter_phone: '',
                  notes: '', collected_at: new Date().toISOString().slice(0, 16),
                })
                clearPhoto()
              }}
              className="btn-primary"
            >
              {t.reportAnother}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{language === 'es' ? 'Reportar un precio' : 'Report a price'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-5 pb-24 space-y-5">
        <p className="text-sm text-gray-500">{t.reportPageSubtitle}</p>

        {/* Photo upload */}
        <div>
          <label className="label">{t.photoLabel}</label>
          {photoPreview ? (
            <div className="relative">
              <img src={photoPreview} alt="Vista previa" className="w-full h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">{language === 'es' ? 'Toma o sube una foto de la etiqueta' : 'Take or upload a photo of the label'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.photoHint}</p>
            </label>
          )}
        </div>

        {/* Product & Market */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t.productLabel}</label>
            <select
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className="input"
              required
            >
              <option value="">{language === 'es' ? 'Selecciona...' : 'Select...'}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t.marketLabel}</label>
            <select
              value={form.market_id}
              onChange={(e) => setForm({ ...form, market_id: e.target.value })}
              className="input"
              required
            >
              <option value="">{language === 'es' ? 'Selecciona...' : 'Select...'}</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="label">{t.priceLabel}</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={form.price_pen}
              onChange={(e) => setForm({ ...form, price_pen: e.target.value })}
              className="input pl-10"
              required
            />
          </div>
        </div>

        {/* Quality tier */}
        <div>
          <label className="label">{t.qualityLabel}</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(QUALITY_TIERS).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, quality_tier: key as typeof form.quality_tier })}
                className={`rounded-xl border p-3 text-center transition-all ${
                  form.quality_tier === key
                    ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900">{val.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{val.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Source type */}
        <div>
          <label className="label">{t.sourceLabel}</label>
          <select
            value={form.source_type}
            onChange={(e) => setForm({ ...form, source_type: e.target.value as typeof form.source_type })}
            className="input"
          >
            <option value="manual">{language === 'es' ? 'Lo vi en el mercado' : 'I saw it at the market'}</option>
            <option value="vendor_self">{language === 'es' ? 'Soy el vendedor' : 'I am the seller'}</option>
            <option value="whatsapp">{language === 'es' ? 'Por WhatsApp' : 'Via WhatsApp'}</option>
            <option value="voice">{language === 'es' ? 'Por voz/llamada' : 'By voice/call'}</option>
          </select>
        </div>

        {/* Reporter info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t.reporterName}</label>
            <input
              type="text"
              placeholder={language === 'es' ? 'Ej: María' : 'Ex: Maria'}
              value={form.reporter_name}
              onChange={(e) => setForm({ ...form, reporter_name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">{t.reporterPhone}</label>
            <input
              type="tel"
              placeholder={language === 'es' ? 'Ej: 9XX XXX XXX' : 'Ex: 9XX XXX XXX'}
              value={form.reporter_phone}
              onChange={(e) => setForm({ ...form, reporter_phone: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">{t.notesLabel}</label>
          <textarea
            placeholder={language === 'es' ? 'Ej: Puesto cerca de la sección de pollos' : 'Ex: Stand near the chicken section'}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input min-h-[80px] resize-none"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-error-50 border border-error-200 px-4 py-3 text-sm text-error-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? (
            <>
              <Upload className="w-4 h-4 animate-pulse" /> {t.sending}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> {t.sendReport}
            </>
          )}
        </button>
      </form>
    </div>
  )
}
