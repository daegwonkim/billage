import logo from '@/assets/main.png'
import { formatPhoneNumber } from '@/utils/utils'
import { ChevronLeft, CircleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  sendVerificationCode,
  signin,
  verifyPhoneNumber,
  verifyVerificationCode
} from '@/api/onboarding'
import { useNavigate } from 'react-router-dom'

export default function OnboardingSignin() {
  const navigate = useNavigate()

  const phoneInputRef = useRef<HTMLInputElement>(null)
  const verificationInputRef = useRef<HTMLInputElement>(null)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(300)
  const [step, setStep] = useState<'phone' | 'verification'>('phone')

  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false)
  const [invalidVerificationCode, setInvalidVerificationCode] = useState(false)

  const verifyPhoneNumberMutation = useMutation({
    mutationFn: (phone: string) => verifyPhoneNumber(phone),
    onSuccess: (data, phone) => {
      sendVerificationMutation.mutate(phone)
      setInvalidPhoneNumber(false)
      setStep('verification')
      setTimeLeft(300)
    },
    onError: () => setInvalidPhoneNumber(true)
  })

  const sendVerificationMutation = useMutation({
    mutationFn: (phone: string) => sendVerificationCode(phone)
  })

  const resendVerificationMutation = useMutation({
    mutationFn: (phone: string) => sendVerificationCode(phone),
    onSuccess: () => {
      setTimeLeft(300)
    }
  })

  const signinMutation = useMutation({
    mutationFn: (phone: string) => signin(phone),
    onSuccess: () => navigate('/')
  })

  const verifyMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      verifyVerificationCode(phone, code),
    onSuccess: (data, variables) => {
      setInvalidVerificationCode(false)
      signinMutation.mutate(variables.phone)
    },
    onError: () => {
      setInvalidVerificationCode(true)
      verificationInputRef.current?.focus()
    }
  })

  useEffect(() => {
    phoneInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (step === 'verification') {
      setTimeout(() => {
        verificationInputRef.current?.focus()
      }, 100)
    }
  }, [step])

  useEffect(() => {
    if (timeLeft <= 0 || step === 'phone') return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, step])

  const handleVerifyPhoneNumber = () => {
    if (!phoneNumber) return
    verifyPhoneNumberMutation.mutate(phoneNumber)
  }

  const handleResend = () => {
    resendVerificationMutation.mutate(phoneNumber)
  }

  const handleVerifyVerificationCode = () => {
    verifyMutation.mutate({
      phone: phoneNumber,
      code: verificationCode
    })
  }

  const isLoading =
    verifyPhoneNumberMutation.isPending ||
    resendVerificationMutation.isPending ||
    verifyMutation.isPending

  return (
    <div className="flex min-h-screen w-md flex-col items-center justify-center p-4">
      <img
        className="mb-6 w-25 drop-shadow-lg"
        src={logo}
      />
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-xl">
        <div className="relative mb-6">
          <ChevronLeft
            className="absolute top-0 left-0 h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-gray-900"
            onClick={() => step === 'verification' && setStep('phone')}
          />
          <div className="text-center font-bold">로그인</div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-lg font-semibold text-gray-800">
              휴대폰 번호를 입력해주세요
            </label>
            <div className="relative w-full">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-gray-700">
                🇰🇷 +82
              </div>
              <input
                ref={phoneInputRef}
                className="h-12 w-full rounded-lg border border-gray-300 pr-4 pl-24 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
                placeholder="010-0000-0000"
                type="tel"
                value={phoneNumber}
                disabled={step === 'verification'}
                onChange={e => {
                  const formatted = formatPhoneNumber(e.target.value)
                  setPhoneNumber(formatted)
                }}
              />
            </div>
            {invalidPhoneNumber && (
              <div className="animate-fade-in flex gap-1 pt-2 text-sm text-red-500 duration-300 ease-out">
                <CircleAlert size={18} />
                <div>유효한 휴대폰 번호가 아니에요. 다시 확인해주세요.</div>
              </div>
            )}
          </div>

          {step === 'verification' && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
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
              <div className="pt-4 text-center text-sm text-gray-500">
                인증번호가 오지 않나요?{' '}
                <span
                  className="cursor-pointer font-semibold text-red-400 underline"
                  onClick={handleResend}>
                  재전송
                </span>
              </div>
            </div>
          )}

          <div className="animate-fade-in space-y-3 pt-4">
            <button
              className="h-12 w-full rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all disabled:opacity-50"
              onClick={
                step === 'phone'
                  ? handleVerifyPhoneNumber
                  : handleVerifyVerificationCode
              }
              disabled={
                isLoading ||
                (step === 'phone' && phoneNumber.length != 13) ||
                (step === 'verification' && verificationCode.length !== 6)
              }>
              {isLoading ? '처리중...' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
