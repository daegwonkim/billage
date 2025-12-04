package io.github.daegwonkim.backend_kotlin.common.exception

class ExternalServiceException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)