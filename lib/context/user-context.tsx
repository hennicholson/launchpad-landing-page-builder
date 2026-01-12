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
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (typeof window !== 'undefined') {
      // Check for dev mode tokens in localStorage
      const devToken = localStorage.getItem('whop-dev-token')
      const devUserId = localStorage.getItem('whop-dev-user-id')

      if (devToken) {
        headers['x-whop-user-token'] = devToken
      }
      if (devUserId) {
        headers['x-whop-user-id'] = devUserId
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
        credentials: 'include', // Forward cookies for Whop auth
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
        credentials: 'include', // Forward cookies for Whop auth
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
