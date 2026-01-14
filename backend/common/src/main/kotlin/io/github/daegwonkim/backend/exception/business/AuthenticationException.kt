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
        UNAUTHORIZED,
        INVALID_VERIFICATION_CODE,
        INVALID_VERIFIED_TOKEN,
        INVALID_NEIGHBORHOOD
    }
}
