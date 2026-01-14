package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.ErrorCode

class InvalidRequestException(
    errorCode: ErrorCode,
    message: String
) : BusinessException(
    errorCode = errorCode,
    message = message
)