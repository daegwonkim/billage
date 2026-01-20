package io.github.daegwonkim.backend.websocket

import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.util.UUID

@Controller
class WebSocketController(
    private val messagingTemplate: SimpMessagingTemplate
) {

    /**
     * 채팅 메시지 전송
     * 클라이언트에서 /app/chat/{roomId} 로 메시지를 보내면
     * /topic/chat/{roomId} 를 구독하는 모든 클라이언트에게 브로드캐스트
     */
    @MessageMapping("/chat/{roomId}")
    fun sendMessage(
        @DestinationVariable roomId: UUID,
        @Payload request: ChatMessageRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val (userId, nickname) = extractUserInfo(headerAccessor)
            ?: throw IllegalStateException("인증되지 않은 사용자입니다.")

        val response = ChatMessageResponse(
            roomId = roomId,
            senderId = userId,
            senderNickname = nickname,
            content = request.content,
            type = MessageType.CHAT
        )

        messagingTemplate.convertAndSend("/topic/chat/$roomId", response)
    }

    private fun extractUserInfo(headerAccessor: SimpMessageHeaderAccessor): Pair<Long, String>? {
        val sessionAttributes = headerAccessor.sessionAttributes ?: return null
        val userId = sessionAttributes[WebSocketHandshakeInterceptor.USER_ID_KEY] as? Long ?: return null
        val nickname = sessionAttributes[WebSocketHandshakeInterceptor.USER_NICKNAME_KEY] as? String ?: return null
        return Pair(userId, nickname)
    }
}
