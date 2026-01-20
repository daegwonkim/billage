import { getOrCreateChatRoom } from '@/api/chat/chat'
import type { GetOrCreateChatRoomRequest } from '@/api/chat/dto/GetOrCreateChatRoom'
import { useMutation } from '@tanstack/react-query'

export function useGetOrCreateChatRoom() {
  return useMutation({
    mutationFn: (request: GetOrCreateChatRoomRequest) =>
      getOrCreateChatRoom(request)
  })
}
