export interface GetChatRoomResponse {
  chatRoomId: number
  rentalItem: RentalItem
  seller: Seller
}

interface RentalItem {
  id: number
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
