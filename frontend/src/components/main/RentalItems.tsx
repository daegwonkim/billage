import type { RentalItem } from '@/api/rentall_item/dto/GetRentalItems'
import { RentalItemCard } from './RentalItemCard'

interface RentalItemsProps {
  rentalItems: RentalItem[]
  onRentalItemClick: (rentalItemId: string) => void
}

export function RentalItems({
  rentalItems,
  onRentalItemClick
}: RentalItemsProps) {
  return (
    <div className="pb-16">
      {rentalItems.map(rentalItem => (
        <RentalItemCard
          key={rentalItem.id}
          rentalItem={rentalItem}
          onClick={() => onRentalItemClick(rentalItem.id)}
        />
      ))}
    </div>
  )
}
