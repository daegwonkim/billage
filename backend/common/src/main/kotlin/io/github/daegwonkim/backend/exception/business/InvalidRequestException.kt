package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class InvalidRequestException(
    message: String
) : BusinessException(
    message = message,
    errorCode = ErrorCode.VALIDATION_FAILED
)
