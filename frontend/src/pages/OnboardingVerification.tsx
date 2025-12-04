import { sendVerificationCode, verifyVerificationCode } from '@/api/onboarding'
import logo from '@/assets/main.png'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, CircleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function OnboardingVerification() {
  const navigate = useNavigate()

  const location = useLocation()
  const phoneNumber = location.state?.phoneNumber || ''

  const [verificationCode, setVerificationCode] = useState('')
  const [hasShownSubmitButton, setHasShownSubmitButton] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)

  const [invalidVerificationCode, setInvalidVerificationCode] = useState(false)

  const verificationInputRef = useRef<HTMLInputElement>(null)

  const sendVerificationMutation = useMutation({
    mutationFn: (phone: string) => sendVerificationCode(phone)
  })

  const verifyMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyVerificationCode(phone, code),
    onSuccess: () => {
      setInvalidVerificationCode(false)
      navigate('/onboarding/neighborhood')
    },
    onError: () => {
      setInvalidVerificationCode(true)
      verificationInputRef.current?.focus()
    }
  })

  useEffect(() => {
    verificationInputRef.current?.focus()
    sendVerificationMutation.mutate(phoneNumber)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const shouldShowSubmitButton = verificationCode.trim().length >= 6

  useEffect(() => {
    if (shouldShowSubmitButton && !hasShownSubmitButton)
      setHasShownSubmitButton(true)
  }, [shouldShowSubmitButton])

  const showSubmitButton = shouldShowSubmitButton || hasShownSubmitButton

  return (
    <div className="flex min-h-screen w-md flex-col items-center justify-center p-4">
      <img
        className="mb-6 w-25 drop-shadow-lg"
        src={logo}
      />
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-xl">
        <div className="relative mb-6">
          <ChevronLeft className="absolute top-0 left-0 h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-gray-900" />
          <div className="text-center font-bold">본인인증</div>
        </div>

        <div className="space-y-6">
          <div className="transform transition-all duration-300 ease-out">
            <label className="mb-2 block text-lg font-semibold text-gray-800">
              인증번호를 입력해주세요
            </label>
            <div className="relative w-full">
              <input
                ref={verificationInputRef}
                className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-16 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
                placeholder="인증번호 6자리"
                value={verificationCode}
                maxLength={6}
                onChange={e => setVerificationCode(e.target.value)}
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium text-red-400">
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            {invalidVerificationCode && (
              <div className="animate-fade-in flex gap-1 pt-2 text-sm text-red-500 duration-300 ease-out">
                <CircleAlert size={18} />
                <div>인증번호 검증에 실패했어요.</div>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            인증번호가 오지 않나요?{' '}
            <span className="cursor-pointer font-semibold text-red-400 underline">
              재전송
            </span>
          </div>

          {showSubmitButton && (
            <button
              className="animate-fade-in h-12 w-full transform rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all duration-300 ease-out"
              onClick={() => verifyMutation.mutate(phoneNumber)}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
