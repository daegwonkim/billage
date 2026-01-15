package io.github.daegwonkim.backend.exception.base.errorcode

import org.springframework.http.HttpStatus

enum class CommonErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    VALIDATION_FAILED("VALIDATION_FAILED", "유효성 검증에 실패했습니다", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR),
    EXTERNAL_API_ERROR("EXTERNAL_API_ERROR", "외부 API 호출에 실패했습니다", HttpStatus.BAD_GATEWAY)
}