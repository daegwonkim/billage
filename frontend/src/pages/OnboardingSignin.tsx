import logo from '@/assets/main.png'
import { formatPhoneNo } from '@/utils/utils'
import { ChevronLeft, CircleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  sendVerificationCode,
  signIn,
  confirmPhoneNo,
  confirmVerificationCode
} from '@/api/domain/auth'
import { useNavigate } from 'react-router-dom'
import type { VerificationCodeConfirmRequest } from '@/api/dto/VerificationCodeConfirm'
import type { VerificationCodeSendRequest } from '@/api/dto/VerificationCodeSend'
import type { SignInRequest } from '@/api/dto/SignIn'
import type { PhoneNoConfirmRequest } from '@/api/dto/PhoneNoConfirm'
import { ErrorMessageMap, type ApiError } from '@/api/domain/error'
import toast from 'react-hot-toast'

export default function OnboardingSignin() {
  const navigate = useNavigate()

  const phoneNoInputRef = useRef<HTMLInputElement>(null)
  const verificationCodeInputRef = useRef<HTMLInputElement>(null)

  const [phoneNo, setPhoneNo] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(300)
  const [step, setStep] = useState<'phoneNo' | 'verificationCode'>('phoneNo')

  const [invalidPhoneNo, setInvalidPhoneNo] = useState(false)
  const [invalidVerificationCode, setInvalidVerificationCode] = useState(false)
  const [failedSignIn, setFailedSignIn] = useState(false)

  const confirmPhoneNoMutation = useMutation({
    mutationFn: (request: PhoneNoConfirmRequest) => confirmPhoneNo(request),
    onSuccess: (data, variables) => {
      if (!data.exists) {
        setInvalidPhoneNo(true)
      } else {
        sendVerificationCodeMutation.mutate({
          phoneNo: variables.phoneNo
        })
        setInvalidPhoneNo(false)
        setStep('verificationCode')
        setTimeLeft(300)
      }
    }
  })

  const sendVerificationCodeMutation = useMutation({
    mutationFn: (request: VerificationCodeSendRequest) =>
      sendVerificationCode(request),
    onError: (error: ApiError) => {
      toast.error(
        ErrorMessageMap[error.code] ??
          '서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    }
  })

  const resendVerificationCodeMutation = useMutation({
    mutationFn: (request: VerificationCodeSendRequest) =>
      sendVerificationCode(request),
    onSuccess: () => {
      setTimeLeft(300)
    },
    onError: (error: ApiError) => {
      toast.error(
        ErrorMessageMap[error.code] ??
          '서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    }
  })

  const confirmVerificationCodeMutation = useMutation({
    mutationFn: (request: VerificationCodeConfirmRequest) =>
      confirmVerificationCode(request),
    onSuccess: (data, variables) => {
      setInvalidVerificationCode(false)
      signInMutation.mutate({
        phoneNo: variables.phoneNo,
        verifiedToken: data.verifiedToken
      })
    },
    onError: () => {
      setInvalidVerificationCode(true)
      verificationCodeInputRef.current?.focus()
    }
  })

  const signInMutation = useMutation({
    mutationFn: (request: SignInRequest) => signIn(request),
    onSuccess: () => navigate('/'),
    onError: () => {
      setFailedSignIn(true)
    }
  })

  useEffect(() => {
    phoneNoInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (step === 'verificationCode') {
      setTimeout(() => {
        verificationCodeInputRef.current?.focus()
      }, 100)
    }
  }, [step])

  useEffect(() => {
    if (timeLeft <= 0 || step === 'phoneNo') return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, step])

  const handleConfirmPhoneNo = () => {
    if (!phoneNo) return
    confirmPhoneNoMutation.mutate({
      phoneNo: phoneNo.replace(/-/g, '')
    })
  }

  const handleResend = () => {
    resendVerificationCodeMutation.mutate({
      phoneNo: phoneNo.replace(/-/g, '')
    })
  }

  const handleConfirmVerificationCode = () => {
    confirmVerificationCodeMutation.mutate({
      phoneNo: phoneNo.replace(/-/g, ''),
      verificationCode: verificationCode
    })
  }

  const isLoading =
    confirmPhoneNoMutation.isPending ||
    resendVerificationCodeMutation.isPending ||
    confirmVerificationCodeMutation.isPending

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
            onClick={() => navigate(-1)}
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
                ref={phoneNoInputRef}
                className="h-12 w-full rounded-lg border border-gray-300 pr-4 pl-24 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
                placeholder="010-0000-0000"
                type="tel"
                value={phoneNo}
                disabled={step === 'verificationCode'}
                onChange={e => {
                  const formatted = formatPhoneNo(e.target.value)
                  setPhoneNo(formatted)
                }}
              />
            </div>
            {invalidPhoneNo && (
              <div className="animate-fade-in flex gap-1 pt-2 text-sm text-red-500 duration-300 ease-out">
                <CircleAlert size={18} />
                <div>유효한 휴대폰 번호가 아니에요. 다시 확인해주세요.</div>
              </div>
            )}
          </div>

          {step === 'verificationCode' && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                인증번호를 입력해주세요
              </label>
              <div className="relative w-full">
                <input
                  ref={verificationCodeInputRef}
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
              {failedSignIn && (
                <div className="animate-fade-in flex gap-1 pt-2 text-sm text-red-500 duration-300 ease-out">
                  <CircleAlert size={18} />
                  <div>로그인에 실패했어요. 잠시 후 다시 시도해주세요.</div>
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
                step === 'phoneNo'
                  ? handleConfirmPhoneNo
                  : handleConfirmVerificationCode
              }
              disabled={
                isLoading ||
                (step === 'phoneNo' && phoneNo.length != 13) ||
                (step === 'verificationCode' && verificationCode.length !== 6)
              }>
              {isLoading ? '처리중...' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
