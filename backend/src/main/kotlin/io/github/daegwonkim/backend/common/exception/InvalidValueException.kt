package io.github.daegwonkim.backend.common.exception

class InvalidValueException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)