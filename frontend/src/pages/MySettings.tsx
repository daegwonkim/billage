import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Receipt,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  UserX
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { signOut, withdraw } from '@/api/auth/auth'
import { useState } from 'react'

interface MenuItem {
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

export function MySettings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const handleLogout = async () => {
    await signOut()
    logout()
    navigate('/')
  }

  const menuItems: MenuItem[] = [
    {
      icon: <Heart size={22} />,
      label: '좋아요 목록',
      onClick: () => {
        // TODO: 좋아요 목록 페이지로 이동
      }
    }
    // {
    //   icon: <Receipt size={22} />,
    //   label: '거래내역',
    //   onClick: () => {
    //     // TODO: 거래내역 페이지로 이동
    //   }
    // }
  ]

  const settingItems: MenuItem[] = [
    {
      icon: <Bell size={22} />,
      label: '알림 설정',
      onClick: () => {
        // TODO: 알림 설정 페이지로 이동
      }
    },
    {
      icon: <Shield size={22} />,
      label: '개인정보 설정',
      onClick: () => {
        // TODO: 개인정보 설정 페이지로 이동
      }
    }
  ]

  const supportItems: MenuItem[] = [
    {
      icon: <HelpCircle size={22} />,
      label: '고객센터',
      onClick: () => {
        // TODO: 고객센터 페이지로 이동
      }
    },
    {
      icon: <FileText size={22} />,
      label: '이용약관',
      onClick: () => {
        // TODO: 이용약관 페이지로 이동
      }
    }
  ]

  const accountItems: MenuItem[] = [
    {
      icon: <LogOut size={22} />,
      label: '로그아웃',
      onClick: () => setShowLogoutModal(true)
    },
    {
      icon: <UserX size={22} />,
      label: '회원탈퇴',
      onClick: () => setShowWithdrawModal(true),
      variant: 'danger'
    }
  ]

  const MenuSection = ({
    title,
    items
  }: {
    title: string
    items: MenuItem[]
  }) => (
    <div className="mb-2">
      <div className="px-4 py-2">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      </div>
      <div className="bg-white">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <span
                className={
                  item.variant === 'danger' ? 'text-red-500' : 'text-gray-600'
                }>
                {item.icon}
              </span>
              <span
                className={`text-[15px] ${
                  item.variant === 'danger'
                    ? 'text-red-500'
                    : 'text-neutral-800'
                }`}>
                {item.label}
              </span>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-400"
            />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-md bg-gray-50">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
          <ChevronLeft
            size={24}
            className="text-neutral-700"
          />
        </button>
        <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
          설정
        </div>
      </div>

      {/* 메뉴 섹션들 */}
      <div className="pt-2">
        <MenuSection
          title="내 활동"
          items={menuItems}
        />
        {/* <MenuSection
          title="설정"
          items={settingItems}
        />
        <MenuSection
          title="고객지원"
          items={supportItems}
        /> */}
        <MenuSection
          title="계정"
          items={accountItems}
        />
      </div>

      {/* 앱 버전 */}
      <div className="py-6 text-center text-xs text-gray-400">Billage inc.</div>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-60 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              로그아웃
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              정말 로그아웃 하시겠어요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-neutral-700 transition-colors hover:bg-gray-200">
                취소
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-neutral-800">
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowWithdrawModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-60 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              회원탈퇴
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              정말 탈퇴하시겠어요?
              <br />
              탈퇴 시 모든 데이터가 삭제되며 복구할 수 없어요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-neutral-700 transition-colors hover:bg-gray-200">
                취소
              </button>
              <button
                onClick={async () => {
                  await withdraw()
                  logout()
                  navigate('/')
                }}
                className="flex-1 rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700">
                탈퇴하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
