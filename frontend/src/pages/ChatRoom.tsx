import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatRentalItemInfo } from '@/components/chat/ChatRentalItemInfo'
import { ChatMessageList } from '@/components/chat/ChatMessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChatWebSocket } from '@/hooks/useChatWebSocket'
import type { ChatMessageResponse } from '@/api/chat/dto/ChatMessage'

// 더미 데이터 (나중에 실제 API로 대체)
const dummySeller = {
  id: 1,
  nickname: '빌리지마스터',
  profileImageUrl: ''
}

const dummyRentalItem = {
  id: 1,
  title: '캠핑 텐트 4인용',
  pricePerDay: 15000,
  imageUrl: ''
}

interface Message {
  id: string | number
  senderId: number
  content: string
  createdAt: Date
}

export function ChatRoom() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])

  // 현재 유저 ID (나중에 AuthContext에서 가져옴)
  const currentUserId = 1

  const handleMessage = useCallback((chatMessage: ChatMessageResponse) => {
    // JOIN/LEAVE 메시지는 시스템 메시지로 처리하거나 무시할 수 있음
    if (chatMessage.type === 'CHAT') {
      const newMessage: Message = {
        id: chatMessage.id,
        senderId: chatMessage.senderId,
        content: chatMessage.content,
        createdAt: new Date(chatMessage.timestamp)
      }
      setMessages(prev => [...prev, newMessage])
    }
  }, [])

  const { isConnected, sendMessage } = useChatWebSocket({
    roomId: crypto.randomUUID(),
    onMessage: handleMessage,
    onConnect: () => {
      console.log('채팅방 연결됨')
    },
    onDisconnect: () => {
      console.log('채팅방 연결 해제됨')
    },
    onError: error => {
      console.error('WebSocket 오류:', error)
    }
  })

  const handleSendMessage = useCallback(
    (content: string) => {
      if (content.trim() && isConnected) {
        sendMessage(content)
      }
    },
    [isConnected, sendMessage]
  )

  const handleBack = () => {
    navigate(-1)
  }

  const handleRentalItemClick = () => {
    navigate(`/rental-items/${dummyRentalItem.id}`)
  }

  return (
    <div className="flex min-h-screen w-md flex-col bg-white">
      {/* 상단 고정 영역 */}
      <div className="sticky top-0 z-10 bg-white">
        <ChatHeader
          seller={dummySeller}
          onBack={handleBack}
        />
        <ChatRentalItemInfo
          rentalItem={dummyRentalItem}
          onClick={handleRentalItemClick}
        />
        {!isConnected && (
          <div className="bg-yellow-100 px-4 py-2 text-center text-sm text-yellow-800">
            연결 중...
          </div>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
      />

      {/* 메시지 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isConnected}
      />
    </div>
  )
}
