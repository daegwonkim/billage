import type { RentalItem } from '@/api/rentall_item/dto/GetRentalItems'
import { RentalItemCard } from './RentalItemCard'
import { Loader2 } from 'lucide-react'

interface RentalItemsProps {
  rentalItems: RentalItem[]
  onRentalItemClick: (rentalItemId: string) => void
  isFetchingNextPage: boolean
}

export function RentalItems({
  rentalItems,
  onRentalItemClick,
  isFetchingNextPage
}: RentalItemsProps) {
  return (
    <div className="pb-[42px]">
      {rentalItems.map(rentalItem => (
        <RentalItemCard
          key={rentalItem.id}
          rentalItem={rentalItem}
          onClick={() => onRentalItemClick(rentalItem.id)}
        />
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center p-5">
          <Loader2
            className="animate-spin"
            size={25}
            color="gray"
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  )
}
