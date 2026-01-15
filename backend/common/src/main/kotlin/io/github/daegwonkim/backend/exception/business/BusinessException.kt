package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.errorcode.ErrorCode

abstract class BusinessException(
    val errorCode: ErrorCode,
    logMessage: String,
    cause: Throwable? = null
) : RuntimeException(logMessage, cause)