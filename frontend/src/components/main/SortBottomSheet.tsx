import { useGetRentalItemSortOptions } from '@/hooks/useRentalItem'
import { BottomSheet } from '../common/BottomSheet'
import { BottomSheetItem } from '../common/BottomSheetItem'

interface SortBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedSort: string
  onSortChange: (sort: string) => void
}

export function SortBottomSheet({
  isOpen,
  onClose,
  selectedSort,
  onSortChange
}: SortBottomSheetProps) {
  const { data: sortOptionsData } = useGetRentalItemSortOptions()

  const handleSortSelect = (value: string) => {
    onSortChange(value)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="정렬"
      showCancelButton={false}>
      <div className="py-2">
        {sortOptionsData?.sortOptions.map(option => (
          <BottomSheetItem
            key={option.value}
            label={option.label}
            selected={selectedSort === option.value}
            onClick={() => handleSortSelect(option.value)}
          />
        ))}
      </div>
    </BottomSheet>
  )
}
