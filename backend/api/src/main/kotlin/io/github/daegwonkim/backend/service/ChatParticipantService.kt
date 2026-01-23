package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chatroom.GetChatParticipantsResponse
import io.github.daegwonkim.backend.repository.jooq.ChatParticipantJooqRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ChatParticipantService(
    private val chatParticipantJooqRepository: ChatParticipantJooqRepository
) {
    @Transactional(readOnly = true)
    fun getChatParticipants(chatRoomId: Long): GetChatParticipantsResponse {
        val chatParticipants = chatParticipantJooqRepository.findAllByChatRoomId(chatRoomId)
            .map { chatParticipant ->
                GetChatParticipantsResponse.Participant(chatParticipant.userId, chatParticipant.nickname)
            }
        return GetChatParticipantsResponse(chatParticipants)
    }
}