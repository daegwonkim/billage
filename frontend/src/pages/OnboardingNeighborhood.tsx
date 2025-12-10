import { signUp } from '@/api/domain/auth'
import { ApiError, ErrorMessageMap } from '@/api/domain/error'
import type { SignUpRequest } from '@/api/dto/SignUp'
import logo from '@/assets/main.png'
import neighborhood from '@/assets/neighborhood.png'
import {
  useNearbyNeighborhoods,
  useLocateNeighborhood
} from '@/hooks/Neighborhood'
import { useMutation } from '@tanstack/react-query'
import { Crosshair, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

export default function OnboardingNeighborhood() {
  const navigate = useNavigate()

  const location = useLocation()
  const phoneNo = location.state?.phoneNo || ''
  const verifiedToken = location.state?.verifiedToken || ''

  const [userLocation, setLocation] = useState<{
    latitude: string
    longitude: string
  } | null>(null)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: string
    longitude: string
  } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data: nearbyNeighborhoodsData,
    isLoading: nearbyNeighborhoodsLoading,
    error: nearbyNeighborhoodsError
  } = useNearbyNeighborhoods(
    userLocation || { latitude: '', longitude: '' },
    !!userLocation
  )

  const { data: locateNeighborhoodData, isLoading: isLocating } =
    useLocateNeighborhood(
      currentLocation || { latitude: '', longitude: '' },
      !!currentLocation
    )

  const signUpMutation = useMutation({
    mutationFn: (request: SignUpRequest) => signUp(request),
    onSuccess: () => navigate('/'),
    onError: (error: ApiError) => {
      toast.error(
        ErrorMessageMap[error.code] ?? '알 수 없는 오류가 발생했습니다'
      )
    }
  })

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude.toString()
          const lng = position.coords.longitude.toString()

          setCurrentLocation({
            latitude: lat,
            longitude: lng
          })
        },
        error => {
          if (error.code == error.PERMISSION_DENIED) {
            toast.error('브라우저 설정에서 위치 권한을 허용해주세요.')
          } else if (error.code == error.POSITION_UNAVAILABLE) {
            toast.error(
              '현재 위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.'
            )
          } else if (error.code == error.TIMEOUT) {
            toast.error('시간 초과로 위치 정보를 가져오는 데 실패했습니다.')
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      toast.error('브라우저가 위치 서비스를 지원하지 않습니다.')
    }
  }

  useEffect(() => {
    if (locateNeighborhoodData?.code) {
      setSelectedNeighborhood(locateNeighborhoodData.code)
    }
  }, [locateNeighborhoodData])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          })
        },
        error => {
          if (error.code == error.PERMISSION_DENIED) {
            toast.error('브라우저 설정에서 위치 권한을 허용해주세요.')
          } else if (error.code == error.POSITION_UNAVAILABLE) {
            toast.error(
              '현재 위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.'
            )
          } else if (error.code == error.TIMEOUT) {
            toast.error('시간 초과로 위치 정보를 가져오는 데 실패했습니다.')
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      toast.error('브라우저가 위치 서비스를 지원하지 않습니다.')
    }
  }, [])

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
          <div className="text-center font-bold">동네인증</div>
        </div>

        <button
          className="mb-8 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-red-400 font-semibold text-white shadow-md transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={handleCurrentLocation}
          disabled={isLocating}>
          <Crosshair className="h-5 w-5 text-white" />
          <div className="text-sm">
            {isLocating ? '위치 확인 중...' : '현재 위치로 찾기'}
          </div>
        </button>

        <div className="space-y-5">
          <div className="px-3 text-sm font-bold">근처 동네</div>

          <div className="max-h-100 overflow-y-auto">
            {nearbyNeighborhoodsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-red-400" />
              </div>
            ) : nearbyNeighborhoodsData?.neighborhoods &&
              nearbyNeighborhoodsData.neighborhoods.length > 0 ? (
              nearbyNeighborhoodsData.neighborhoods.map(
                (neighborhood, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer px-3 py-3 text-sm transition-colors hover:bg-gray-50 ${
                      selectedNeighborhood === neighborhood.code
                        ? 'bg-red-50 font-semibold text-red-500'
                        : ''
                    }`}
                    onClick={() => setSelectedNeighborhood(neighborhood.code)}>
                    {neighborhood.name}
                  </div>
                )
              )
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                조회된 근처 동네가 없습니다
              </div>
            )}
          </div>

          {selectedNeighborhood && (
            <div className="animate-fade-in transform space-y-3 pt-4 text-center transition-all duration-300 ease-out">
              <button
                className="h-12 w-full rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-300"
                onClick={() =>
                  signUpMutation.mutate({
                    phoneNo: phoneNo,
                    verifiedToken: verifiedToken,
                    neighborhood: {
                      latitude: userLocation?.latitude,
                      longitude: userLocation?.longitude,
                      code: selectedNeighborhood
                    }
                  })
                }>
                인증하기
              </button>

              <div
                className="inline-block cursor-pointer text-sm text-gray-600 underline hover:text-gray-800"
                onClick={() => setIsDialogOpen(true)}>
                동네인증이란?
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 다이얼로그 */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl transition-all"
            onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 p-2 text-gray-400 transition"
              onClick={() => setIsDialogOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900">
              <img
                className="mb-2 w-12 drop-shadow-lg"
                src={neighborhood}
                alt="동네 아이콘"
              />
              <span>동네인증이란?</span>
            </h2>

            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600">
              <p>
                동네 인증은 회원님의 현재 위치를 기반으로 거주 지역을 확인하는
                기능입니다.
              </p>
              <p>
                인증된 동네를 기준으로 주변 이웃들과 소통하고, 지역 기반 중고
                거래 및 정보를 공유할 수 있습니다.
              </p>
              <p>
                위치 정보는 동네 인증 목적으로만 사용되며, 안전하게 보호됩니다.
              </p>
            </div>

            <button
              className="mt-7 h-11 w-full rounded-xl bg-red-400 font-semibold text-white shadow-sm transition-colors hover:bg-red-500"
              onClick={() => setIsDialogOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
