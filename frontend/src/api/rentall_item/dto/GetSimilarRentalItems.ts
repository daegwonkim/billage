export interface GetSimilarRentalItemsResponse {
  rentalItems: RentalItem[]
}

export interface RentalItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
