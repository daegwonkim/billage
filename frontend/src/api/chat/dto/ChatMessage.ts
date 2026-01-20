export type MessageType = 'CHAT' | 'JOIN' | 'LEAVE'

export interface ChatMessageRequest {
  roomId: string
  content: string
}

export interface ChatMessageResponse {
  id: string
  roomId: string
  senderId: number
  senderNickname: string
  content: string
  type: MessageType
  timestamp: string
}
