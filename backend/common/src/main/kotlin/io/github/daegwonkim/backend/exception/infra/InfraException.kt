package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.ErrorCode

sealed class InfraException(
    message: String,
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BaseException(message, errorCode, cause)