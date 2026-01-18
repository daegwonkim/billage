export interface ModifyRentalItemRequest {
  title: string
  description: string
  category: string
  pricePerDay: number
  pricePerWeek: number
  newImageKeys: string[]
  deleteImageKeys: string[]
}

export interface ModifyRentalItemResponse {
  id: number
}
