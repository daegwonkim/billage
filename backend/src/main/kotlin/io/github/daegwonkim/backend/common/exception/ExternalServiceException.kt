package io.github.daegwonkim.backend.common.exception

class ExternalServiceException(
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BusinessException(errorCode, cause)