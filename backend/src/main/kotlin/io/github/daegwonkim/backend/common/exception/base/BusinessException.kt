package io.github.daegwonkim.backend.common.exception.base

import io.github.daegwonkim.backend.common.exception.data.ErrorCode
import java.lang.RuntimeException

abstract class BusinessException(
    val errorCode: ErrorCode,
    cause: Throwable? = null
) : RuntimeException(errorCode.message, cause)