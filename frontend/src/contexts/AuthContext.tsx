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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GetMeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthenticated()
  }, [])

  const checkAuthenticated = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: 'include',
        cache: 'no-store'
      })

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
    return <Loader2 />
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
