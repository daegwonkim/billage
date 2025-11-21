import { Home, Calendar, PlusCircle, MessageCircle, User } from 'lucide-react'
import type { NavTab } from '../../types'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

const NAV_ITEMS = [
  { id: 'home' as NavTab, icon: Home, label: '홈' },
  { id: 'category' as NavTab, icon: Calendar, label: '커뮤니티' },
  { id: 'add' as NavTab, icon: PlusCircle, label: '등록' },
  { id: 'chat' as NavTab, icon: MessageCircle, label: '채팅' },
  { id: 'my' as NavTab, icon: User, label: 'My 번개장' }
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e5e5'
      }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          height: '64px'
        }}>
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              background: 'none',
              color: activeTab === id ? '#ef4444' : '#999',
              cursor: 'pointer'
            }}>
            <Icon size={24} />
            <span style={{ fontSize: '11px' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
