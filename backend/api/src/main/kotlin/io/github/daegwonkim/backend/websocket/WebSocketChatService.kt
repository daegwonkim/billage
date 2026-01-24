package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomsResponse
import io.github.daegwonkim.backend.entity.OutboxEvent
import io.github.daegwonkim.backend.event.dto.OutboxPublishEvent
import io.github.daegwonkim.backend.repository.jpa.OutboxEventRepository
import io.github.daegwonkim.backend.service.ChatParticipantService
import io.github.daegwonkim.backend.service.ChatRoomService
import io.github.daegwonkim.backend.service.RentalItemService
import io.github.daegwonkim.backend.websocket.message.BroadcastDestination
import io.github.daegwonkim.backend.websocket.message.ChatBroadcastMessage
import io.github.daegwonkim.backend.websocket.message.ChatMessageResponse
import io.github.daegwonkim.backend.websocket.message.ChatRoomUpdateResponse
import io.github.daegwonkim.backend.websocket.message.DestinationType
import io.github.daegwonkim.backend.websocket.message.MessageType
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.ObjectMapper

@Service
class WebSocketChatService(
    private val chatRoomService: ChatRoomService,
    private val rentalItemService: RentalItemService,
    private val chatParticipantService: ChatParticipantService,
    private val outboxEventRepository: OutboxEventRepository,
    private val objectMapper: ObjectMapper,
    private val applicationEventPublisher: ApplicationEventPublisher
) {

    @Transactional
    fun createChatRoomAndSendMessage(userId: Long, rentalItemId: Long, content: String) {
        val chatRoom = chatRoomService.createChatRoom(userId, rentalItemId)
        val chatMessage = chatRoomService.saveChatMessage(userId, chatRoom.id, content)

        val response = ChatMessageResponse(
            id = chatMessage.id,
            chatRoomId = chatRoom.id,
            senderId = userId,
            content = content,
            type = MessageType.CHAT,
            timestamp = chatMessage.createdAt
        )

        val broadcasts = mutableListOf<ChatBroadcastMessage>()

        // Notify sender about new chat room
        broadcasts.add(
            ChatBroadcastMessage(
                destinations = listOf(
                    BroadcastDestination(
                        type = DestinationType.USER,
                        path = "/queue/new-chat/$rentalItemId",
                        userId = userId.toString()
                    )
                ),
                payload = response
            )
        )

        // Notify other participants about new chat room
        val chatParticipants = chatParticipantService.getChatParticipants(chatRoom.id).participants
            .filter { it.userId != userId }
            .map { it.nickname }
        val rentalItemSummary = rentalItemService.getRentalItemSummary(rentalItemId)

        chatParticipantService.getChatParticipants(chatRoom.id)
            .participants.map { it.userId }
            .filter { it != userId }
            .forEach { participantUserId ->
                val updateStatus = chatRoomService.getChatRoomUpdateStatus(chatRoom.id, participantUserId)
                val chatRoomUpdate = GetChatRoomsResponse.ChatRoom(
                    chatRoom.id,
                    chatParticipants,
                    GetChatRoomsResponse.ChatRoom.RentalItem(
                        rentalItemSummary.title,
                        rentalItemSummary.thumbnailImageUrl
                    ),
                    GetChatRoomsResponse.ChatRoom.MessageStatus(
                        updateStatus.latestMessage,
                        updateStatus.latestMessageTime,
                        updateStatus.unreadCount
                    )
                )
                broadcasts.add(
                    ChatBroadcastMessage(
                        destinations = listOf(
                            BroadcastDestination(
                                type = DestinationType.USER,
                                path = "/queue/new-chat-room-updates",
                                userId = participantUserId.toString()
                            )
                        ),
                        payload = chatRoomUpdate
                    )
                )
            }

        saveOutboxEvents(chatRoom.id.toString(), "NEW_CHAT_ROOM", broadcasts)
    }

    @Transactional
    fun sendMessage(userId: Long, chatRoomId: Long, content: String) {
        val chatParticipantUserIds = chatParticipantService.getChatParticipants(chatRoomId)
            .participants.map { it.userId }

        if (!chatParticipantUserIds.contains(userId)) {
            throw IllegalStateException("채팅방 참여자가 아닙니다.")
        }

        val chatMessage = chatRoomService.saveChatMessage(userId, chatRoomId, content)

        val response = ChatMessageResponse(
            id = chatMessage.id,
            chatRoomId = chatRoomId,
            senderId = userId,
            content = content,
            type = MessageType.CHAT,
            timestamp = chatMessage.createdAt
        )

        val broadcasts = mutableListOf<ChatBroadcastMessage>()

        // Broadcast to topic
        broadcasts.add(
            ChatBroadcastMessage(
                destinations = listOf(
                    BroadcastDestination(
                        type = DestinationType.TOPIC,
                        path = "/topic/chat/$chatRoomId"
                    )
                ),
                payload = response
            )
        )

        // Notify other participants
        chatParticipantUserIds
            .filter { it != userId }
            .forEach { participantUserId ->
                val updateStatus = chatRoomService.getChatRoomUpdateStatus(chatRoomId, participantUserId)
                broadcasts.add(
                    ChatBroadcastMessage(
                        destinations = listOf(
                            BroadcastDestination(
                                type = DestinationType.USER,
                                path = "/queue/chat-room-updates",
                                userId = participantUserId.toString()
                            )
                        ),
                        payload = ChatRoomUpdateResponse(
                            chatRoomId,
                            updateStatus.latestMessage,
                            updateStatus.latestMessageTime,
                            updateStatus.unreadCount
                        )
                    )
                )
            }

        saveOutboxEvents(chatRoomId.toString(), "CHAT_MESSAGE", broadcasts)
    }

    fun markAsRead(userId: Long, chatRoomId: Long, chatMessageId: Long) {
        chatRoomService.markAsRead(userId, chatRoomId, chatMessageId)
    }

    private fun saveOutboxEvents(aggregateId: String, eventType: String, broadcasts: List<ChatBroadcastMessage>) {
        val payload = objectMapper.writeValueAsString(broadcasts)
        val outboxEvent = outboxEventRepository.save(
            OutboxEvent(
                aggregateType = "ChatRoom",
                aggregateId = aggregateId,
                eventType = eventType,
                payload = payload
            )
        )
        applicationEventPublisher.publishEvent(OutboxPublishEvent(outboxEvent.id))
    }
}
