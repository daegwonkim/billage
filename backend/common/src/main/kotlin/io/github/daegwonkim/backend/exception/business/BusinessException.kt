package io.github.daegwonkim.backend.exception.business

import io.github.daegwonkim.backend.exception.base.BaseException
import io.github.daegwonkim.backend.exception.base.ErrorCode

sealed class BusinessException(
    errorCode: ErrorCode,
    message: String,
    cause: Throwable? = null
) : BaseException(errorCode, message, cause)