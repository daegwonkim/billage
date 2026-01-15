package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.errorcode.ErrorCode

sealed class InfraException(
    errorCode: ErrorCode,
    logMessage: String,
    cause: Throwable? = null
) : BaseException(errorCode, logMessage, cause)