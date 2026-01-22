export interface GetChatRoomsResponse {
  chatRooms: ChatRoom[]
}

interface ChatRoom {
  chatRoomId: number
  participantNickname: string
  rentalItemTitle: string
  rentalItemThumbnailImageUrl: string
  latestMessage: string
  latestMessageTime: Date
  unreadCount: number
}
