package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.repository.jpa.ChatParticipantRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ChatParticipantService(
    private val chatParticipantRepository: ChatParticipantRepository
) {
    @Transactional(readOnly = true)
    fun getChatParticipantUserIds(chatRoomId: Long): List<Long> {
        val chatParticipantUserIds = chatParticipantRepository.findAllByChatRoomId(chatRoomId)
            .map { chatParticipant -> chatParticipant.userId }
        return chatParticipantUserIds
    }
}