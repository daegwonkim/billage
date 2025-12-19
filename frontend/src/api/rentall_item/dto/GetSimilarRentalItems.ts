export interface GetSimilarRentalItemsResponse {
  rentalItems: GetSimilarRentalItemsItem[]
}

export interface GetSimilarRentalItemsItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
