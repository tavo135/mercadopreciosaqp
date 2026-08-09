import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockCreateClient = vi.fn(() => ({
  from: vi.fn(),
  storage: {
    from: vi.fn(),
  },
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}))

describe('supabase client configuration', () => {
  const previousEnv = { ...import.meta.env }

  beforeEach(() => {
    mockCreateClient.mockReset()
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
  })

  afterEach(() => {
    Object.assign(import.meta.env, previousEnv)
    vi.unstubAllEnvs()
  })

  it('creates a client when env values are present', async () => {
    const { getSupabaseClient } = await import('./supabase')

    const client = getSupabaseClient()

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({ auth: expect.objectContaining({ persistSession: false }) }),
    )
    expect(client).toBeDefined()
  })

  it('uses safe fallback values when supabase env variables are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { getSupabaseClient } = await import('./supabase')

    const client = getSupabaseClient()

    expect(client).toBeDefined()
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder-anon-key',
      expect.any(Object),
    )
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Faltan variables de entorno de Supabase'))

    warnSpy.mockRestore()
  })
})
