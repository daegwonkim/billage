import { useState, useEffect } from 'react'

export interface OnboardingStatus {
  isAuthenticated: boolean
  isVerified: boolean
  hasNeighborhood: boolean
}

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus>({
    isAuthenticated: false,
    isVerified: false,
    hasNeighborhood: false
  })

  // 초기 로드 시 localStorage에서 상태 불러오기
  useEffect(() => {
    const savedStatus = localStorage.getItem('onboarding_status')
    if (savedStatus) {
      try {
        setStatus(JSON.parse(savedStatus))
      } catch (error) {
        console.error('Failed to parse onboarding status:', error)
      }
    }
  }, [])

  // 상태 업데이트 함수
  const updateStatus = (newStatus: Partial<OnboardingStatus>) => {
    setStatus(prev => {
      const updated = { ...prev, ...newStatus }
      localStorage.setItem('onboarding_status', JSON.stringify(updated))
      return updated
    })
  }

  // 온보딩 완료 여부
  const isOnboardingComplete =
    status.isAuthenticated && status.isVerified && status.hasNeighborhood

  // 상태 초기화 (로그아웃 등에 사용)
  const resetStatus = () => {
    const initialStatus = {
      isAuthenticated: false,
      isVerified: false,
      hasNeighborhood: false
    }
    setStatus(initialStatus)
    localStorage.removeItem('onboarding_status')
  }

  return {
    status,
    updateStatus,
    isOnboardingComplete,
    resetStatus
  }
}
