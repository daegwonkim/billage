package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.errorcode.ErrorCode

abstract class InfraException(
    val errorCode: ErrorCode,
    logMessage: String,
    cause: Throwable? = null
) : RuntimeException(logMessage, cause)