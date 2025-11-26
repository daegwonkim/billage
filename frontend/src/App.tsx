import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Main } from './pages/Main'
import { BottomNav } from './components/common/BottomNav'
import type { NavTab } from './types'
import { RentalItemDetail } from './pages/RentalItemDetail'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  const location = useLocation()
  const showBottomNav = !location.pathname.includes('/api/rental-items/')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        outline: 'solid #e5e5e5 1px'
      }}>
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#f5f5f5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative'
        }}>
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/api/rental-items/:id"
            element={<RentalItemDetail />}
          />
        </Routes>
        {showBottomNav && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
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
