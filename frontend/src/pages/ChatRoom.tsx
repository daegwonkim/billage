import { useNavigate, useParams } from 'react-router-dom'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatRentalItemInfo } from '@/components/chat/ChatRentalItemInfo'
import { ChatMessageList } from '@/components/chat/ChatMessageList'
import { ChatInput } from '@/components/chat/ChatInput'

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

const dummyMessages = [
  {
    id: 1,
    senderId: 1,
    content: '안녕하세요! 텐트 대여 문의드립니다.',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: 2,
    senderId: 2,
    content: '네 안녕하세요! 어떤 부분이 궁금하신가요?',
    createdAt: new Date('2024-01-15T10:31:00')
  },
  {
    id: 3,
    senderId: 1,
    content: '이번 주말에 대여 가능할까요?',
    createdAt: new Date('2024-01-15T10:32:00')
  },
  {
    id: 4,
    senderId: 2,
    content: '네, 가능합니다! 토요일 오전에 픽업하시면 될까요?',
    createdAt: new Date('2024-01-15T10:33:00')
  },
  {
    id: 5,
    senderId: 1,
    content: '좋아요! 그럼 토요일 10시에 뵐게요.',
    createdAt: new Date('2024-01-15T10:35:00')
  }
]

export function ChatRoom() {
  const navigate = useNavigate()
  const { roomId: _roomId } = useParams<{ roomId: string }>()

  // 현재 유저 ID (나중에 AuthContext에서 가져옴)
  const currentUserId = 1

  // TODO: roomId를 사용하여 채팅방 데이터 로드
  // const { data: chatRoom } = useGetChatRoom(_roomId)

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
      </div>

      {/* 채팅 메시지 영역 */}
      <ChatMessageList
        messages={dummyMessages}
        currentUserId={currentUserId}
      />

      {/* 메시지 입력 영역 */}
      <ChatInput />
    </div>
  )
}
