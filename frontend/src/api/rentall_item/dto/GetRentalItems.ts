export interface GetRentalItemsResponse {
  content: GetRentalItemsItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface GetRentalItemsItem {
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

export interface GetRentalItemResponse {
  id: string
  seller: Seller
  category: string
  title: string
  description: string
  imageUrls: string[]
  pricePerDay: number
  pricePerWeek: number
  rentalCount: number
  likeCount: number
  viewCount: number
  likeed: boolean
  createdAt: Date
}

export interface Seller {
  id: string
  nickname: string
  address: string
  profileImageUrl: string
}

export interface GetSimilarRentalItemsResponse {
  rentalItems: GetSimilarRentalItemsItem[]
}

export interface GetSimilarRentalItemsItem {
  id: string
  name: string
  thumbnailImageUrl: string
  pricePerDay: number
  pricePerWeek: number
}
