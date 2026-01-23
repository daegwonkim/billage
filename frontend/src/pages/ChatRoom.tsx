import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, RotateCw } from 'lucide-react'
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
  const markAsReadRef = useRef<((messageId: number | string) => void) | null>(
    null
  )

  // 기존 채팅방: 채팅방 정보 + 메시지 내역 조회
  const {
    data: chatRoomData,
    isLoading: isChatRoomLoading,
    isError: isChatRoomError,
    refetch: refetchChatRoom
  } = useGetChatRoom(Number(chatRoomId), { enabled: !!chatRoomId })
  const { data: chatMessagesData } = useGetChatMessages(Number(chatRoomId), {
    enabled: !!chatRoomId
  })

  // 새 채팅방: 대여물품 정보 조회 (판매자 정보 포함)
  const {
    data: rentalItemData,
    isLoading: isRentalItemLoading,
    isError: isRentalItemError,
    refetch: refetchRentalItem
  } = useGetRentalItem(Number(rentalItemId), { enabled: isNewChat })

  // 기존 채팅 메시지 로드
  useEffect(() => {
    if (chatMessagesData?.messages) {
      const loadedMessages: Message[] = chatMessagesData.messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: new Date(msg.createdAt)
      }))
      setMessages(loadedMessages)
    }
  }, [chatMessagesData])

  // 상대방 참가자 정보 결정
  const otherParticipants = isNewChat
    ? rentalItemData?.seller
      ? [
          {
            id: rentalItemData.seller.id,
            nickname: rentalItemData.seller.nickname,
            profileImageUrl: rentalItemData.seller.profileImageUrl
          }
        ]
      : []
    : (chatRoomData?.participants.filter(p => p.id !== userId) ?? [])
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

        // 상대방 메시지를 받으면 읽음 처리
        if (chatMessage.senderId !== userId) {
          markAsReadRef.current?.(chatMessage.id)
        }

        // 새 채팅방에서 첫 메시지를 받으면 URL 변경
        if (isNewChat && chatMessage.chatRoomId && !currentChatRoomId) {
          setCurrentChatRoomId(String(chatMessage.chatRoomId))
          navigate(`/chat/${chatMessage.chatRoomId}`, { replace: true })
        }
      }
    },
    [isNewChat, currentChatRoomId, navigate, userId]
  )

  const { isConnected, sendMessage, markAsRead } = useChatWebSocket({
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

  // markAsRead를 ref에 할당하여 handleMessage 콜백에서 사용
  useEffect(() => {
    markAsReadRef.current = markAsRead
  }, [markAsRead])

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
  const isError = isNewChat ? isRentalItemError : isChatRoomError
  const refetch = isNewChat ? refetchRentalItem : refetchChatRoom

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-md flex-col bg-white">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <div className="h-7 w-7 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        {/* 물품 정보 스켈레톤 */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <div className="h-14 w-14 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex-1">
            <div className="mb-1.5 h-3.5 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        {/* 메시지 영역 스켈레톤 */}
        <div className="flex-1 px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <div className="mr-2 h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-40 animate-pulse rounded-2xl bg-gray-100" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-48 animate-pulse rounded-2xl bg-gray-200" />
            </div>
            <div className="flex justify-start">
              <div className="mr-2 h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-56 animate-pulse rounded-2xl bg-gray-100" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-36 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
        {/* 입력 영역 스켈레톤 */}
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-md flex-col bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer border-none bg-transparent p-0 text-gray-600 transition-colors hover:text-black">
            <ChevronLeft
              size={28}
              strokeWidth={1.5}
            />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <RotateCw
              size={24}
              className="text-gray-400"
            />
          </div>
          <p className="mb-1 text-base font-semibold text-neutral-800">
            채팅방을 불러올 수 없습니다
          </p>
          <p className="mb-5 text-sm text-neutral-400">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-md flex-col bg-white">
      {/* 상단 고정 영역 */}
      <div className="sticky top-0 z-10 bg-white">
        {otherParticipants.length > 0 && (
          <ChatHeader
            participants={otherParticipants}
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
        participants={chatRoomData?.participants ?? []}
      />

      {/* 메시지 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isConnected}
      />
    </div>
  )
}
