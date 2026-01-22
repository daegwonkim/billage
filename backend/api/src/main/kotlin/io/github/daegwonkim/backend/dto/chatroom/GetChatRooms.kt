package io.github.daegwonkim.backend.dto.chatroom

import java.time.Instant

data class GetChatRoomsResponse(
    val chatRooms: List<ChatRoom>
) {
    data class ChatRoom(
        val chatRoomId: Long,
        val participantNickname: String,
        val rentalItemTitle: String,
        val rentalItemThumbnailImageUrl: String,
        val latestMessage: String,
        val latestMessageTime: Instant,
        val unreadCount: Int
    )
}