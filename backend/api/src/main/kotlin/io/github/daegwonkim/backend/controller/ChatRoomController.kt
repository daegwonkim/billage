package io.github.daegwonkim.backend.controller

import io.github.daegwonkim.backend.dto.chatroom.CheckChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatMessagesResponse
import io.github.daegwonkim.backend.dto.chatroom.GetChatRoomsResponse
import io.github.daegwonkim.backend.service.ChatRoomService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/chat-rooms")
class ChatRoomController(
    private val chatRoomService: ChatRoomService
) {
    @Operation(summary = "채팅방 확인", description = "기존 채팅방이 있으면 채팅방 ID를 반환하고, 없으면 null을 반환합니다")
    @GetMapping("/check")
    fun checkChatRoom(
        @AuthenticationPrincipal userId: Long,
        @RequestParam rentalItemId: Long
    ): CheckChatRoomResponse {
        return chatRoomService.checkChatRoom(userId, rentalItemId)
    }

    @Operation(summary = "채팅방 정보 조회", description = "기존 채팅방 정보를 조회합니다")
    @GetMapping("/{id}")
    fun getChatRoom(
        @PathVariable("id") id: Long
    ): GetChatRoomResponse {
        return chatRoomService.getChatRoom(id)
    }

    @Operation(summary = "채팅방 목록 조회", description = "채팅방 목록을 조회합니다")
    @GetMapping
    fun getChatRooms(@AuthenticationPrincipal userId: Long): GetChatRoomsResponse {
        return chatRoomService.getChatRooms(userId)
    }

    @Operation(summary = "채팅 내역 조회", description = "특정 채팅방의 채팅 내역을 조회합니다")
    @GetMapping("/{id}/messages")
    fun getChatMessages(
        @PathVariable("id") id: Long
    ): GetChatMessagesResponse {
        return chatRoomService.getChatMessages(id)
    }
}
