package io.github.daegwonkim.backend.dto.chatroom

data class SaveChatMessageRequest(
    val chatRoomId: Long,
    val userId: Long,
    val content: String
)