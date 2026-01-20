package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomCommand
import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomResponse
import io.github.daegwonkim.backend.entity.ChatParticipant
import io.github.daegwonkim.backend.entity.ChatRoom
import io.github.daegwonkim.backend.repository.ChatParticipantJpaRepository
import io.github.daegwonkim.backend.repository.ChatRoomJooqRepository
import io.github.daegwonkim.backend.repository.ChatRoomJpaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class ChatService(
    private val chatRoomJpaRepository: ChatRoomJpaRepository,
    private val chatParticipantJpaRepository: ChatParticipantJpaRepository,
    private val chatRoomJooqRepository: ChatRoomJooqRepository
) {
    @Transactional
    fun getOrCreateChatRoom(command: GetOrCreateChatRoomCommand): GetOrCreateChatRoomResponse {
        val existsChatRoomId = chatRoomJooqRepository.findChatRoomByRentalItemIdAndParticipantIds(
            command.rentalItemId,
            command.participantIds
        )

        if (existsChatRoomId != null) {
            return GetOrCreateChatRoomResponse(existsChatRoomId)
        }

        val chatRoom = chatRoomJpaRepository.save(ChatRoom(rentalItemId = command.rentalItemId))

        val chatParticipants = command.participantIds.map { participantId ->
            ChatParticipant(chatRoomId = chatRoom.id, userId = participantId)
        }
        chatParticipantJpaRepository.saveAll(chatParticipants)

        return GetOrCreateChatRoomResponse(chatRoom.id)
    }
}