export interface RentalItemCardViewModel {
  id: string
  name: string
  thumbnail: string
  address: string
  pricePerDay: number
  pricePerWeek: number
  rentals: number
  comments: number
  likes: number
  createdAt: Date
}

export interface RentalItemDetailViewModel {
  id: string
  seller: RentalItemDetailUserViewModel
  category: string
  name: string
  description: string
  images: string[]
  pricePerDay: number
  pricePerWeek: number
  isLiked: boolean
  rentals: number
  comments: number
  likes: number
  views: number
  createdAt: Date
}

export interface RentalItemDetailUserViewModel {
  id: string
  name: string
  address: string
  profileImage: string
  dealSatisfaction: number
}
