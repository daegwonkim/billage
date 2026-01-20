export type MessageType = 'CHAT' | 'JOIN' | 'LEAVE'

export interface ChatMessageRequest {
  rentalItemId: number
  receiverId: number
  content: string
}

export interface ChatMessageResponse {
  id: string
  chatRoomId: number
  senderId: number
  senderNickname: string
  content: string
  type: MessageType
  timestamp: string
}
