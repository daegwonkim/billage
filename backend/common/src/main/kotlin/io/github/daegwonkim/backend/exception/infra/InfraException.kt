package io.github.daegwonkim.backend.exception.infra

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.ErrorCode

sealed class InfraException(
    errorCode: ErrorCode,
    message: String,
    cause: Throwable? = null
) : BaseException(errorCode, message, cause)