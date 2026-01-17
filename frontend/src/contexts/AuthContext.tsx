import type { GetMeResponse } from '@/api/user/dto/GetMe'
import { Loader2 } from 'lucide-react'
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback
} from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!

interface AuthContextType {
  user: GetMeResponse | null
  login: (user: GetMeResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// 토큰 재발급 중복 요청 방지
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function tryReissueToken(): Promise<boolean> {
  // 이미 재발급 중이면 기존 Promise 재사용
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      return response.ok
    } catch {
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GetMeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthenticated()
  }, [])

  const checkAuthenticated = async () => {
    try {
      const fetchGetMe = async () => {
        return await fetch(`${API_BASE_URL}/api/users/me`, {
          credentials: 'include',
          cache: 'no-store'
        })
      }

      let response = await fetchGetMe()

      if (response.status === 401) {
        const reissued = await tryReissueToken()
        if (reissued) {
          response = await fetchGetMe()
        } else {
          setUser(null)
        }
      }

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback((user: GetMeResponse) => {
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
