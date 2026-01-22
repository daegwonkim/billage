package io.github.daegwonkim.backend.exception.errorcode

import org.springframework.http.HttpStatus

enum class CommonErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    VALIDATION_FAILED("VALIDATION_FAILED", "유효성 검증에 실패했습니다", HttpStatus.BAD_REQUEST),

    RENTAL_ITEM_NOT_FOUND("RENTAL_ITEM_NOT_FOUND", "존재하지 않는 상품입니다", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("USER_NOT_FOUND", "존재하지 않는 사용자입니다", HttpStatus.NOT_FOUND),
    CHAT_ROOM_NOT_FOUND("CHAT_ROOM_NOT_FOUND", "존재하지 않는 채팅방입니다", HttpStatus.NOT_FOUND),

    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR),
    EXTERNAL_API_ERROR("EXTERNAL_API_ERROR", "외부 API 호출에 실패했습니다", HttpStatus.BAD_GATEWAY)
}