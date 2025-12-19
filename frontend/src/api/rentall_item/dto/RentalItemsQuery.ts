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
  seller: Seller
  category: string
  title: string
  description: string
  imageKeys: string[]
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
  profileImageKey: string
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
