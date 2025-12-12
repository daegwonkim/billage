package io.github.daegwonkim.backend.exception.base

import io.github.daegwonkim.backend.exception.data.ErrorCode
import java.lang.RuntimeException

abstract class BusinessException(
    val errorCode: ErrorCode,
    cause: Throwable? = null
) : RuntimeException(errorCode.message, cause)