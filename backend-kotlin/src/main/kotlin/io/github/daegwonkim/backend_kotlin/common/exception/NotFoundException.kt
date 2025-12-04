package io.github.daegwonkim.backend_kotlin.common.exception

class NotFoundException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)