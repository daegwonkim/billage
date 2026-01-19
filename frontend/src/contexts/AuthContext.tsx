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
  userId: number | null
  login: (userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthenticated()
  }, [])

  const checkAuthenticated = async () => {
    try {
      const response = await customFetch<GetMeResponse>('/api/users/me', {
        cache: 'no-store'
      })
      setIsAuthenticated(true)
      setUserId(response.id)
    } catch {
      setIsAuthenticated(false)
      setUserId(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback((id: number) => {
    setIsAuthenticated(true)
    setUserId(id)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setUserId(null)
  }, [])

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
