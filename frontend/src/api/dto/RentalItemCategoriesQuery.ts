export interface RentalItemCategoriesQueryResponse {
  rentalItemCategories: RentalItemCategory[]
}

export interface RentalItemCategory {
  order: number
  label: string
  icon: string
}
