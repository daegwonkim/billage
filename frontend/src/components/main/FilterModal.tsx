import { categories } from '@/types'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
  onApply: (category?: string) => void
}

export function FilterModal({
  isOpen,
  onClose,
  selectedCategory,
  onApply
}: FilterModalProps) {
  const [tempCategory, setTempCategory] = useState<string | undefined>(
    selectedCategory
  )

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

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">필터</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100">
            <X
              size={24}
              className="text-gray-500"
            />
          </button>
        </div>

        {/* 내용 */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {/* 카테고리 섹션 */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">카테고리</h4>
            <div className="grid grid-cols-3 gap-2">
              {/* 카테고리 버튼들 */}
              {categories.map(category => (
                <button
                  key={category.label}
                  onClick={() => setTempCategory(category.label)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-3 transition-all ${
                    tempCategory === category.label
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 border-t border-gray-200 p-4">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
            초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800">
            적용하기
          </button>
        </div>
      </div>
    </>
  )
}
