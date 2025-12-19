export interface GetOtherRentalItemsBySellerResponse {
  rentalItems: RentalItem[]
}

export interface RentalItem {
  id: string
  title: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
