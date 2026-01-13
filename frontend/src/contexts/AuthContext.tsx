import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'

interface User {
  phoneNo: string
  name?: string
  profileImage?: string | null
  neighborhood?: {
    sido: string
    sigungu: string
    eupmyeondong: string
  }
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const USER_STORAGE_KEY = 'billage_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 저장된 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout
      }}>
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
