package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.chat.GetChatRoomResponse
import io.github.daegwonkim.backend.service.ChatService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/chats")
class ChatController(
    private val chatService: ChatService
) {
    @Operation(summary = "채팅방 조회", description = "기존 채팅방이 있으면 채팅방 ID를 반환하고, 없으면 null을 반환합니다")
    @GetMapping("/chat-room")
    fun getChatRoom(
        @AuthenticationPrincipal userId: Long,
        @RequestParam rentalItemId: Long
    ): GetChatRoomResponse {
        return chatService.getChatRoom(userId, rentalItemId)
    }
}
