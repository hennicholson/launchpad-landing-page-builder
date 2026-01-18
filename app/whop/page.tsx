'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function WhopEntryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check what auth sources are available
    const urlToken = searchParams.get('whop-dev-user-token')
    const storedToken = localStorage.getItem('whop-dev-token')
    const injectedAuth = (window as any).__WHOP_AUTH__

    console.log('[Whop Entry] Auth sources:', {
      urlToken: !!urlToken,
      storedToken: !!storedToken,
      injectedToken: !!injectedAuth?.token,
    })

    // Priority 1: URL params (dev mode)
    if (urlToken) {
      console.log('[Whop Entry] Using URL token')
      localStorage.setItem('whop-dev-token', urlToken)

      try {
        const parts = urlToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          console.log('[Whop Entry] URL token payload:', payload)
          localStorage.setItem('whop-dev-user-id', payload.sub || '')
        }
      } catch (e) {
        console.error('[Whop Entry] Failed to decode URL token:', e)
      }
    }
    // Priority 2: Injected from layout (production - headers captured by server layout)
    else if (injectedAuth?.token && !storedToken) {
      console.log('[Whop Entry] Using injected token from layout')
      localStorage.setItem('whop-dev-token', injectedAuth.token)

      try {
        const parts = injectedAuth.token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          console.log('[Whop Entry] Injected token payload:', payload)
          localStorage.setItem('whop-dev-user-id', payload.sub || injectedAuth.userId || '')
        }
      } catch (e) {
        console.error('[Whop Entry] Failed to decode injected token:', e)
      }
    }

    // Verify token is stored before redirecting
    const finalToken = localStorage.getItem('whop-dev-token')
    console.log('[Whop Entry] Final token stored:', !!finalToken, 'length:', finalToken?.length || 0)

    // Redirect to dashboard
    router.replace('/dashboard')
  }, [searchParams, router])

  return (
    <div className="h-screen bg-[#0a0a0b] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-sm">Loading LaunchPad...</p>
      </div>
    </div>
  )
}

export default function WhopEntry() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">Loading LaunchPad...</p>
        </div>
      </div>
    }>
      <WhopEntryContent />
    </Suspense>
  )
}
