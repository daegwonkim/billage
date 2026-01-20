import { useState, useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatRentalItemInfo } from '@/components/chat/ChatRentalItemInfo'
import { ChatMessageList } from '@/components/chat/ChatMessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChatWebSocket } from '@/hooks/useChatWebSocket'
import { useAuth } from '@/contexts/AuthContext'
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
  const { chatRoomId } = useParams<{ chatRoomId: string }>()
  const [searchParams] = useSearchParams()
  const rentalItemId = searchParams.get('rentalItemId')
  const { userId } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    chatRoomId ?? null
  )

  // 새 채팅방인지 여부 (chatRoomId 없이 rentalItemId로 진입한 경우)
  const isNewChat = !chatRoomId && !!rentalItemId

  const handleMessage = useCallback(
    (chatMessage: ChatMessageResponse) => {
      // JOIN/LEAVE 메시지는 시스템 메시지로 처리하거나 무시할 수 있음
      if (chatMessage.type === 'CHAT') {
        const newMessage: Message = {
          id: chatMessage.id,
          senderId: chatMessage.senderId,
          content: chatMessage.content,
          createdAt: new Date(chatMessage.timestamp)
        }
        setMessages(prev => [...prev, newMessage])

        // 새 채팅방에서 첫 메시지를 받으면 (백엔드가 채팅방 생성 후 응답)
        // chatRoomId를 업데이트하고 URL 변경
        if (isNewChat && chatMessage.chatRoomId && !currentChatRoomId) {
          setCurrentChatRoomId(String(chatMessage.chatRoomId))
          navigate(`/chat/${chatMessage.chatRoomId}`, { replace: true })
        }
      }
    },
    [isNewChat, currentChatRoomId, navigate]
  )

  const { isConnected, sendMessage } = useChatWebSocket({
    chatRoomId: currentChatRoomId ?? '',
    rentalItemId: isNewChat ? rentalItemId : undefined,
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
        currentUserId={userId ?? 0}
      />

      {/* 메시지 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isConnected}
      />
    </div>
  )
}
