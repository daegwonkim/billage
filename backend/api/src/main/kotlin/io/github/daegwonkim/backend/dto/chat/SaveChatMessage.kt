package io.github.daegwonkim.backend.dto.chat

data class SaveChatMessageRequest(
    val chatRoomId: Long,
    val userId: Long,
    val content: String
)