import { BottomSheet } from '../common/BottomSheet'
import { BottomSheetItem } from '../common/BottomSheetItem'

interface SortBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedSort: string
  onSortChange: (sort: string) => void
}

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
  { value: 'nearest', label: '가까운순' }
]

export function SortBottomSheet({
  isOpen,
  onClose,
  selectedSort,
  onSortChange
}: SortBottomSheetProps) {
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
        {SORT_OPTIONS.map(option => (
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
