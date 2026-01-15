package io.github.daegwonkim.backend.exception.base

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val code: String,
    val message: String,
    val status: HttpStatus
) {
    // 인증 관련 에러
    INVALID_VERIFICATION_CODE("INVALID_VERIFICATION_CODE", "인증코드가 일치하지 않습니다", HttpStatus.BAD_REQUEST),
    VERIFICATION_CODE_EXPIRED("VERIFICATION_CODE_EXPIRED", "인증코드가 만료 되었습니다", HttpStatus.GONE),
    NEIGHBORHOOD_VERIFICATION_FAILED("NEIGHBORHOOD_VERIFICATION_FAILED", "동네 인증에 실패했습니다", HttpStatus.BAD_REQUEST),
    AUTHENTICATION_FAILED("AUTHENTICATION_FAILED", "인증에 실패했습니다", HttpStatus.UNAUTHORIZED),

    VALIDATION_FAILED("VALIDATION_FAILED", "유효성 검증에 실패했습니다", HttpStatus.BAD_REQUEST),

    USER_NOT_FOUND("USER_NOT_FOUND", "존재하지 않는 사용자입니다", HttpStatus.NOT_FOUND),
    RENTAL_ITEM_NOT_FOUND("RENTAL_ITEM_NOT_FOUND", "존재하지 않는 상품입니다", HttpStatus.NOT_FOUND),

    UNSUPPORTED_REGION("UNSUPPORTED_REGION", "지원하지 않는 지역입니다", HttpStatus.UNPROCESSABLE_CONTENT),

    // 서버 에러
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR),
}