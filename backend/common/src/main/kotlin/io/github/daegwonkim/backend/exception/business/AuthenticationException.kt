package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class AuthenticationException(
    val reason: Reason,
    message: String = "인증에 실패했습니다"
) : BusinessException(
    message = message,
    errorCode = ErrorCode.AUTHENTICATION_FAILED
) {
    enum class Reason {
        USER_NOT_FOUND,
        INVALID_TOKEN,
        TOKEN_EXPIRED,
        VERIFICATION_CODE_NOT_FOUND,
        VERIFICATION_CODE_MISMATCH,
        VERIFIED_TOKEN_NOT_FOUND,
        VERIFIED_TOKEN_MISMATCH,
        REFRESH_TOKEN_NOT_FOUND,
        REFRESH_TOKEN_MISMATCH
    }
}
