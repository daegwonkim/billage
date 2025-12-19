import logo from '@/assets/logo.png'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingStart() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-md flex-col items-center justify-center p-4">
      <div className="flex w-full flex-1 flex-col items-center justify-center px-6">
        <img
          className="mb-6 drop-shadow-lg"
          src={logo}
          style={{ width: '150px' }}
        />

        <h3 className="mb-3 text-2xl font-bold text-gray-800">
          "사지 말고, 빌리지"
        </h3>

        <p className="text-center leading-relaxed text-gray-700">
          대여가 필요한 모든 순간
          <br />
          지금 내 동네를 선택하고 시작해보세요!
        </p>
      </div>

      <div className="w-full space-y-4 px-6 pb-10">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-400 py-4 font-semibold text-white shadow-lg"
          onClick={() => navigate('/onboarding/authentication')}>
          <span>시작하기</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="text-center text-sm text-gray-500">
          이미 계정이 있나요?{' '}
          <span
            className="cursor-pointer font-semibold text-red-400"
            onClick={() => navigate('/onboarding/signin')}>
            로그인
          </span>
        </div>
      </div>
    </div>
  )
}
