import type { GetRentalItemsItem } from '@/api/rentall_item/dto/RentalItemsQuery'
import { RentalItemCard } from './RentalItemCard'

interface RentalItemsProps {
  rentalItems: GetRentalItemsItem[]
  onRentalItemClick: (rentalItemId: string) => void
}

export function RentalItems({
  rentalItems,
  onRentalItemClick
}: RentalItemsProps) {
  return (
    <div style={{ paddingBottom: '64px' }}>
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
