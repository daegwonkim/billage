package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomCommand
import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomRequest
import io.github.daegwonkim.backend.dto.chat.GetOrCreateChatRoomResponse
import io.github.daegwonkim.backend.service.ChatService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/chats")
class ChatController(
    private val chatService: ChatService
) {
    @Operation(summary = "채팅방 확인", description = "기존 채팅방이 있으면 그대로 사용하고, 없으면 새로 생성합니다")
    @PostMapping("/chat-room")
    fun getOrCreateChatRoom(
        @AuthenticationPrincipal userId: Long,
        @RequestBody request: GetOrCreateChatRoomRequest
    ): GetOrCreateChatRoomResponse {
        val command = GetOrCreateChatRoomCommand(request.rentalItemId, listOf(userId, request.sellerId))
        return chatService.getOrCreateChatRoom(command)
    }
}