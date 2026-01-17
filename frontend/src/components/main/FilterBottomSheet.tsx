import { useGetRentalItemCategories } from '@/hooks/useRentalItem'
import { RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { BottomSheet } from '../common/BottomSheet'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
  onApply: (category?: string) => void
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  selectedCategory,
  onApply
}: FilterModalProps) {
  const [tempCategory, setTempCategory] = useState<string | undefined>(
    selectedCategory
  )
  const { data: categoriesData } = useGetRentalItemCategories()

  useEffect(() => {
    setTempCategory(selectedCategory)
  }, [selectedCategory])

  const handleApply = () => {
    onApply(tempCategory)
    onClose()
  }

  const handleReset = () => {
    setTempCategory(undefined)
  }

  const handleClose = () => {
    setTempCategory(selectedCategory)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="필터"
      showCancelButton={false}
      showCloseButton={false}
      showDragHandle={true}
      footer={
        <div className="flex items-center gap-4 border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-700">
            <RotateCcw size={18} />
            <span className="text-sm font-medium">초기화</span>
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-sm bg-black py-3.5 font-semibold text-white transition-opacity hover:opacity-90">
            필터 적용하기
          </button>
        </div>
      }>
      <div className="px-6 pb-4">
        {/* 카테고리 탭 */}
        <div className="mb-6 border-b border-gray-200">
          <button className="relative px-1 pb-3 text-sm font-semibold text-gray-900">
            카테고리
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-black" />
          </button>
        </div>

        {/* 카테고리 선택 그리드 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 전체 버튼 */}
          <button
            onClick={() => setTempCategory(undefined)}
            className={`flex items-center justify-center rounded-sm border py-2.5 transition-all ${
              tempCategory === undefined
                ? 'border-black bg-white text-black'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}>
            <span className="text-sm font-medium">전체</span>
          </button>

          {/* 카테고리 버튼들 */}
          {categoriesData?.categories.map(category => (
            <button
              key={category.value}
              onClick={() => setTempCategory(category.value)}
              className={`flex items-center justify-center rounded-sm border py-2.5 transition-all ${
                tempCategory === category.value
                  ? 'border-black bg-white text-black'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
