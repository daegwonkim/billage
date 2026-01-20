package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.service.ChatService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller

@Controller
class WebSocketController(
    private val messagingTemplate: SimpMessagingTemplate,
    private val chatService: ChatService
) {

    /**
     * 새로운 채팅방 생성 및 채팅 메시지 전송
     * 클라이언트에서 /app/new-chat/{rentalItemId} 로 메시지를 보내면
     * 새로운 채팅방을 생성하고 /topic/new-chat/{rentalItemId} 를 구독하는 모든 클라이언트에게 브로드캐스트
     */
    @MessageMapping("/new-chat/{rentalItemId}")
    fun createChatRoomAndSendMessage(
        @DestinationVariable rentalItemId: Long,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val (userId, nickname) = extractUserInfo(headerAccessor)
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")

        val chatRoom = chatService.createChatRoom(userId, rentalItemId)
        chatService.saveChatMessage(userId, chatRoom.chatRoomId, request.content)

        val response = ChatMessageResponse(
            chatRoomId = chatRoom.chatRoomId,
            senderId = userId,
            senderNickname = nickname,
            content = request.content,
            type = MessageType.CHAT
        )

        messagingTemplate.convertAndSend("/topic/new-chat/${rentalItemId}", response)
    }

    /**
     * 기존 채팅방에 채팅 메시지 전송
     * 클라이언트에서 /app/chat/{chatRoomId} 로 메시지를 보내면
     * /topic/chat/{chatRoomId} 를 구독하는 모든 클라이언트에게 브로드캐스트
     */
    @MessageMapping("/chat/{chatRoomId}")
    fun sendMessage(
        @DestinationVariable chatRoomId: Long,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val (userId, nickname) = extractUserInfo(headerAccessor)
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")

        chatService.saveChatMessage(userId, chatRoomId, request.content)

        val response = ChatMessageResponse(
            chatRoomId = chatRoomId,
            senderId = userId,
            senderNickname = nickname,
            content = request.content,
            type = MessageType.CHAT
        )

        messagingTemplate.convertAndSend("/topic/chat/${chatRoomId}", response)
    }

    private fun extractUserInfo(headerAccessor: SimpMessageHeaderAccessor): Pair<Long, String>? {
        val sessionAttributes = headerAccessor.sessionAttributes ?: return null
        val userId = sessionAttributes[WebSocketHandshakeInterceptor.USER_ID_KEY] as? Long ?: return null
        val nickname = sessionAttributes[WebSocketHandshakeInterceptor.USER_NICKNAME_KEY] as? String ?: return null
        return Pair(userId, nickname)
    }
}
