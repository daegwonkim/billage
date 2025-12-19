export interface GetUserRentalItemsResponse {
  rentalItems: GetUserRentalItemsItem[]
}

export interface GetUserRentalItemsItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
