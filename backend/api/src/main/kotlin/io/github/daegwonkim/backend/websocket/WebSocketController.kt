package io.github.daegwonkim.backend.websocket

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
        val (userId, nickname) = extractUserInfo(headerAccessor)
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")

        webSocketChatService.createChatRoomAndSendMessage(userId, nickname, rentalItemId, request.content)
    }

    @MessageMapping("/chat/{chatRoomId}")
    fun sendMessage(
        @DestinationVariable chatRoomId: Long,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val (userId, nickname) = extractUserInfo(headerAccessor)
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")

        webSocketChatService.sendMessage(userId, nickname, chatRoomId, request.content)
    }

    private fun extractUserInfo(headerAccessor: SimpMessageHeaderAccessor): Pair<Long, String>? {
        val sessionAttributes = headerAccessor.sessionAttributes ?: return null
        val userId = sessionAttributes[WebSocketHandshakeInterceptor.USER_ID_KEY] as? Long ?: return null
        val nickname = sessionAttributes[WebSocketHandshakeInterceptor.USER_NICKNAME_KEY] as? String ?: return null
        return Pair(userId, nickname)
    }
}
