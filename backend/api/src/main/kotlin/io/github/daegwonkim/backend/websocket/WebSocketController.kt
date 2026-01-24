package io.github.daegwonkim.backend.websocket

import io.github.daegwonkim.backend.websocket.message.ChatMessageReadRequest
import io.github.daegwonkim.backend.websocket.message.ChatMessageRequest
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.stereotype.Controller

@Controller
class WebSocketController(
    private val webSocketChatService: WebSocketChatService
) {

    @MessageMapping("/new-chat/{rentalItemId}")
    fun createChatRoomAndSendMessage(
        @DestinationVariable rentalItemId: Long,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val userId = extractUserId(headerAccessor)
        webSocketChatService.createChatRoomAndSendMessage(userId, rentalItemId, request.content)
    }

    @MessageMapping("/chat/{chatRoomId}")
    fun sendMessage(
        @DestinationVariable chatRoomId: Long,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val userId = extractUserId(headerAccessor)
        webSocketChatService.sendMessage(userId, chatRoomId, request.content)
    }

    @MessageMapping("/chat/{chatRoomId}/read")
    fun markAsRead(
        @DestinationVariable chatRoomId: Long,
        @Payload request: ChatMessageReadRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val userId = extractUserId(headerAccessor)
        webSocketChatService.markAsRead(userId, chatRoomId, request.chatMessageId)
    }

    private fun extractUserId(headerAccessor: SimpMessageHeaderAccessor): Long =
        headerAccessor.sessionAttributes
            ?.get(WebSocketHandshakeInterceptor.USER_ID_KEY) as? Long
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")
}
