import {
  checkChatRoom,
  getChatMessages,
  getChatRoom,
  getChatRooms
} from '@/api/chat/chat'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useCheckChatRoom() {
  return useMutation({
    mutationFn: (rentalItemId: number) => checkChatRoom(rentalItemId)
  })
}

export function useGetChatRoom(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['chatRoom', id],
    queryFn: () => getChatRoom(id),
    enabled: options?.enabled ?? true
  })
}

export function useGetChatRooms() {
  return useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => getChatRooms()
  })
}

export function useGetChatMessages(
  id: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['chatMessages', id],
    queryFn: () => getChatMessages(id),
    enabled: options?.enabled ?? true
  })
}
