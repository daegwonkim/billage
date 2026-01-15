package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.errorcode.AuthErrorCode

class AuthenticationException(
    errorCode: AuthErrorCode = AuthErrorCode.AUTHENTICATION_FAILED,
    logMessage: String
) : BusinessException(
    errorCode = errorCode,
    logMessage = logMessage
)