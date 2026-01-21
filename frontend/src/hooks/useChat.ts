import { checkChatRoom, getChatMessages, getChatRoom } from '@/api/chat/chat'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useCheckChatRoom() {
  return useMutation({
    mutationFn: (rentalItemId: number) => checkChatRoom(rentalItemId)
  })
}

export function useGetChatRoom(id: number) {
  return useQuery({
    queryKey: ['chatRoom', id],
    queryFn: () => getChatRoom(id)
  })
}

export function useGetChatMessages(id: number) {
  return useQuery({
    queryKey: ['chatMessages', id],
    queryFn: () => getChatMessages(id)
  })
}
