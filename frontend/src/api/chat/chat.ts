import { customFetch } from '../customFetch'
import type {
  GetOrCreateChatRoomRequest,
  GetOrCreateChatRoomResponse
} from './dto/GetOrCreateChatRoom'

export async function getOrCreateChatRoom(
  request: GetOrCreateChatRoomRequest
): Promise<GetOrCreateChatRoomResponse> {
  return await customFetch<GetOrCreateChatRoomResponse>(
    '/api/chats/chat-room',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  )
}
