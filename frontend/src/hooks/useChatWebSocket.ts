import { useEffect, useRef, useState, useCallback } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ChatMessageResponse } from '@/api/chat/dto/ChatMessage'

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface UseChatWebSocketOptions {
  roomId: string
  onMessage: (message: ChatMessageResponse) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: string) => void
}

export function useChatWebSocket({
  roomId,
  onMessage,
  onConnect,
  onDisconnect,
  onError
}: UseChatWebSocketOptions) {
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomId) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true)
        onConnect?.()

        // 채팅방 구독
        client.subscribe(`/topic/chat/${roomId}`, (message: IMessage) => {
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
  }, [roomId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current?.connected) {
        console.error('WebSocket is not connected')
        return false
      }

      clientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({ roomId, content })
      })

      return true
    },
    [roomId]
  )

  return {
    isConnected,
    sendMessage
  }
}
