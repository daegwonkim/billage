package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chat.GetChatRoomResponse
import io.github.daegwonkim.backend.dto.chat.CreateChatRoomResponse
import io.github.daegwonkim.backend.entity.ChatParticipant
import io.github.daegwonkim.backend.entity.ChatRoom
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.exception.errorcode.RentalItemErrorCode
import io.github.daegwonkim.backend.repository.ChatParticipantRepository
import io.github.daegwonkim.backend.repository.ChatRoomJooqRepository
import io.github.daegwonkim.backend.repository.ChatRoomRepository
import io.github.daegwonkim.backend.repository.RentalItemRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class ChatService(
    private val chatRoomRepository: ChatRoomRepository,
    private val chatParticipantRepository: ChatParticipantRepository,
    private val chatRoomJooqRepository: ChatRoomJooqRepository,
    private val rentalItemRepository: RentalItemRepository
) {

    @Transactional(readOnly = true)
    fun getChatRoom(userId: Long, rentalItemId: Long): GetChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }
        val chatRoomId = chatRoomJooqRepository.findChatRoomByRentalItemIdAndParticipantIds(
            rentalItemId,
            listOf(userId, rentalItem.userId)
        )
        return GetChatRoomResponse(chatRoomId)
    }

    @Transactional
    fun createChatRoom(userId: Long, rentalItemId: Long): CreateChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }

        val chatRoom = chatRoomRepository.save(ChatRoom(rentalItemId = rentalItemId))

        val participantIds = listOf(userId, rentalItem.userId)
        val chatParticipants = participantIds.map { participantId ->
            ChatParticipant(chatRoomId = chatRoom.id, userId = participantId)
        }
        chatParticipantRepository.saveAll(chatParticipants)

        return CreateChatRoomResponse(chatRoom.id)
    }
}