package io.github.daegwonkim.backend.service

import io.github.daegwonkim.backend.dto.chatroom.CreateChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.CheckChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatMessagesResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomsResponse
import io.github.daegwonkim.backend.entity.ChatMessage
import io.github.daegwonkim.backend.entity.ChatParticipant
import io.github.daegwonkim.backend.entity.ChatRoom
import io.github.daegwonkim.backend.exception.business.ResourceNotFoundException
import io.github.daegwonkim.backend.exception.errorcode.ChatRoomErrorCode
import io.github.daegwonkim.backend.exception.errorcode.RentalItemErrorCode
import io.github.daegwonkim.backend.repository.jpa.ChatMessageRepository
import io.github.daegwonkim.backend.repository.jpa.ChatParticipantRepository
import io.github.daegwonkim.backend.repository.jooq.ChatRoomJooqRepository
import io.github.daegwonkim.backend.repository.jpa.ChatRoomRepository
import io.github.daegwonkim.backend.repository.jpa.RentalItemRepository
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
            .orElseThrow { ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }
        val chatRoomId = chatRoomJooqRepository.findChatRoomIdByRentalItemIdAndParticipantIds(
            rentalItemId,
            listOf(userId, rentalItem.sellerId)
        )
        return CheckChatRoomResponse(chatRoomId)
    }

    @Transactional(readOnly = true)
    fun getChatRoom(id: Long): GetChatRoomResponse {
        val chatRoom = chatRoomJooqRepository.findChatRoomById(id)
            ?: throw ResourceNotFoundException(id, ChatRoomErrorCode.CHAT_ROOM_NOT_FOUND)

        val thumbnailImageUrl = chatRoom.rentalItemThumbnailImageKey.let {
            supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, it)
        }
        val profileImageUrl = chatRoom.sellerProfileImageKey?.let {
            supabaseStorageClient.getPublicUrl(userProfileImagesBucket, it)
        }

        return GetChatRoomResponse.from(
            chatRoom,
            thumbnailImageUrl,
            profileImageUrl
        )
    }

    @Transactional(readOnly = true)
    fun getChatRooms(userId: Long): GetChatRoomsResponse {
        val chatRooms = chatRoomJooqRepository.findChatRoomsByUserId(userId)
            .map { chatRoom ->
                GetChatRoomsResponse.ChatRoom(
                    chatRoom.chatRoomId,
                    chatRoom.participantNickname,
                    chatRoom.rentalItemTitle,
                    supabaseStorageClient.getPublicUrl(rentalItemImagesBucket, chatRoom.rentalItemThumbnailImageKey),
                    chatRoom.latestMessage,
                    chatRoom.latestMessageTime,
                    0
                )
            }

        return GetChatRoomsResponse(chatRooms)
    }

    @Transactional
    fun createChatRoom(userId: Long, rentalItemId: Long): CreateChatRoomResponse {
        val rentalItem = rentalItemRepository.findById(rentalItemId)
            .orElseThrow { ResourceNotFoundException(rentalItemId, RentalItemErrorCode.RENTAL_ITEM_NOT_FOUND) }

        val chatRoom = chatRoomRepository.save(ChatRoom(rentalItemId = rentalItemId))

        val participantIds = listOf(userId, rentalItem.sellerId)
        val chatParticipants = participantIds.map { participantId ->
            ChatParticipant(chatRoomId = chatRoom.id, userId = participantId)
        }
        chatParticipantRepository.saveAll(chatParticipants)

        return CreateChatRoomResponse(chatRoom.id)
    }

    @Transactional
    fun saveChatMessage(userId: Long, chatRoomId: Long, content: String) {
        chatMessageRepository.save(
            ChatMessage(
                chatRoomId = chatRoomId,
                senderId = userId,
                content = content
            )
        )
    }

    @Transactional(readOnly = true)
    fun getChatMessages(id: Long): GetChatMessagesResponse {
        val messages = chatMessageRepository.findAllByChatRoomId(id)
            .map { chatMessage ->
                GetChatMessagesResponse.Message(
                    chatMessage.id,
                    chatMessage.senderId,
                    chatMessage.content,
                    chatMessage.createdAt
                )
            }
        return GetChatMessagesResponse(messages)
    }
}