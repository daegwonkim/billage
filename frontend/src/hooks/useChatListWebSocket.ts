import { useEffect, useRef } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useQueryClient } from '@tanstack/react-query'
import type { GetChatRoomsResponse } from '@/api/chat/dto/GetChatRooms'

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ChatRoomUpdateResponse {
  chatRoomId: number
  latestMessage: string
  latestMessageTime: string
  unreadCount: number
}

interface NewChatRoomUpdateResponse {
  id: number
  participants: string[]
  rentalItem: {
    title: string
    thumbnailImageUrl: string
  }
  messageStatus: {
    latestMessage: string
    latestMessageTime: string
    unreadCount: number
  }
}

export function useChatListWebSocket() {
  const clientRef = useRef<Client | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // 기존 채팅방 메시지 업데이트 구독
        client.subscribe(
          '/user/queue/chat-room-updates',
          (message: IMessage) => {
            const update: ChatRoomUpdateResponse = JSON.parse(message.body)

            const updateCache = (old: GetChatRoomsResponse | undefined) => {
              if (!old) return old

              const updatedRooms = old.chatRooms.map(room =>
                room.id === update.chatRoomId
                  ? {
                      ...room,
                      messageStatus: {
                        latestMessage: update.latestMessage,
                        latestMessageTime: new Date(update.latestMessageTime),
                        unreadCount: update.unreadCount
                      }
                    }
                  : room
              )

              updatedRooms.sort(
                (a, b) =>
                  new Date(b.messageStatus.latestMessageTime).getTime() -
                  new Date(a.messageStatus.latestMessageTime).getTime()
              )

              return { ...old, chatRooms: updatedRooms }
            }

            queryClient.setQueryData<GetChatRoomsResponse>(
              ['chatRooms', 'BORROWER'],
              updateCache
            )
            queryClient.setQueryData<GetChatRoomsResponse>(
              ['chatRooms', 'LENDER'],
              updateCache
            )
          }
        )

        // 새 채팅방 생성 알림 구독
        client.subscribe(
          '/user/queue/new-chat-room-updates',
          (message: IMessage) => {
            const newRoom: NewChatRoomUpdateResponse = JSON.parse(message.body)

            const chatRoom = {
              id: newRoom.id,
              participants: newRoom.participants,
              rentalItem: newRoom.rentalItem,
              messageStatus: {
                ...newRoom.messageStatus,
                latestMessageTime: new Date(
                  newRoom.messageStatus.latestMessageTime
                )
              }
            }

            const addNewRoom = (old: GetChatRoomsResponse | undefined) => {
              if (!old) return { chatRooms: [chatRoom] }

              if (old.chatRooms.some(room => room.id === newRoom.id)) {
                return old
              }

              return {
                ...old,
                chatRooms: [chatRoom, ...old.chatRooms]
              }
            }

            queryClient.setQueryData<GetChatRoomsResponse>(
              ['chatRooms', 'BORROWER'],
              addNewRoom
            )
            queryClient.setQueryData<GetChatRoomsResponse>(
              ['chatRooms', 'LENDER'],
              addNewRoom
            )
          }
        )
      },
      onStompError: frame => {
        console.error('STOMP error:', frame.headers['message'])
      },
      onWebSocketError: event => {
        console.error('WebSocket error:', event)
      }
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
    }
  }, [queryClient])
}
