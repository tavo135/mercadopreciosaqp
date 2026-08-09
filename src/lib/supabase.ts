import { createClient } from '@supabase/supabase-js'

const REQUIRED_ENV_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'placeholder-anon-key'

export function hasSupabaseConfig() {
  return REQUIRED_ENV_VARS.every((key) => Boolean(import.meta.env[key]?.trim()))
}

export function getSupabaseClient() {
  const missingVars = REQUIRED_ENV_VARS.filter((key) => !import.meta.env[key]?.trim())

  if (missingVars.length > 0) {
    console.warn(
      `Faltan variables de entorno de Supabase: ${missingVars.join(', ')}. ` +
        'Se usará una configuración temporal para que la app pueda renderizar.',
    )
  }

  return createClient(
    import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}

export const supabase = getSupabaseClient()

export type Market = {
  id: string
  name: string
  city: string | null
  type: 'retail' | 'wholesale' | 'rural' | 'fishing' | null
  status: string | null
  created_at: string
}

export type Product = {
  id: string
  name: string
  category: 'tuberculo' | 'fruta' | 'verdura' | 'otro' | null
  unit: string | null
  status: string | null
  created_at: string
}

export type Price = {
  id: string
  product_id: string
  market_id: string
  price_pen: number
  unit: string | null
  quality_tier: 'primera' | 'segunda' | 'rescate'
  purchase_mode: 'choice' | 'surprise_bag' | 'rescue'
  source_type: 'manual' | 'whatsapp' | 'voice' | 'vendor_self'
  photo_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  reporter_name: string | null
  reporter_phone: string | null
  reporter_reputation: number | null
  notes: string | null
  collected_at: string | null
  created_at: string
  products?: Product
  markets?: Market
}

export type Vendor = {
  id: string
  name: string
  phone: string | null
  stall_number: string | null
  market_id: string | null
  has_smartphone: boolean | null
  has_internet: boolean | null
  preferred_contact: string | null
  proxy_name: string | null
  proxy_phone: string | null
  proxy_relationship: string | null
  vendor_type: string | null
  zone: string | null
  schedule: string | null
  town: string | null
  transport_contact: string | null
  verified: boolean | null
  created_at: string
  markets?: Market
}

export const QUALITY_TIERS = {
  primera: { label: 'Primera', description: 'Fresco, sin defectos', color: 'bg-success-100 text-success-700' },
  segunda: { label: 'Segunda', description: 'Maduro, para hoy', color: 'bg-accent-100 text-accent-700' },
  rescate: { label: 'Bolsa Rescate', description: 'Mix aleatorio, sin elección', color: 'bg-error-100 text-error-700' },
} as const

export const PURCHASE_MODES = {
  choice: { label: 'A elección', description: 'El comprador elige' },
  surprise_bag: { label: 'Bolsa sorpresa', description: 'El vendedor empaca' },
  rescue: { label: 'Rescate', description: 'Sin reclamos ni devoluciones' },
} as const
