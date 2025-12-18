import type { User } from './UserRentalItemsQuery'

export interface RentalItemsQueryResponse {
  content: RentalItemsCard[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface RentalItemsCard {
  id: string
  name: string
  thumbnailImageUrl: string
  address: string
  pricePerDay: number
  pricePerWeek: number
  rentals: number
  chats: number
  likes: number
  createdAt: Date
}

export interface RentalItemDetailResponse {
  id: string
  seller: User
  category: string
  name: string
  description: string
  imageUrls: string[]
  pricePerDay: number
  pricePerWeek: number
  isLiked: boolean
  rentals: number
  chats: number
  likes: number
  views: number
  createdAt: Date
}

export interface SimilarRentalItemsQueryResponse {
  rentalItems: SimilarRentalItem[]
}

export interface SimilarRentalItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
