import { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronDown, MapPin } from 'lucide-react'
import {
  sendVerificationCode,
  confirmVerificationCode,
  signIn,
  signUp,
  confirmRegistered
} from '@/api/auth/auth'
import { nearbyNeighborhoods } from '@/api/neighborhood/neighborhood'
import { ApiError } from '@/api/error'
import logo from '@/assets/logo.png'
import { useAuth } from '@/contexts/AuthContext'

type Step = 'start' | 'phone' | 'verification' | 'neighborhood'

interface Neighborhood {
  name: string
  code: string
}

export function LoginPrompt() {
  const { setAuthenticated } = useAuth()

  const [step, setStep] = useState<Step>('start')
  const [phoneNo, setPhoneNo] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verifiedToken, setVerifiedToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 동네 관련 상태
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: string
    longitude: string
  } | null>(null)

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNo(formatted)
    setError('')
  }

  const handleSendCode = async () => {
    const cleanPhoneNo = phoneNo.replace(/-/g, '')
    if (cleanPhoneNo.length !== 11) {
      setError('올바른 휴대폰 번호를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 인증코드 발송
      await sendVerificationCode({ phoneNo: cleanPhoneNo })
      setStep('verification')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('인증코드 발송에 실패했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('6자리 인증코드를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const cleanPhoneNo = phoneNo.replace(/-/g, '')
      const confirmVerificationCodeRes = await confirmVerificationCode({
        phoneNo: cleanPhoneNo,
        verificationCode
      })
      setVerifiedToken(confirmVerificationCodeRes.verifiedToken)
      const confirmMemberRes = await confirmRegistered({
        phoneNo: cleanPhoneNo
      })

      if (!confirmMemberRes.registered) {
        // 신규 회원이면 동네 인증 단계로
        setStep('neighborhood')
        // 위치 정보 요청
        fetchNeighborhoods()
      } else {
        // 기존 회원이면 바로 로그인
        await signIn({
          phoneNo: cleanPhoneNo,
          verifiedToken: confirmVerificationCodeRes.verifiedToken
        })

        setAuthenticated(true)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('인증코드가 올바르지 않습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 위치 기반 동네 목록 가져오기
  const fetchNeighborhoods = () => {
    setIsLoadingNeighborhoods(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords
        const location = {
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }
        setCurrentLocation(location)

        try {
          const result = await nearbyNeighborhoods(location)
          setNeighborhoods(result.neighborhoods)
        } catch (err) {
          if (err instanceof ApiError) {
            setError(err.message)
          } else {
            setError('동네 목록을 불러오는데 실패했습니다')
          }
        } finally {
          setIsLoadingNeighborhoods(false)
        }
      },
      () => {
        setError('위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.')
        setIsLoadingNeighborhoods(false)
      }
    )
  }

  // 회원가입 처리
  const handleSignUp = async () => {
    if (!selectedNeighborhood || !currentLocation) {
      setError('동네 인증을 수행해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const cleanPhoneNo = phoneNo.replace(/-/g, '')
      await signUp({
        phoneNo: cleanPhoneNo,
        verifiedToken: verifiedToken,
        neighborhood: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          code: selectedNeighborhood.code
        }
      })

      await signIn({
        phoneNo: cleanPhoneNo,
        verifiedToken: verifiedToken
      })

      setAuthenticated(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('회원가입에 실패했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-md bg-white pb-20">
      {/* 상단 바 */}
      <div className="relative flex h-14 items-center border-b border-gray-100 px-4">
        <button
          onClick={() => window.history.back()}
          className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
          <ChevronLeft
            size={24}
            className="text-neutral-700"
          />
        </button>
        <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
          로그인
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="space-y-4">
          {/* 로고 영역 */}
          <div className="mb-10 flex w-full flex-1 flex-col items-center justify-center px-6">
            <img
              className="mb-6 drop-shadow-lg"
              src={logo}
              style={{ width: '100px' }}
            />

            <h3 className="mb-3 text-lg font-bold text-gray-800">
              "사지 말고, 빌리지"
            </h3>

            <p className="text-center leading-relaxed text-gray-700">
              대여가 필요한 모든 순간
              <br />
              지금 내 동네를 인증하고 시작해보세요!
            </p>
          </div>

          {/* 휴대폰 번호 입력 */}
          {(step === 'phone' || step === 'verification') && (
            <div>
              <div className="mb-2 ml-0.5 text-sm font-bold text-neutral-700">
                휴대폰 번호
              </div>
              <input
                type="tel"
                value={phoneNo}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                disabled={step === 'verification'}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base transition-colors outline-none focus:border-black disabled:bg-gray-50 disabled:text-neutral-500"
                maxLength={13}
              />
            </div>
          )}

          {/* 인증코드 입력 (발송 후 표시) */}
          {step === 'verification' && (
            <div>
              <div className="mb-2 ml-0.5 text-sm font-bold text-neutral-700">
                인증코드
              </div>
              <input
                type="text"
                value={verificationCode}
                onChange={e => {
                  setVerificationCode(
                    e.target.value.replace(/\D/g, '').slice(0, 6)
                  )
                  setError('')
                }}
                placeholder="XXXXXX"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center tracking-widest transition-colors outline-none focus:border-black"
                maxLength={6}
                autoFocus
              />
              <button
                onClick={() => {
                  setStep('phone')
                  setVerificationCode('')
                  setError('')
                }}
                className="mt-2 text-sm text-neutral-500 hover:text-neutral-700">
                다른 번호로 인증하기
              </button>
            </div>
          )}

          {/* 동네 선택 (신규 회원) */}
          {step === 'neighborhood' && (
            <div>
              <div className="mb-2 ml-0.5 font-bold text-neutral-700">
                동네 인증
              </div>
              <p className="mb-3 ml-0.5 text-sm text-neutral-500">
                현재 위치를 기반으로 동네를 선택해주세요
              </p>

              {isLoadingNeighborhoods ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-neutral-500">
                    주변 동네 목록을 불러오는 중...
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={18}
                        className="text-neutral-500"
                      />
                      <span
                        className={
                          selectedNeighborhood
                            ? 'text-neutral-900'
                            : 'text-neutral-400'
                        }>
                        {selectedNeighborhood
                          ? selectedNeighborhood.name
                          : '동네를 선택해주세요'}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && neighborhoods.length > 0 && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {neighborhoods.map(neighborhood => (
                        <button
                          key={neighborhood.code}
                          type="button"
                          onClick={() => {
                            setSelectedNeighborhood(neighborhood)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                            selectedNeighborhood?.code === neighborhood.code
                              ? 'bg-gray-50 font-medium'
                              : ''
                          }`}>
                          {neighborhood.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className="ml-0.5 text-sm text-red-500">{error}</p>}

          {/* 버튼 */}
          {step === 'start' && (
            <button
              className="flex w-full justify-center gap-2 rounded-lg bg-neutral-800 py-4 font-semibold text-white shadow-lg"
              onClick={() => setStep('phone')}>
              <span>시작하기</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
          {step === 'phone' && (
            <button
              onClick={handleSendCode}
              disabled={isLoading || phoneNo.replace(/-/g, '').length !== 11}
              className="w-full rounded-lg bg-black py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300">
              {isLoading ? '발송 중...' : '인증코드 받기'}
            </button>
          )}
          {step === 'verification' && (
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full rounded-lg bg-black py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300">
              {isLoading ? '확인 중...' : '확인'}
            </button>
          )}
          {step === 'neighborhood' && (
            <button
              onClick={handleSignUp}
              disabled={isLoading || !selectedNeighborhood}
              className="w-full rounded-lg bg-black py-3 text-base font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300">
              {isLoading ? '가입 중...' : '시작하기'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
