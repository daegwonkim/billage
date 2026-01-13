import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { BottomNav } from './components/common/BottomNav'
import type { NavTab } from './types'
import { RentalItemDetail } from './pages/RentalItemDetail'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Authentication from './pages/Authentication'
import RentalItemRegister from './pages/RentalItemRegister'
import { MyBillage } from './pages/MyBillage'

const queryClient = new QueryClient()

function AppContent() {
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const location = useLocation()
  const hideBottomNavPaths = ['/rental-items/']
  const showBottomNav = !hideBottomNavPaths.some(path =>
    location.pathname.includes(path)
  )

  // URL 기반으로 activeTab 결정
  const activeTab: NavTab = location.pathname === '/my' ? 'my' : 'home'

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') {
      window.location.href = '/'
    } else if (tab === 'my') {
      window.location.href = '/my'
    }
  }

  return (
    <div className="flex justify-center shadow-[0_0_60px_rgba(0,0,0,0.2)]">
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative'
        }}>
        <Routes>
          <Route
            path="/authentication"
            element={<Authentication />}
          />
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/my"
            element={<MyBillage />}
          />
          <Route
            path="/rental-items/:id"
            element={<RentalItemDetail />}
          />
        </Routes>
        {showBottomNav && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onRegisterClick={() => setShowRegisterModal(true)}
          />
        )}
        {showRegisterModal && (
          <RentalItemRegister onClose={() => setShowRegisterModal(false)} />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
