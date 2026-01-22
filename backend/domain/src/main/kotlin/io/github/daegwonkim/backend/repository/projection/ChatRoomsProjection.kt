package io.github.daegwonkim.backend.repository.projection

import java.time.Instant

data class ChatRoomsProjection(
    val chatRoomId: Long,
    val participantNickname: String,
    val rentalItemTitle: String,
    val rentalItemThumbnailImageKey: String,
    val latestMessage: String,
    val latestMessageTime: Instant,
    val unreadCount: Int
)
