package io.github.daegwonkim.backend.dto.chat

data class GetOrCreateChatRoomRequest(
    val rentalItemId: Long,
    val sellerId: Long
)

data class GetOrCreateChatRoomCommand(
    val rentalItemId: Long,
    val participantIds: List<Long>
)

data class GetOrCreateChatRoomResponse(
    val chatRoomId: Long
)