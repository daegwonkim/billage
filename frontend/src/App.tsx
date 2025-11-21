import { useState } from 'react'
import { Main } from './pages/Main'
import { BottomNav } from './components/common/BottomNav'
import type { NavTab } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#f5f5f5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative'
        }}>
        <Main />
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}
