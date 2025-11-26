export interface Seller {
  id: string
  name: string
  address: string
  profileImageUrl: string
  trustLevel: number
}

export interface SellerRentalItemsResponse {
  rentalItems: SellerRentalItem[]
}

export interface SellerRentalItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
