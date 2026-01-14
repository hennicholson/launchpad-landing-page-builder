'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface WhopUser {
  id: string
  email?: string | null
  username?: string | null
  unique_id?: string | null
  name?: string | null
  bio?: string | null
  profile_pic_url?: string | null
  banner_url?: string | null
  whop_created_at?: string | null
  user_type?: string | null
  roles?: string[]
  is_suspended?: boolean
}

interface InternalUser {
  id: string
  whopId: string
  whopUniqueId: string | null
  email: string | null
  username: string | null
  name: string | null
  bio: string | null
  avatarUrl: string | null
  bannerUrl: string | null
  plan: string
  projectCount: number
  deployCount: number
  isAdmin: boolean
  isSuspended: boolean
  lastLoginAt: string | null
  createdAt: string | null
}

interface UserContextType {
  whop: WhopUser | null
  user: InternalUser | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  refreshUser: () => Promise<void>
  syncUser: () => Promise<void>
  getHeaders: () => Record<string, string>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [whop, setWhop] = useState<WhopUser | null>(null)
  const [user, setUser] = useState<InternalUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!whop
  const isAdmin = user?.isAdmin ?? false

  // Build headers for API requests
  // NOTE: Don't include Content-Type for GET requests - it triggers CORS preflight
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {}

    if (typeof window !== 'undefined') {
      // Check if we're in Whop's production iframe
      // Whop's proxy will inject x-whop-* headers automatically - we should NOT send them ourselves
      const hostname = window.location.hostname
      const isWhopProduction = hostname.includes('.apps.whop.com') ||
                               hostname === 'onwhop.com' ||
                               hostname.endsWith('.netlify.app') ||
                               (!hostname.includes('localhost') && !hostname.includes('127.0.0.1'))

      if (isWhopProduction) {
        // In production: Send NO custom headers - Whop's proxy handles everything
        console.log('[getHeaders] Production mode - no custom headers')
        return headers
      }

      // In dev mode only: Send headers from localStorage
      const storedToken = localStorage.getItem('whop-dev-token')
      if (storedToken) {
        headers['x-whop-user-token'] = storedToken
        const storedUserId = localStorage.getItem('whop-dev-user-id')
        if (storedUserId) {
          headers['x-whop-user-id'] = storedUserId
        }
        console.log('[getHeaders] Dev mode - sending localStorage token')
      }
    }

    return headers
  }, [])

  // Sync user to internal database
  const syncUser = useCallback(async () => {
    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: getHeaders(),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        console.log('[User] Synced successfully:', data.user?.username)
      } else {
        console.error('[User] Sync failed:', response.status, data)
      }
    } catch (err) {
      console.error('[User] Failed to sync:', err)
    }
  }, [getHeaders])

  // Refresh user data from Whop (also syncs to DB)
  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users/me', {
        headers: getHeaders(),
      })

      const data = await response.json()

      if (data.whop) {
        setWhop(data.whop)
        console.log('[User] Whop user loaded:', data.whop?.username)
      }

      // User is now synced in the /api/users/me endpoint
      if (data.user) {
        setUser(data.user)
        console.log('[User] Internal user loaded:', data.user?.username, 'plan:', data.user?.plan)
      }
    } catch (err) {
      console.error('[User] Failed to fetch:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setIsLoading(false)
    }
  }, [getHeaders])

  // Initial fetch on mount
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <UserContext.Provider
      value={{
        whop,
        user,
        isLoading,
        error,
        isAuthenticated,
        isAdmin,
        refreshUser,
        syncUser,
        getHeaders,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
