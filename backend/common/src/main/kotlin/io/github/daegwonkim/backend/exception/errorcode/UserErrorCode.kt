package io.github.daegwonkim.backend.exception.errorcode

import org.springframework.http.HttpStatus

enum class UserErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    USER_NOT_FOUND("USER_NOT_FOUND", "존재하지 않는 사용자입니다", HttpStatus.NOT_FOUND)
}