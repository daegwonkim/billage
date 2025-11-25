import type { RentalItemsQueryResponse } from '@/models/RentalItem'
import { RentalItemCard } from './RentalItemCard'

interface RentalItemListProps {
  rentalItems: RentalItemsQueryResponse
  onRentalItemClick: (rentalItemId: string) => void
}

export function RentalItemList({
  rentalItems,
  onRentalItemClick
}: RentalItemListProps) {
  return (
    <div style={{ paddingBottom: '64px' }}>
      {rentalItems.content.map(rentalItem => (
        <RentalItemCard
          key={rentalItem.id}
          rentalItem={rentalItem}
          onClick={() => onRentalItemClick(rentalItem.id)}
        />
      ))}
    </div>
  )
}
