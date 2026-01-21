import { useEffect, useRef, useState, useCallback } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ChatMessageResponse } from '@/api/chat/dto/ChatMessage'

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface UseChatWebSocketOptions {
  chatRoomId: string
  rentalItemId?: string | null // 새 채팅방 생성 시 사용 (roomId가 없을 때)
  onMessage: (message: ChatMessageResponse) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: string) => void
}

export function useChatWebSocket({
  chatRoomId,
  rentalItemId,
  onMessage,
  onConnect,
  onDisconnect,
  onError
}: UseChatWebSocketOptions) {
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // 새 채팅방인 경우 rentalItemId로 구독, 기존 채팅방이면 roomId로 구독
  const isNewChat = !chatRoomId && !!rentalItemId
  const subscriptionId = chatRoomId || `new-${rentalItemId}`

  useEffect(() => {
    // roomId나 rentalItemId 둘 중 하나는 있어야 함
    if (!chatRoomId && !rentalItemId) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true)
        onConnect?.()

        // 채팅방 구독 (새 채팅방이면 rentalItemId 기반으로 구독)
        const topic = isNewChat
          ? `/user/queue/new-chat/${rentalItemId}`
          : `/topic/chat/${chatRoomId}`
        client.subscribe(topic, (message: IMessage) => {
          const chatMessage: ChatMessageResponse = JSON.parse(message.body)
          onMessage(chatMessage)
        })
      },
      onDisconnect: () => {
        setIsConnected(false)
        onDisconnect?.()
      },
      onStompError: frame => {
        console.error('STOMP error:', frame.headers['message'])
        onError?.(frame.headers['message'] || 'WebSocket 연결 오류')
      },
      onWebSocketError: event => {
        console.error('WebSocket error:', event)
        onError?.('WebSocket 연결에 실패했습니다')
      }
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
    }
  }, [subscriptionId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current?.connected) {
        console.error('WebSocket is not connected')
        return false
      }

      // 새 채팅방이면 rentalItemId와 함께 전송, 기존 채팅방이면 roomId 사용
      const destination = isNewChat
        ? `/app/new-chat/${rentalItemId}`
        : `/app/chat/${chatRoomId}`
      const body = isNewChat
        ? { rentalItemId, content }
        : { chatRoomId, content }

      clientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      })

      return true
    },
    [chatRoomId, rentalItemId, isNewChat]
  )

  return {
    isConnected,
    sendMessage
  }
}
