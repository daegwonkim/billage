package io.github.daegwonkim.backend_kotlin.common.exception

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val code: String,
    val message: String,
    val status: HttpStatus
) {
    // Common - 공통 에러
    INVALID_INPUT_VALUE("C-001", "잘못된 입력값입니다", HttpStatus.BAD_REQUEST),

    // Authentication - 인증 관련
    VERIFICATION_CODE_NOT_FOUND("A-001", "인증번호가 존재하지 않거나 만료되었습니다", HttpStatus.NOT_FOUND),
    VERIFICATION_CODE_MISMATCH("A-002", "인증번호가 일치하지 않습니다", HttpStatus.BAD_REQUEST),
    VERIFIED_TOKEN_NOT_FOUND("A-003", "인증토큰이 존재하지 않거나 만료되었습니다", HttpStatus.NOT_FOUND),
    VERIFIED_TOKEN_MISMATCH("A-004", "인증토큰이 일치하지 않습니다", HttpStatus.NOT_FOUND),

    // User - 사용자 관련
    USER_NOT_FOUND("U-001", "사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),

    // External Service - 외부 서비스 관련
    SMS_SEND_FAILED("E-001", "SMS 전송에 실패했습니다", HttpStatus.INTERNAL_SERVER_ERROR),

    // Server - 서버 관련
    INTERNAL_SERVER_ERROR("S-001", "서버 내부 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR);
}