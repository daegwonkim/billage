import { verifyIdentity } from '@/api/onboarding'
import logo from '@/assets/main.png'
import { BottomSheet } from '@/components/common/BottomSheet'
import { BottomSheetItem } from '@/components/common/BottomSheetItem'
import { formatPhoneNumber } from '@/utils/utils'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, CircleAlert } from 'lucide-react'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingAuthentication() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [birthNumber, setBirthNumber] = useState('')
  const [gender, setGender] = useState('')
  const [selectedCarrier, setSelectedCarrier] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [hasShownBirth, setHasShownBirth] = useState(false)
  const [hasShownCarrier, setHasShownCarrier] = useState(false)
  const [hasShownPhone, setHasShownPhone] = useState(false)
  const [hasShownSubmit, setHasShownSubmit] = useState(false)

  const [showCarrierDialog, setShowCarrierDialog] = useState(false)

  const [invalidIdentity, setInvalidIdentity] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const genderInputRef = useRef<HTMLInputElement>(null)

  const carriers = [
    'SKT',
    'KT',
    'LG U+',
    '알뜰폰 (SKT)',
    '알뜰폰 (KT)',
    '알뜰폰 (LG U+)'
  ]

  const verifyIdentityMutation = useMutation({
    mutationFn: ({
      name,
      birth,
      gender,
      carrier,
      phone
    }: {
      name: string
      birth: string
      gender: number
      carrier: string
      phone: string
    }) => verifyIdentity(name, birth, gender, carrier, phone),
    onSuccess: () =>
      navigate('/onboarding/verification', {
        state: { phoneNumber }
      }),
    onError: () => setInvalidIdentity(true)
  })

  const handleCarrierSelect = (carrier: string) => {
    setSelectedCarrier(carrier)
    setShowCarrierDialog(false)
  }

  useEffect(() => {
    if (birthNumber.length === 6 && genderInputRef.current) {
      genderInputRef.current.focus()
    }
  }, [birthNumber])

  useEffect(() => {
    if (gender.length === 1 && birthNumber.length === 6) {
      setShowCarrierDialog(true)
    }
  }, [gender, birthNumber])

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  useLayoutEffect(() => {
    if (selectedCarrier && phoneInputRef.current) {
      phoneInputRef.current.focus()
    }
  }, [selectedCarrier])

  const shouldShowBirth = name.trim().length > 0
  const shouldShowCarrier =
    birthNumber.replace(/[^0-9]/g, '').length >= 6 &&
    gender.replace(/[^0-9]/g, '').length >= 1
  const shouldShowPhone = selectedCarrier.length > 0
  const shouldShowSubmit = phoneNumber.trim().length > 12

  useEffect(() => {
    if (shouldShowBirth && !hasShownBirth) setHasShownBirth(true)
    if (shouldShowCarrier && !hasShownCarrier) setHasShownCarrier(true)
    if (shouldShowPhone && !hasShownPhone) setHasShownPhone(true)
    if (shouldShowSubmit && !hasShownSubmit) setHasShownSubmit(true)
  }, [
    shouldShowBirth,
    shouldShowCarrier,
    shouldShowPhone,
    shouldShowSubmit,
    hasShownBirth,
    hasShownCarrier,
    hasShownPhone,
    hasShownSubmit
  ])

  const showBirthField = shouldShowBirth || hasShownBirth
  const showCarrierField = shouldShowCarrier || hasShownCarrier
  const showPhoneField = shouldShowPhone || hasShownPhone
  const showSubmitButton = shouldShowSubmit || hasShownSubmit

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
          {/* 1단계: 이름 입력 */}
          <div className="transform transition-all duration-300 ease-out">
            <label className="mb-2 block text-lg font-semibold text-gray-800">
              이름을 입력해주세요
            </label>
            <input
              ref={nameInputRef}
              className="h-12 w-full rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
              placeholder="홍길동"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* 2단계: 생년월일 입력 */}
          {showBirthField && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                생년월일/성별을 입력해주세요
              </label>
              <div className="flex items-center gap-3">
                <input
                  className="min-w-0 flex-1 border-b border-gray-300 text-lg font-medium tracking-wider focus:outline-none"
                  placeholder="생년월일"
                  type="tel"
                  maxLength={6}
                  value={birthNumber}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setBirthNumber(value.length > 6 ? birthNumber : value)
                  }}
                />
                <span className="shrink-0 text-xl text-gray-400">—</span>
                <div className="flex min-w-0 flex-1">
                  <input
                    ref={genderInputRef}
                    className="w-12 shrink-0 border-b border-gray-300 text-center text-lg font-medium tracking-wider focus:outline-none"
                    type="tel"
                    maxLength={1}
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  />
                  <div className="flex flex-1 gap-1 border-b border-gray-300">
                    {Array(6)
                      .fill('•')
                      .map((dot, i) => (
                        <span
                          key={i}
                          className="text-3xl text-gray-400">
                          {dot}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3단계: 통신사 선택 */}
          {showCarrierField && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                통신사를 선택해주세요
              </label>
              <input
                className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
                placeholder="통신사 선택"
                value={selectedCarrier}
                onFocus={() => setShowCarrierDialog(true)}
                readOnly
              />
            </div>
          )}

          {/* 4단계: 휴대폰 번호 입력 */}
          {showPhoneField && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                휴대폰 번호를 입력해주세요
              </label>
              <input
                ref={phoneInputRef}
                className="h-12 w-full rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
                placeholder="010-0000-0000"
                type="tel"
                value={phoneNumber}
                onChange={e => {
                  const formatted = formatPhoneNumber(e.target.value)
                  setPhoneNumber(formatted)
                }}
              />
            </div>
          )}

          {invalidIdentity && (
            <div className="animate-fade-in flex gap-1 text-sm text-red-500 duration-300 ease-out">
              <CircleAlert size={18} />
              <div>본인인증에 실패했어요. 입력한 내용을 다시 확인해주세요.</div>
            </div>
          )}

          {/* 5단계: 다음 버튼 */}
          {showSubmitButton && (
            <div className="animate-fade-in space-y-3 pt-4">
              <button
                className="h-12 w-full rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all"
                onClick={() =>
                  verifyIdentityMutation.mutate({
                    name: name,
                    birth: birthNumber,
                    gender: Number(gender),
                    carrier: selectedCarrier,
                    phone: phoneNumber
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

      {/* 통신사 선택 다이얼로그 */}
      <BottomSheet
        isOpen={showCarrierDialog}
        onClose={() => setShowCarrierDialog(false)}
        title="통신사 선택">
        <div className="px-2 py-2">
          {carriers.map(carrier => (
            <BottomSheetItem
              key={carrier}
              label={carrier}
              selected={selectedCarrier === carrier}
              onClick={() => handleCarrierSelect(carrier)}
            />
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
