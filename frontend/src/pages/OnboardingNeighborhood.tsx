import { signup } from '@/api/onboarding'
import logo from '@/assets/main.png'
import { BottomSheet } from '@/components/common/BottomSheet'
import { BottomSheetItem } from '@/components/common/BottomSheetItem'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, Crosshair } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingNeighborhood() {
  const navigate = useNavigate()

  const [showCityDialog, setShowCityDialog] = useState(false)
  const [showDistrictDialog, setShowDistrictDialog] = useState(false)
  const [showTownDialog, setShowTownDialog] = useState(false)

  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedTown, setSelectedTown] = useState('')

  // 샘플 데이터
  const cities = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도'
  ]
  const districts = [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구'
  ]
  const towns = [
    '역삼동',
    '논현동',
    '개포동',
    '청담동',
    '삼성동',
    '대치동',
    '신사동',
    '압구정동',
    '세곡동',
    '자곡동'
  ]

  const signupMutation = useMutation({
    mutationFn: (phone: string) => signup(phone),
    onSuccess: () => navigate('/')
  })

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setShowCityDialog(false)
    setSelectedDistrict('') // 시/도 변경 시 하위 선택 초기화
    setSelectedTown('')
  }

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district)
    setShowDistrictDialog(false)
    setSelectedTown('') // 시/군/구 변경 시 읍/면/동 초기화
  }

  const handleTownSelect = (town: string) => {
    setSelectedTown(town)
    setShowTownDialog(false)
  }

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

        <button className="mb-8 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-red-400 font-semibold text-white shadow-md transition-colors">
          <Crosshair className="h-5 w-5 text-white" />
          <div className="text-sm">현재 위치로 찾기</div>
        </button>

        <div className="space-y-6">
          <div className="animate-fade-in transform transition-all duration-300 ease-out">
            <label className="mb-2 block text-lg font-semibold text-gray-800">
              시・도를 선택해주세요
            </label>
            <input
              className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none"
              placeholder="시・도"
              value={selectedCity}
              onFocus={() => setShowCityDialog(true)}
              readOnly
            />
          </div>

          {selectedCity && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                시・군・구를 선택해주세요
              </label>
              <input
                className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="시・군・구"
                value={selectedDistrict}
                onFocus={() => setShowDistrictDialog(true)}
                readOnly
              />
            </div>
          )}

          {selectedDistrict && (
            <div className="animate-fade-in transform transition-all duration-300 ease-out">
              <label className="mb-2 block text-lg font-semibold text-gray-800">
                읍・면・동을 선택해주세요
              </label>
              <input
                className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 px-4 transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
                placeholder="읍・면・동"
                value={selectedTown}
                onFocus={() => setShowTownDialog(true)}
                readOnly
              />
            </div>
          )}

          {selectedCity && selectedDistrict && selectedTown && (
            <div className="animate-fade-in transform space-y-3 pt-4 transition-all duration-300 ease-out">
              <button className="h-12 w-full rounded-xl bg-red-400 font-semibold text-white shadow-md transition-all disabled:cursor-not-allowed disabled:bg-gray-300">
                인증하기
              </button>
              <div className="cursor-pointer text-center text-sm text-gray-600 underline hover:text-gray-800">
                동네인증이란?
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 시/도 선택 다이얼로그 */}
      <BottomSheet
        isOpen={showCityDialog}
        onClose={() => setShowCityDialog(false)}
        title="시・도 선택">
        <div className="px-2 py-2">
          {cities.map(city => (
            <BottomSheetItem
              key={city}
              label={city}
              selected={selectedCity === city}
              onClick={() => handleCitySelect(city)}
            />
          ))}
        </div>
      </BottomSheet>

      {/* 시/군/구 선택 다이얼로그 */}
      <BottomSheet
        isOpen={showDistrictDialog}
        onClose={() => setShowDistrictDialog(false)}
        title="시・군・구 선택">
        <div className="px-2 py-2">
          {districts.map(district => (
            <BottomSheetItem
              key={district}
              label={district}
              selected={selectedDistrict === district}
              onClick={() => handleDistrictSelect(district)}
            />
          ))}
        </div>
      </BottomSheet>

      {/* 읍/면/동 선택 다이얼로그 */}
      <BottomSheet
        isOpen={showTownDialog}
        onClose={() => setShowTownDialog(false)}
        title="읍・면・동 선택">
        <div className="px-2 py-2">
          {towns.map(town => (
            <BottomSheetItem
              key={town}
              label={town}
              selected={selectedTown === town}
              onClick={() => handleTownSelect(town)}
            />
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
