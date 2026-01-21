import { customFetch } from '../customFetch'
import type { CheckChatRoomResponse } from './dto/CheckChatRoom'
import type { GetChatMessagesResponse } from './dto/GetChatMessages'
import type { GetChatRoomResponse } from './dto/GetChatRoom'

export async function checkChatRoom(
  rentalItemId: number
): Promise<CheckChatRoomResponse> {
  const params = new URLSearchParams({
    rentalItemId: rentalItemId.toString()
  })
  return await customFetch<CheckChatRoomResponse>(
    `/api/chat-rooms/check?${params}`
  )
}

export async function getChatRoom(id: number): Promise<GetChatRoomResponse> {
  return await customFetch<GetChatRoomResponse>(`/api/chat-rooms/${id}`)
}

export async function getChatMessages(
  id: number
): Promise<GetChatMessagesResponse> {
  return await customFetch<GetChatMessagesResponse>(
    `/api/chat-rooms/${id}/messages`
  )
}
