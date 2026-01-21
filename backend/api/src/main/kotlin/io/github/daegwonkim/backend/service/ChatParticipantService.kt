package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.repository.jooq.ChatParticipantJooqRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ChatParticipantService(
    private val chatParticipantJooqRepository: ChatParticipantJooqRepository
) {
    @Transactional(readOnly = true)
    fun isParticipant(chatRoomId: Long, userId: Long): Boolean {
        return chatParticipantJooqRepository.checkParticipant(chatRoomId, userId)
    }
}