export interface GetRentalItemCategoriesResponse {
  rentalItemCategories: RentalItemCategory[]
}

export interface RentalItemCategory {
  order: number
  label: string
  icon: string
}
