import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { useGetChatRooms } from '@/hooks/useChat'
import { useChatListWebSocket } from '@/hooks/useChatListWebSocket'
import { formatDate } from '@/utils/utils'

type ChatTab = 'BORROWER' | 'LENDER'

export function ChatRoomList() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<ChatTab>('BORROWER')

  // 채팅방 목록 실시간 업데이트 구독
  useChatListWebSocket()

  const {
    data: chatRoomsData,
    isLoading: chatRoomsLoading,
    isError: chatRoomsError
  } = useGetChatRooms(activeTab)

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  if (chatRoomsLoading) {
    return <div>로딩중</div>
  }

  if (chatRoomsError) {
    return <div>에러 발생</div>
  }

  const handleChatRoomClick = (chatRoomId: number) => {
    navigate(`/chat/${chatRoomId}`)
  }

  return (
    <div className="min-h-screen w-md bg-white pb-20">
      {/* 상단 바 */}
      <div className="relative flex h-14 items-center border-b border-gray-100 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
          <ChevronLeft
            size={24}
            className="text-neutral-700"
          />
        </button>
        <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
          채팅
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('BORROWER')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
            activeTab === 'BORROWER'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-400'
          }`}>
          빌리는 채팅
        </button>
        <button
          onClick={() => setActiveTab('LENDER')}
          className={`flex-1 py-3 text-center text-sm font-semibold transition-colors ${
            activeTab === 'LENDER'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-400'
          }`}>
          빌려주는 채팅
        </button>
      </div>

      {/* 채팅방 목록 */}
      {chatRoomsData?.chatRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-neutral-800">
              채팅 내역이 없습니다
            </p>
            <p className="text-sm text-neutral-500">
              관심있는 물품의 판매자에게 채팅을 보내보세요
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {chatRoomsData?.chatRooms.map(chatRoom => (
            <button
              key={chatRoom.id}
              onClick={() => handleChatRoomClick(chatRoom.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50">
              {/* 물품 썸네일 */}
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={chatRoom.rentalItem.thumbnailImageUrl}
                  alt={chatRoom.rentalItem.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 채팅 정보 */}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-end gap-1">
                  <span className="font-semibold text-neutral-900">
                    {chatRoom.chatParticipantNickname}
                  </span>
                </div>
                <p className="mb-0.5 truncate text-sm text-neutral-600">
                  {chatRoom.rentalItem.title}
                </p>
                <p className="truncate text-sm text-neutral-400">
                  {chatRoom.messageStatus.latestMessage}
                </p>
              </div>
              <div className="flex h-18 min-w-0 flex-col items-end justify-start gap-1">
                <div className="text-xs text-neutral-400">
                  {formatDate(chatRoom.messageStatus.latestMessageTime)}
                </div>
                {/* 읽지 않은 메시지 카운트 */}
                {chatRoom.messageStatus.unreadCount > 0 && (
                  <div className="flex h-5 w-5 items-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {chatRoom.messageStatus.unreadCount > 99 ? '99+' : chatRoom.messageStatus.unreadCount}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
