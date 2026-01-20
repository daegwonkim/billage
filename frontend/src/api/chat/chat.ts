import { customFetch } from '../customFetch'
import type { GetChatRoomResponse } from './dto/GetOrCreateChatRoom'

export async function getChatRoom(
  rentalItemId: number
): Promise<GetChatRoomResponse> {
  const params = new URLSearchParams({
    rentalItemId: rentalItemId.toString()
  })
  return await customFetch<GetChatRoomResponse>(
    `/api/chats/chat-room/${params}`
  )
}
