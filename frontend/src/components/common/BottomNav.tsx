import { Home, PanelTop, PlusCircle, MessageCircle, User } from 'lucide-react'
import type { NavTab } from '../../types'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  onRegisterClick: () => void
}

const NAV_ITEMS = [
  { id: 'home' as NavTab, icon: Home, label: '홈' },
  { id: 'category' as NavTab, icon: PanelTop, label: '커뮤니티' },
  { id: 'add' as NavTab, icon: PlusCircle, label: '등록' },
  { id: 'chat' as NavTab, icon: MessageCircle, label: '채팅' },
  { id: 'my' as NavTab, icon: User, label: 'My 빌리지' }
]

export function BottomNav({
  activeTab,
  onTabChange,
  onRegisterClick
}: BottomNavProps) {
  const handleTabClick = (tab: NavTab) => {
    if (tab === 'add') {
      onRegisterClick()
    } else {
      onTabChange(tab)
    }
  }

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-gray-200 bg-white">
      <div className="grid h-16 grid-cols-5">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-none bg-transparent transition-colors ${
              activeTab === id ? 'text-black' : 'text-gray-500'
            }`}>
            <Icon
              size={22}
              strokeWidth={activeTab === id ? 2 : 1.5}
            />
            <span className="text-[12px]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
