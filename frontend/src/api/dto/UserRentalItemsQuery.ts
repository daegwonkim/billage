export interface UserRentalItemsQueryResponse {
  rentalItems: UserRentalItem[]
}

export interface User {
  id: string
  name: string
  address: string
  profileImageUrl: string
  trustLevel: number
}

export interface UserRentalItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
