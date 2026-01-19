import type { ReactNode } from 'react'

interface BottomSheetItemProps {
  label: string
  icon?: ReactNode
  variant?: 'default' | 'danger'
  selected?: boolean
  onClick: () => void
}

export function BottomSheetItem({
  label,
  icon,
  variant = 'default',
  selected,
  onClick
}: BottomSheetItemProps) {
  const colorClass =
    variant === 'danger' ? 'text-red-500' : 'text-gray-800'

  return (
    <div
      className="cursor-pointer rounded-lg px-4 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
      onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-3 ${colorClass}`}>
          {icon}
          <span className="text-base">{label}</span>
        </div>
        {selected && <div className="h-2 w-2 rounded-full bg-black" />}
      </div>
    </div>
  )
}
