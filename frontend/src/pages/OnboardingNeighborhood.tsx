import { signUp } from '@/api/domain/auth'
import type { SignUpRequest } from '@/api/dto/SignUp'
import logo from '@/assets/main.png'
import {
  useNearbyNeighborhoods,
  useLocateNeighborhood
} from '@/hooks/Neighborhood'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, Crosshair } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: string
    longitude: string
  } | null>(null)

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
    onSuccess: () => navigate('/')
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
          console.error('위치 정보를 가져올 수 없습니다:', error)
          setLocationError(error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('브라우저가 위치 서비스를 지원하지 않습니다')
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
          console.error('위치 정보를 가져올 수 없습니다:', error)
          setLocationError(error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('브라우저가 위치 서비스를 지원하지 않습니다')
    }
  }, [])

  return (
    <div className="flex min-h-screen w-md flex-col items-center justify-center p-4">
      <img
        className="mb-6 w-25 drop-shadow-lg"
        src={logo}
      />
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-xl">
        <div className="relative mb-6">
          <ChevronLeft className="absolute top-0 left-0 h-6 w-6 cursor-pointer text-gray-700 transition-colors hover:text-gray-900" />
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
            {nearbyNeighborhoodsData?.neighborhoods &&
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
                근처 동네가 없습니다
              </div>
            )}
          </div>

          {selectedNeighborhood && (
            <div className="animate-fade-in transform space-y-3 pt-4 transition-all duration-300 ease-out">
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
              <div className="cursor-pointer text-center text-sm text-gray-600 underline hover:text-gray-800">
                동네인증이란?
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
