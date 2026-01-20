package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chat.GetChatRoomResponse
import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomResponse
import io.github.daegwonkim.backend.entity.ChatParticipant
import io.github.daegwonkim.backend.entity.ChatRoom
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.exception.errorcode.RentalItemErrorCode
import io.github.daegwonkim.backend.repository.ChatParticipantJpaRepository
import io.github.daegwonkim.backend.repository.ChatRoomJooqRepository
import io.github.daegwonkim.backend.repository.ChatRoomJpaRepository
import io.github.daegwonkim.backend.repository.RentalItemRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class ChatService(
    private val chatRoomJpaRepository: ChatRoomJpaRepository,
    private val chatParticipantJpaRepository: ChatParticipantJpaRepository,
    private val chatRoomJooqRepository: ChatRoomJooqRepository,
    private val rentalItemRepository: RentalItemRepository
) {
    /**
     * 채팅방 조회 (없으면 null 반환)
     */
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

    /**
     * 채팅방 조회 또는 생성
     */
    @Transactional
    fun getOrCreateChatRoom(userId: Long, rentalItemId: Long): GetOrCreateChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }

        val participantIds = listOf(userId, rentalItem.userId)
        val existsChatRoomId = chatRoomJooqRepository.findChatRoomByRentalItemIdAndParticipantIds(rentalItemId, participantIds)

        if (existsChatRoomId != null) {
            return GetOrCreateChatRoomResponse(existsChatRoomId)
        }

        val chatRoom = chatRoomJpaRepository.save(ChatRoom(rentalItemId = rentalItemId))

        val chatParticipants = participantIds.map { participantId ->
            ChatParticipant(chatRoomId = chatRoom.id, userId = participantId)
        }
        chatParticipantJpaRepository.saveAll(chatParticipants)

        return GetOrCreateChatRoomResponse(chatRoom.id)
    }
}