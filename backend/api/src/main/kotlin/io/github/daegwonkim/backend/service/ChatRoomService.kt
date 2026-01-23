package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chatroom.CreateChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.CheckChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatMessagesResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomUpdateStatusResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomsResponse
import io.github.daegwonkim.backend.dto.chatroom.SaveChatMessageResponse
import io.github.daegwonkim.backend.entity.ChatMessage
import io.github.daegwonkim.backend.entity.ChatParticipant
import io.github.daegwonkim.backend.entity.ChatRoom
import io.github.daegwonkim.backend.enumerate.RentalRole
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.exception.errorcode.CommonErrorCode
import io.github.daegwonkim.backend.repository.jooq.ChatParticipantJooqRepository
import io.github.daegwonkim.backend.repository.jpa.ChatMessageRepository
import io.github.daegwonkim.backend.repository.jpa.ChatParticipantRepository
import io.github.daegwonkim.backend.repository.jooq.ChatRoomJooqRepository
import io.github.daegwonkim.backend.repository.jpa.ChatRoomRepository
import io.github.daegwonkim.backend.repository.jpa.RentalItemRepository
import io.github.daegwonkim.backend.repository.projection.ChatParticipantsProjection
import io.github.daegwonkim.backend.supabase.SupabaseStorageClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class ChatRoomService(
    private val chatRoomRepository: ChatRoomRepository,
    private val chatMessageRepository: ChatMessageRepository,
    private val chatParticipantRepository: ChatParticipantRepository,
    private val chatRoomJooqRepository: ChatRoomJooqRepository,
    private val chatParticipantJooqRepository: ChatParticipantJooqRepository,
    private val rentalItemRepository: RentalItemRepository,

    private val supabaseStorageClient: SupabaseStorageClient,

    @Value($$"${supabase.storage.bucket.rental-item-images}")
    private val rentalItemImagesBucket: String,
    @Value($$"${supabase.storage.bucket.user-profile-images}")
    private val userProfileImagesBucket: String
) {

    @Transactional(readOnly = true)
    fun checkChatRoom(userId: Long, rentalItemId: Long): CheckChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, CommonErrorCode.RENTAL_ITEM_NOT_FOUND) }
        val chatRoomId = chatRoomJooqRepository.findChatRoomIdByRentalItemIdAndParticipantIds(
            rentalItemId,
            listOf(userId, rentalItem.sellerId)
        )
        return CheckChatRoomResponse(chatRoomId)
    }

    @Transactional(readOnly = true)
    fun getChatRoom(id: Long): GetChatRoomResponse {
        val chatRoom = chatRoomJooqRepository.findChatRoomById(id)
            ?: throw ResourceNotFoundException(id, CommonErrorCode.CHAT_ROOM_NOT_FOUND)

        val chatParticipants = chatParticipantJooqRepository.findChatParticipantsByChatRoomId(chatRoom.id)
            .map { it.toParticipant() }

        val rentalItem = GetChatRoomResponse.RentalItem(
            id = chatRoom.rentalItemId,
            seller = GetChatRoomResponse.RentalItem.Seller(
                id = chatRoom.sellerId,
                nickname = chatRoom.sellerNickname,
                profileImageUrl = imageUrl(userProfileImagesBucket, chatRoom.sellerProfileImageKey),
                address = chatRoom.sellerAddress
            ),
            category = chatRoom.rentalItemCategory,
            title = chatRoom.rentalItemTitle,
            pricePerDay = chatRoom.rentalItemPricePerDay,
            pricePerWeek = chatRoom.rentalItemPricePerWeek,
            thumbnailImageUrl = supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, chatRoom.rentalItemThumbnailImageKey)
        )

        return GetChatRoomResponse(chatRoom.id, rentalItem, chatParticipants)
    }

    @Transactional(readOnly = true)
    fun getChatRooms(userId: Long, type: RentalRole): GetChatRoomsResponse {
        val chatRooms = chatRoomJooqRepository.findChatRoomsByUserId(userId, type)
            .map { chatRoom ->
                GetChatRoomsResponse.ChatRoom(
                    chatRoom.id,
                    chatRoom.chatParticipantNickname,
                    GetChatRoomsResponse.ChatRoom.RentalItem(
                        chatRoom.rentalItemTitle,
                        supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, chatRoom.rentalItemThumbnailImageKey),
                    ),
                    GetChatRoomsResponse.ChatRoom.MessageStatus(
                        chatRoom.latestMessage,
                        chatRoom.latestMessageTime,
                        chatRoom.unreadCount
                    )
                )
            }

        return GetChatRoomsResponse(chatRooms)
    }

    @Transactional
    fun createChatRoom(userId: Long, rentalItemId: Long): CreateChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, CommonErrorCode.RENTAL_ITEM_NOT_FOUND) }

        val chatRoom = chatRoomRepository.save(ChatRoom(rentalItemId = rentalItemId))

        val participantIds = listOf(userId, rentalItem.sellerId)
        val chatParticipants = participantIds.map { participantId ->
            ChatParticipant(chatRoomId = chatRoom.id, userId = participantId)
        }
        chatParticipantRepository.saveAll(chatParticipants)

        return CreateChatRoomResponse(chatRoom.id)
    }

    @Transactional
    fun saveChatMessage(userId: Long, chatRoomId: Long, content: String): SaveChatMessageResponse {
        val chatMessage = chatMessageRepository.save(
            ChatMessage(
                chatRoomId = chatRoomId,
                senderId = userId,
                content = content
            )
        )

        return SaveChatMessageResponse(chatMessage.id, chatMessage.createdAt)
    }

    @Transactional
    fun getChatMessages(userId: Long, chatRoomId: Long): GetChatMessagesResponse {
        val messages = chatMessageRepository.findAllByChatRoomId(chatRoomId)
            .map { chatMessage ->
                GetChatMessagesResponse.Message(
                    chatMessage.id,
                    chatMessage.senderId,
                    chatMessage.content,
                    chatMessage.createdAt
                )
            }
        chatParticipantJooqRepository.updateLastReadMessageId(userId, chatRoomId)

        return GetChatMessagesResponse(messages)
    }

    @Transactional
    fun markAsRead(userId: Long, chatRoomId: Long, chatMessageId: Long) {
        chatParticipantJooqRepository.updateLastReadMessageId(userId, chatRoomId, chatMessageId)
    }

    @Transactional(readOnly = true)
    fun getChatRoomUpdateStatus(chatRoomId: Long, chatParticipantUserId: Long): GetChatRoomUpdateStatusResponse {
        val updateStatus = chatRoomJooqRepository.findChatRoomUpdateStatus(chatRoomId, chatParticipantUserId)
            ?: throw IllegalStateException()

        return GetChatRoomUpdateStatusResponse(
            updateStatus.latestMessage,
            updateStatus.latestMessageTime,
            updateStatus.unreadCount
        )
    }

    private fun ChatParticipantsProjection.toParticipant() = GetChatRoomResponse.Participant(
        id = userId,
        nickname = nickname,
        profileImageUrl = imageUrl(userProfileImagesBucket, profileImageKey)
    )

    private fun imageUrl(bucket: String, key: String?): String? =
        key?.let { supabaseStorageClient.getPublicUrl(bucket, it) }
}