package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomUpdateStatusResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomsResponse
import io.github.daegwonkim.backend.service.ChatParticipantService
import io.github.daegwonkim.backend.service.ChatRoomService
import io.github.daegwonkim.backend.service.RentalItemService
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class WebSocketChatService(
    private val messagingTemplate: SimpMessagingTemplate,
    private val chatRoomService: ChatRoomService,
    private val rentalItemService: RentalItemService,
    private val chatParticipantService: ChatParticipantService
) {

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

        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/new-chat/${rentalItemId}", response)

        val chatParticipants = chatParticipantService.getChatParticipants(chatRoom.id).participants
            .filter { it.userId != userId }
            .map { it.nickname }
        val rentalItemSummary = rentalItemService.getRentalItemSummary(rentalItemId)
        notifyParticipants(chatRoom.id, userId) { participantUserId, updateStatus ->
            messagingTemplate.convertAndSendToUser(
                participantUserId.toString(),
                "/queue/new-chat-room-updates",
                GetChatRoomsResponse.ChatRoom(
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
            )
        }
    }

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

        messagingTemplate.convertAndSend("/topic/chat/${chatRoomId}", response)

        notifyParticipants(chatRoomId, userId) { participantUserId, updateStatus ->
            messagingTemplate.convertAndSendToUser(
                participantUserId.toString(),
                "/queue/chat-room-updates",
                ChatRoomUpdateResponse(
                    chatRoomId,
                    updateStatus.latestMessage,
                    updateStatus.latestMessageTime,
                    updateStatus.unreadCount
                )
            )
        }
    }

    fun markAsRead(userId: Long, chatRoomId: Long, chatMessageId: Long) {
        chatRoomService.markAsRead(userId, chatRoomId, chatMessageId)
//        messagingTemplate.convertAndSend("/topic/chat/${chatRoomId}/read")
    }

    private fun notifyParticipants(
        chatRoomId: Long,
        senderId: Long,
        notify: (participantUserId: Long, updateStatus: GetChatRoomUpdateStatusResponse) -> Unit
    ) {
        chatParticipantService.getChatParticipants(chatRoomId)
            .participants.map { it.userId }
            .filter { it != senderId }
            .forEach { participantUserId ->
                val updateStatus = chatRoomService.getChatRoomUpdateStatus(chatRoomId, participantUserId)
                notify(participantUserId, updateStatus)
            }
    }
}
