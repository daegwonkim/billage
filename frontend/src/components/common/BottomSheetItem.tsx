interface BottomSheetItemProps {
  label: string
  selected?: boolean
  onClick: () => void
}

export function BottomSheetItem({
  label,
  selected,
  onClick
}: BottomSheetItemProps) {
  return (
    <div
      className="cursor-pointer rounded-lg px-4 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
      onClick={onClick}>
      <div className="flex items-center justify-between">
        <span className="text-base text-gray-800">{label}</span>
        {selected && <div className="h-2 w-2 rounded-full bg-black" />}
      </div>
    </div>
  )
}
