import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStatus } from './hooks/useOnboardingStatus'

type OnboardingStep = 'authentication' | 'verification' | 'neighborhood'

interface ProtectedOnboardingRouteProps {
  children: React.ReactNode
  requiredStep: OnboardingStep
}

export function ProtectedOnboardingRoute({
  children,
  requiredStep
}: ProtectedOnboardingRouteProps) {
  const { status } = useOnboardingStatus()
  const navigate = useNavigate()

  useEffect(() => {
    // verification 페이지는 authentication 완료 필요
    if (requiredStep === 'verification' && !status.isAuthenticated) {
      navigate('/onboarding/authentication', { replace: true })
      return
    }

    // neighborhood 페이지는 verification 완료 필요
    if (requiredStep === 'neighborhood' && !status.isVerified) {
      // authentication도 안 됐으면 authentication으로
      if (!status.isAuthenticated) {
        navigate('/onboarding/authentication', { replace: true })
      } else {
        navigate('/onboarding/verification', { replace: true })
      }
      return
    }
  }, [status, requiredStep, navigate])

  // 조건을 만족하면 children 렌더링
  if (requiredStep === 'verification' && !status.isAuthenticated) {
    return null
  }

  if (requiredStep === 'neighborhood' && !status.isVerified) {
    return null
  }

  return <>{children}</>
}
