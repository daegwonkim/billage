export interface RentalItemRegisterRequest {
  title: string
  description: string
  category: string
  pricePerDay: number | null
  pricePerWeek: number | null
  imageKeys: string[]
}

export interface RentalItemRegisterResponse {
  id: string
}
