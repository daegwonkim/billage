import { confirmPhoneNo } from '@/api/domain/auth'
import type { PhoneNoConfirmRequest } from '@/api/dto/PhoneNoConfirm'
import logo from '@/assets/main.png'
import { formatPhoneNo } from '@/utils/utils'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, CircleAlert } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function OnboardingAuthentication() {
  const navigate = useNavigate()

  const [phoneNo, setPhoneNo] = useState('')
  const [existsPhoneNo, setExistsPhoneNo] = useState(false)
  const phoneNoInputRef = useRef<HTMLInputElement>(null)

  const confirmPhoneNoMutation = useMutation({
    mutationFn: (request: PhoneNoConfirmRequest) => confirmPhoneNo(request),
    onSuccess: (data, variables) => {
      if (data.exists) {
        setExistsPhoneNo(true)
      } else {
        navigate('/onboarding/verification', {
          state: { phoneNo: variables.phoneNo }
        })
      }
    },
    onError: () => {
      toast.error('서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  })

  useEffect(() => {
    phoneNoInputRef.current?.focus()
  }, [])

  const showSubmitButton = phoneNo.trim().length > 12

  return (
    <div className="flex min-h-screen w-md flex-col items-center justify-center p-4">
      <Toaster
        position="top-center"
        toastOptions={{ className: 'text-sm' }}
      />
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
          <div className="text-center font-bold">본인인증</div>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in transform transition-all duration-300 ease-out">
            <label className="mb-2 block text-lg font-semibold text-gray-800">
              휴대폰 번호를 입력해주세요
            </label>
            <input
              ref={phoneNoInputRef}
              className="h-12 w-full rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
              placeholder="010-0000-0000"
              type="tel"
              value={phoneNo}
              onChange={e => {
                const formatted = formatPhoneNo(e.target.value)
                setPhoneNo(formatted)
              }}
            />
            {existsPhoneNo && (
              <div className="animate-fade-in flex gap-1 pt-2 text-sm text-red-500 duration-300 ease-out">
                <CircleAlert size={18} />
                <div>
                  이미 등록된 계정이 존재합니다. 로그인으로 진행해주세요.
                </div>
              </div>
            )}
          </div>

          {showSubmitButton && (
            <div className="animate-fade-in space-y-3">
              <button
                className="h-12 w-full rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all"
                onClick={() =>
                  confirmPhoneNoMutation.mutate({
                    phoneNo: phoneNo.replace(/-/g, '')
                  })
                }>
                다음
              </button>
              <div className="cursor-pointer text-center text-sm text-gray-600 underline hover:text-gray-800">
                본인인증에 대해 궁금한 점이 있으신가요?
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
            본인인증은 안전하게 보호되며
            <br />
            개인정보는 인증 목적으로만 사용됩니다
          </div>
        </div>
      </div>
    </div>
  )
}
