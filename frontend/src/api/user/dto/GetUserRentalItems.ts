export interface GetUserRentalItemsResponse {
  rentalItems: RentalItem[]
}

export interface RentalItem {
  id: number
  title: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
