import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Main } from './pages/Main'
import { BottomNav } from './components/common/BottomNav'
import type { NavTab } from './types'
import { RentalItemDetail } from './pages/RentalItemDetail'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OnboardingStart from './pages/OnboardingStart'
import OnboardingNeighborhood from './pages/OnboardingNeighborhood'
import OnboardingAuthentication from './pages/OnboardingAuthentication'
import OnboardingVerification from './pages/OnboardingVerification'
import OnboardingSignin from './pages/OnboardingSignin'

const queryClient = new QueryClient()

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  const location = useLocation()
  const hideBottomNavPaths = ['/rental-items/', '/onboarding']
  const showBottomNav = !hideBottomNavPaths.some(path =>
    location.pathname.includes(path)
  )

  return (
    <div
      className="bg-red-50"
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative'
        }}>
        <Routes>
          <Route
            path="/onboarding"
            element={<OnboardingStart />}
          />
          <Route
            path="/onboarding/authentication"
            element={<OnboardingAuthentication />}
          />
          <Route
            path="/onboarding/verification"
            element={<OnboardingVerification />}
          />
          <Route
            path="/onboarding/neighborhood"
            element={<OnboardingNeighborhood />}
          />
          <Route
            path="/onboarding/signin"
            element={<OnboardingSignin />}
          />
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/rental-items/:id"
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
