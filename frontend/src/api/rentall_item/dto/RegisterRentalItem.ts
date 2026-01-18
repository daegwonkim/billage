export interface RegisterRentalItemRequest {
  title: string
  description: string
  category: string
  pricePerDay: number | null
  pricePerWeek: number | null
  imageKeys: string[]
}

export interface RegisterRentalItemResponse {
  id: number
}
