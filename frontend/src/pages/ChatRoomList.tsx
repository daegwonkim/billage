import { ChevronLeft, RotateCw } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { useGetChatRooms } from '@/hooks/useChat'
import { useChatListWebSocket } from '@/hooks/useChatListWebSocket'
import { formatDate } from '@/utils/utils'

type ChatTab = 'BORROWER' | 'LENDER'

export function ChatRoomList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const activeTab = (searchParams.get('type') as ChatTab) || 'BORROWER'

  const setActiveTab = (tab: ChatTab) => {
    setSearchParams({ type: tab }, { replace: true })
  }

  // 채팅방 목록 실시간 업데이트 구독
  useChatListWebSocket()

  const {
    data: chatRoomsData,
    isLoading: chatRoomsLoading,
    isError: chatRoomsError,
    refetch: refetchChatRooms
  } = useGetChatRooms(activeTab, { enabled: isAuthenticated })

  if (!isAuthenticated) {
    return <LoginPrompt />
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

      {/* 로딩 스켈레톤 */}
      {chatRoomsLoading ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full items-center gap-3 px-4 py-3">
              <div className="h-18 w-18 shrink-0 animate-pulse rounded-lg bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mb-1 h-3.5 w-32 animate-pulse rounded bg-gray-100" />
                <div className="h-3.5 w-40 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="flex h-18 flex-col items-end justify-start">
                <div className="h-3 w-10 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : chatRoomsError ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <RotateCw
              size={24}
              className="text-gray-400"
            />
          </div>
          <p className="mb-1 text-base font-semibold text-neutral-800">
            채팅 목록을 불러올 수 없습니다
          </p>
          <p className="mb-5 text-sm text-neutral-400">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <button
            onClick={() => refetchChatRooms()}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
            다시 시도
          </button>
        </div>
      ) : chatRoomsData?.chatRooms.length === 0 ? (
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
                    {chatRoom.participants.join(', ')}
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
                    {chatRoom.messageStatus.unreadCount > 99
                      ? '99+'
                      : chatRoom.messageStatus.unreadCount}
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
