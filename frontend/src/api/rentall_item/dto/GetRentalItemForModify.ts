export interface GetRentalItemForModifyResponse {
  id: number
  title: string
  description: string
  category: string
  pricePerDay: number
  pricePerWeek: number
  images: RentalItemImage[]
}

interface RentalItemImage {
  url: string
  key: string
}
