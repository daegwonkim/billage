package io.github.daegwonkim.backend.exception.errorcode

import org.springframework.http.HttpStatus

enum class AuthErrorCode(
    override val code: String,
    override val message: String,
    override val status: HttpStatus
) : ErrorCode {
    INVALID_VERIFICATION_CODE("INVALID_VERIFICATION_CODE", "인증코드가 일치하지 않습니다", HttpStatus.BAD_REQUEST),
    VERIFICATION_CODE_EXPIRED("VERIFICATION_CODE_EXPIRED", "인증코드가 만료 되었습니다", HttpStatus.GONE),
    NEIGHBORHOOD_VERIFICATION_FAILED("NEIGHBORHOOD_VERIFICATION_FAILED", "동네 인증에 실패했습니다", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "인증에 실패했습니다", HttpStatus.UNAUTHORIZED),
    SMS_RATE_LIMIT_EXCEEDED("SMS_RATE_LIMIT_EXCEEDED", "인증코드 발송 횟수를 초과했습니다.", HttpStatus.TOO_MANY_REQUESTS)
}