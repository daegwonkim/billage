export interface GetChatMessagesResponse {
  messages: Message[]
}

interface Message {
  id: number
  senderId: number
  content: string
  timestamp: string
}
