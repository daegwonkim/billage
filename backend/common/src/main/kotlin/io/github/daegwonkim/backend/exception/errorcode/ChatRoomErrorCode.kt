package io.github.daegwonkim.backend.exception.errorcode

import org.springframework.http.HttpStatus

enum class ChatRoomErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    CHAT_ROOM_NOT_FOUND("CHAT_ROOM_NOT_FOUND", "존재하지 않는 채팅방입니다", HttpStatus.NOT_FOUND)
}