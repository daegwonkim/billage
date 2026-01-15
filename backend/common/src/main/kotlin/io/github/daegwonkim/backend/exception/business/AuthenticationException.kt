package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class AuthenticationException(
    errorCode: ErrorCode = ErrorCode.AUTHENTICATION_FAILED,
    logMessage: String
) : BusinessException(
    errorCode = errorCode,
    logMessage = logMessage
)