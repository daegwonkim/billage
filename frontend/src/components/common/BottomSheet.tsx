import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  showCancelButton?: boolean
  footer?: ReactNode
  showDragHandle?: boolean
  showCloseButton?: boolean
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showCancelButton = true,
  footer,
  showDragHandle = false,
  showCloseButton = true
}: BottomSheetProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* 바텀 시트 */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-60 mx-auto w-full max-w-md transform rounded-t-2xl bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        {/* 드래그 핸들 */}
        {showDragHandle && (
          <div className="flex justify-center pt-3">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>
        )}

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {showCloseButton && (
            <X
              className="h-6 w-6 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
              onClick={onClose}
            />
          )}
        </div>

        {/* 내용 */}
        <div className="max-h-96 overflow-y-auto">{children}</div>

        {/* 커스텀 푸터 또는 취소 버튼 */}
        {footer
          ? footer
          : showCancelButton && (
              <div className="p-4">
                <button
                  className="h-12 w-full rounded-xl bg-gray-100 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  onClick={onClose}>
                  취소
                </button>
              </div>
            )}
      </div>
    </>
  )
}
