import { getChatRoom } from '@/api/chat/chat'
import { useMutation } from '@tanstack/react-query'

export function useGetOrCreateChatRoom() {
  return useMutation({
    mutationFn: (rentalItemId: number) => getChatRoom(rentalItemId)
  })
}
