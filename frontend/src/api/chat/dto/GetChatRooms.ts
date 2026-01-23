export interface GetChatRoomsResponse {
  chatRooms: ChatRoom[]
}

interface ChatRoom {
  id: number
  chatParticipantNickname: string
  rentalItem: RentalItem
  messageStatus: MessageStatus
}

interface RentalItem {
  title: string
  thumbnailImageUrl: string
}

interface MessageStatus {
  latestMessage: string
  latestMessageTime: Date
  unreadCount: number
}
