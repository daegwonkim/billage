package io.github.daegwonkim.backend.dto.chatroom

import java.time.Instant

data class GetChatRoomsResponse(
    val chatRooms: List<ChatRoom>
) {
    data class ChatRoom(
        val id: Long,
        val chatParticipantNickname: String,
        val rentalItem: RentalItem,
        val messageStatus: MessageStatus
    ) {
        data class RentalItem(
            val title: String,
            val thumbnailImageUrl: String,
        )

        data class MessageStatus(
            val latestMessage: String,
            val latestMessageTime: Instant,
            val unreadCount: Int
        )
    }
}