import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PriceBoard from './PriceBoard'
import ReportPrice from './pages/ReportPrice'
import AdminPanel from './pages/AdminPanel'
import { Shield, X } from 'lucide-react'
import { Language, translations } from './lib/i18n'

export const languageStorageKey = 'precio-mercado-aqp-language'

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem(languageStorageKey)
  return stored === 'en' ? 'en' : 'es'
}

export default function App() {
  const location = useLocation()
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [language, setLanguage] = useState<Language>(getStoredLanguage)

  useEffect(() => {
    localStorage.setItem(languageStorageKey, language)
  }, [language])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const t = translations[language]

  async function askAI() {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: "What is the best price for kilo of onion in Arequipa?",
            parameters: {
              max_new_tokens: 50, temperature: 0.7},
          }),
        }
      );
      const result = await response.json();
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {showDisclaimer && (
        <div className="bg-gray-900 text-gray-300 text-[11px] sm:text-xs px-3 sm:px-4 py-2.5 flex items-start gap-2.5">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
          <p className="flex-1 leading-relaxed">{t.disclaimer}</p>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="p-0.5 -mt-0.5 -mr-1 text-gray-500 hover:text-gray-200 flex-shrink-0"
            aria-label={t.close}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">PrecioMercadoAQP</div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${language === 'es' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${language === 'en' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
            >
              EN
            </button>
            <button onClick={askAI}>Ask AI</button>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<PriceBoard language={language} />} />
        <Route path="/reportar" element={<ReportPrice language={language} />} />
        <Route path="/admin" element={<AdminPanel language={language} />} />
        <Route path="*" element={<PriceBoard language={language} />} />
      </Routes>

      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-3 py-5 text-center sm:px-4">
          <p className="text-sm font-semibold text-gray-700">PrecioMercadoAQP</p>
          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            {language === 'es'
              ? 'Precios reales de mercados de Arequipa, verificados por la comunidad.'
              : 'Real market prices in Arequipa, verified by the community.'}
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-gray-400 sm:gap-4 sm:text-xs">
            <Link to="/" className="hover:text-primary-600">{t.footerBoard}</Link>
            <Link to="/reportar" className="hover:text-primary-600">{t.footerReport}</Link>
            <Link to="/admin" className="hover:text-primary-600">{t.footerAdmin}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
