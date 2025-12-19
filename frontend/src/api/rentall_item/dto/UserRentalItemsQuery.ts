export interface UserRentalItemsQueryResponse {
  rentalItems: UserRentalItem[]
}

export interface UserRentalItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
