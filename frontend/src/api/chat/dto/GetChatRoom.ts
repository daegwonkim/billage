export interface GetChatRoomResponse {
  id: number
  rentalItem: RentalItem
  participants: Participant[]
}

interface RentalItem {
  id: number
  seller: Seller
  category: string
  title: string
  pricePerDay?: number
  pricePerWeek?: number
  thumbnailImageUrl: string
}

interface Seller {
  id: number
  nickname: string
  profileImageUrl?: string
  address: string
}

export interface Participant {
  id: number
  nickname: string
  profileImageUrl?: string
}
