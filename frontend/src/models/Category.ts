export interface RentalItemCategoryResponse {
  categories: RentalItemCategory[]
}

export interface RentalItemCategory {
  order: number
  label: string
  icon: string
}
