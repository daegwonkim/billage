package io.github.daegwonkim.backend.common.exception

class NotFoundException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)