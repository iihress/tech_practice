import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  setAuth: (user: AuthUser, token: string) => void
  updateUser: (user: AuthUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('vh_token', token)
        set({ user, token })
      },
      updateUser: (user) => set({ user }),
      clearAuth: () => {
        localStorage.removeItem('vh_token')
        localStorage.removeItem('vh_user')
        set({ user: null, token: null })
      },
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'vh_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
