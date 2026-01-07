package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.ErrorCode

sealed class BusinessException(
    message: String,
    errorCode: ErrorCode,
    cause: Throwable? = null
) : BaseException(message, errorCode, cause)