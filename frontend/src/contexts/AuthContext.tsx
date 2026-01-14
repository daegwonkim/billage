import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode
} from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value)
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, logout }}>
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
