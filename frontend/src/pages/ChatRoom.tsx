import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatRentalItemInfo } from '@/components/chat/ChatRentalItemInfo'
import { ChatMessageList } from '@/components/chat/ChatMessageList'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChatWebSocket } from '@/hooks/useChatWebSocket'
import { useAuth } from '@/contexts/AuthContext'
import { useGetChatRoom, useGetChatMessages } from '@/hooks/useChat'
import { useGetRentalItem } from '@/hooks/useRentalItem'
import type { ChatMessageResponse } from '@/api/chat/dto/ChatMessage'

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

  // 기존 채팅방: 채팅방 정보 + 메시지 내역 조회
  const { data: chatRoomData, isLoading: isChatRoomLoading } = useGetChatRoom(
    Number(chatRoomId),
    { enabled: !!chatRoomId }
  )
  const { data: chatMessagesData } = useGetChatMessages(Number(chatRoomId), {
    enabled: !!chatRoomId
  })

  // 새 채팅방: 대여물품 정보 조회 (판매자 정보 포함)
  const { data: rentalItemData, isLoading: isRentalItemLoading } =
    useGetRentalItem(Number(rentalItemId), { enabled: isNewChat })

  // 기존 채팅 메시지 로드
  useEffect(() => {
    if (chatMessagesData?.messages) {
      const loadedMessages: Message[] = chatMessagesData.messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: new Date(msg.timestamp)
      }))
      setMessages(loadedMessages)
    }
  }, [chatMessagesData])

  // 상대방 정보 및 대여물품 정보 결정
  const seller = isNewChat ? rentalItemData?.seller : chatRoomData?.seller
  const rentalItem = isNewChat
    ? rentalItemData
      ? {
          id: rentalItemData.id,
          title: rentalItemData.title,
          category: rentalItemData.category,
          pricePerDay: rentalItemData.pricePerDay,
          pricePerWeek: rentalItemData.pricePerWeek,
          imageUrl: rentalItemData.imageUrls?.[0] ?? ''
        }
      : null
    : chatRoomData?.rentalItem
      ? {
          id: chatRoomData.rentalItem.id,
          title: chatRoomData.rentalItem.title,
          category: chatRoomData.rentalItem.category,
          pricePerDay: chatRoomData.rentalItem.pricePerDay,
          pricePerWeek: chatRoomData.rentalItem.pricePerWeek,
          imageUrl: chatRoomData.rentalItem.thumbnailImageUrl
        }
      : null

  const handleMessage = useCallback(
    (chatMessage: ChatMessageResponse) => {
      if (chatMessage.type === 'CHAT') {
        const newMessage: Message = {
          id: chatMessage.id,
          senderId: chatMessage.senderId,
          content: chatMessage.content,
          createdAt: new Date(chatMessage.timestamp)
        }
        setMessages(prev => [...prev, newMessage])

        // 새 채팅방에서 첫 메시지를 받으면 URL 변경
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
    if (rentalItem) {
      navigate(`/rental-items/${rentalItem.id}`)
    }
  }

  const isLoading = isNewChat ? isRentalItemLoading : isChatRoomLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-md items-center justify-center bg-white">
        <div className="text-neutral-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-md flex-col bg-white">
      {/* 상단 고정 영역 */}
      <div className="sticky top-0 z-10 bg-white">
        {seller && (
          <ChatHeader
            seller={seller}
            onBack={handleBack}
          />
        )}
        {rentalItem && (
          <ChatRentalItemInfo
            rentalItem={rentalItem}
            onClick={handleRentalItemClick}
          />
        )}
        {!isConnected && (
          <div className="h-1 w-full overflow-hidden bg-gray-100">
            <div className="h-full w-1/3 animate-[slide_1s_ease-in-out_infinite] bg-gray-400" />
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
