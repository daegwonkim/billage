package io.github.daegwonkim.backend.dto.chat

data class GetChatRoomResponse(
    val chatRoomId: Long?
)

data class GetOrCreateChatRoomResponse(
    val chatRoomId: Long
)