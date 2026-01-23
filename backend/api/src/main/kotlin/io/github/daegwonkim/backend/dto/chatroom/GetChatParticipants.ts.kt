package io.github.daegwonkim.backend.dto.chatroom

data class GetChatParticipantsResponse(
    val participants: List<Participant>
) {
    data class Participant(
        val userId: Long,
        val nickname: String
    )
}