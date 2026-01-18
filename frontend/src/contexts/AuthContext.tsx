import { customFetch } from '@/api/customFetch'
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

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthenticated()
  }, [])

  const checkAuthenticated = async () => {
    try {
      await customFetch<GetMeResponse>('/api/users/me', {
        cache: 'no-store'
      })
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
