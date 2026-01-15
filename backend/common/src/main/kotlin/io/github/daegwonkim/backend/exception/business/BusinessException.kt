package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.ErrorCode

sealed class BusinessException(
    errorCode: ErrorCode,
    logMessage: String,
    cause: Throwable? = null
) : BaseException(errorCode, logMessage, cause)